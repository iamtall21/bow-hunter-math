import { VIEW_W, VIEW_H, TILE_SIZE, TILE, COLORS, PERFECT_DIST, HIT_DIST, ZONE } from './constants.js'
import { InputManager } from './InputManager.js'
import { Camera } from './Camera.js'
import { Player } from './Player.js'
import { WorldManager } from './WorldManager.js'
import { MAP_GROUND, MAP_OBJECTS, MAP_CANOPY, MAP_ZONES, CAMP_TRIGGER } from './tileMap.js'
import { PLAYER_SPRITES, ANIMAL_SPRITES, TILE_COLORS as TC } from './sprites.js'
import { drawSprite } from './SpriteRenderer.js'
import { getZoneAt, dist } from './CollisionSystem.js'

const MAX_DT = 0.05 // cap delta time

export class GameLoop {
  constructor(canvas, storeApi, callbacks) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = false
    this.storeApi = storeApi
    this.callbacks = callbacks

    this.input = new InputManager()
    this.camera = new Camera(VIEW_W, VIEW_H)
    this.player = new Player(
      storeApi.getState().playerWorldX ?? (CAMP_TRIGGER.col * TILE_SIZE),
      storeApi.getState().playerWorldY ?? ((CAMP_TRIGGER.row + 2) * TILE_SIZE)
    )
    this.world = new WorldManager(MAP_ZONES, MAP_GROUND, MAP_OBJECTS, storeApi)
    this.camera.snapTo(this.player)

    this.running = false
    this.inputPaused = false // pause player input but keep rendering
    this.rafId = null
    this.lastTime = null
    this.currentZone = null

    // Forage sparkle spots
    this.forageSpots = this._generateForageSpots()
    this.sparkleTimer = 0
  }

  _generateForageSpots() {
    const spots = []
    for (let r = 0; r < MAP_ZONES.length; r++) {
      for (let c = 0; c < MAP_ZONES[0].length; c++) {
        const zone = MAP_ZONES[r][c]
        if ((zone === ZONE.MEADOW || zone === ZONE.FOREST) &&
            MAP_GROUND[r][c] !== TILE.DIRT &&
            MAP_GROUND[r][c] !== TILE.WATER &&
            MAP_OBJECTS[r][c] === 0 &&
            Math.random() < 0.008) {
          spots.push({ col: c, row: r, zone, collected: false })
        }
      }
    }
    return spots
  }

  start() {
    this.input.attach()
    this.running = true
    this.lastTime = performance.now()
    this._loop()
  }

  stop() {
    this.running = false
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.input.detach()
  }

  pause() {
    this.running = false
  }

  resume() {
    if (!this.running) {
      this.running = true
      this.inputPaused = false
      this.lastTime = performance.now()
      this._loop()
    }
  }

  /** Pause player input but keep rendering (for speech bubbles) */
  pauseInput() {
    this.inputPaused = true
  }

  /** Resume player input */
  resumeInput() {
    this.inputPaused = false
  }

  /** Get screen position of a world coordinate (for DOM overlay positioning) */
  getScreenPos(worldX, worldY) {
    return this.camera.worldToScreen(worldX, worldY)
  }

  _loop() {
    if (!this.running) return
    this.rafId = requestAnimationFrame((now) => {
      let dt = (now - this.lastTime) / 1000
      this.lastTime = now
      if (dt > MAX_DT) dt = MAX_DT

      this._update(dt)
      this._render()
      this.input.poll()
      this._loop()
    })
  }

  _update(dt) {
    // Player movement (skip if input paused)
    if (!this.inputPaused) {
      this.player.update(dt, this.input, MAP_GROUND, MAP_OBJECTS)
    }

    // Save player position
    this.storeApi.setState({
      playerWorldX: Math.round(this.player.x),
      playerWorldY: Math.round(this.player.y),
    })

    // Camera
    this.camera.follow(this.player)

    // Zone detection
    const zone = getZoneAt(MAP_ZONES, this.player.cx, this.player.cy)
    if (zone !== this.currentZone) {
      this.currentZone = zone
      this.callbacks.onZoneChange?.(zone)
    }

    // Update animals (freeze during encounters so they don't flee)
    if (!this.inputPaused) {
      this.world.update(dt, this.player.cx, this.player.cy)
    }

    // Sparkle animation
    this.sparkleTimer += dt

    // Action key checks (skip if input paused)
    if (!this.inputPaused && this.input.actionPressed()) {
      // Check camp trigger
      const campCol = Math.floor(this.player.cx / TILE_SIZE)
      const campRow = Math.floor(this.player.cy / TILE_SIZE)
      if (Math.abs(campCol - CAMP_TRIGGER.col) <= 1 && Math.abs(campRow - CAMP_TRIGGER.row) <= 1) {
        this.callbacks.onCampEnter?.()
        return
      }

      // Check animal encounter
      const encounter = this.world.getNearestEncounterable(this.player.cx, this.player.cy)
      if (encounter) {
        this.pauseInput()
        this.callbacks.onEncounter?.(encounter.animal, encounter.distance)
        return
      }

      // Check forage spot
      for (const spot of this.forageSpots) {
        if (spot.collected) continue
        const sx = spot.col * TILE_SIZE + TILE_SIZE / 2
        const sy = spot.row * TILE_SIZE + TILE_SIZE / 2
        if (dist(this.player.cx, this.player.cy, sx, sy) < TILE_SIZE * 1.5) {
          spot.collected = true
          this.pauseInput()
          this.callbacks.onForage?.(spot)
          return
        }
      }
    }
  }

  _render() {
    const ctx = this.ctx
    const cam = this.camera

    ctx.clearRect(0, 0, VIEW_W, VIEW_H)

    const { startCol, startRow, endCol, endRow } = cam.getVisibleRange()

    // Layer 0: Ground
    for (let r = startRow; r <= endRow && r < MAP_GROUND.length; r++) {
      for (let c = startCol; c <= endCol && c < MAP_GROUND[0].length; c++) {
        const tile = MAP_GROUND[r][c]
        const { x, y } = cam.worldToScreen(c * TILE_SIZE, r * TILE_SIZE)
        ctx.fillStyle = TC[tile] || COLORS.grass
        ctx.fillRect(Math.floor(x), Math.floor(y), TILE_SIZE, TILE_SIZE)

        if (tile === TILE.TALL_GRASS) {
          ctx.fillStyle = '#6aae5a'
          ctx.fillRect(Math.floor(x) + 3, Math.floor(y) + 2, 2, 6)
          ctx.fillRect(Math.floor(x) + 8, Math.floor(y) + 4, 2, 5)
          ctx.fillRect(Math.floor(x) + 12, Math.floor(y) + 1, 2, 7)
        }

        if (tile === TILE.FLOWERS) {
          ctx.fillStyle = COLORS.flowers
          ctx.fillRect(Math.floor(x) + 4, Math.floor(y) + 4, 3, 3)
          ctx.fillStyle = COLORS.flowerYellow
          ctx.fillRect(Math.floor(x) + 10, Math.floor(y) + 8, 3, 3)
        }

        if (tile === TILE.REEDS) {
          ctx.fillStyle = COLORS.reeds
          ctx.fillRect(Math.floor(x) + 3, Math.floor(y), 2, 12)
          ctx.fillRect(Math.floor(x) + 9, Math.floor(y) + 2, 2, 10)
        }

        if (tile === TILE.WATER) {
          const shimmer = Math.sin(this.sparkleTimer * 2 + c * 0.5 + r * 0.3) * 0.5 + 0.5
          if (shimmer > 0.7) {
            ctx.fillStyle = 'rgba(255,255,255,0.15)'
            ctx.fillRect(Math.floor(x) + 4, Math.floor(y) + 6, 4, 2)
          }
        }

        if (tile === TILE.BRIDGE) {
          ctx.fillStyle = '#7a5a3a'
          for (let p = 0; p < 16; p += 4) {
            ctx.fillRect(Math.floor(x), Math.floor(y) + p, TILE_SIZE, 1)
          }
        }
      }
    }

    // Layer 1: Objects
    for (let r = startRow; r <= endRow && r < MAP_OBJECTS.length; r++) {
      for (let c = startCol; c <= endCol && c < MAP_OBJECTS[0].length; c++) {
        const tile = MAP_OBJECTS[r][c]
        if (tile === 0) continue
        const { x, y } = cam.worldToScreen(c * TILE_SIZE, r * TILE_SIZE)

        if (tile === TILE.TREE_TRUNK) {
          ctx.fillStyle = COLORS.treeTrunk
          ctx.fillRect(Math.floor(x) + 5, Math.floor(y), 6, TILE_SIZE)
          ctx.fillStyle = COLORS.treeLeaves
          ctx.fillRect(Math.floor(x) + 1, Math.floor(y) - 6, 14, 10)
          ctx.fillStyle = COLORS.treeLeavesDark
          ctx.fillRect(Math.floor(x) + 3, Math.floor(y) - 4, 10, 6)
        }

        if (tile === TILE.ROCK) {
          ctx.fillStyle = COLORS.rock
          ctx.fillRect(Math.floor(x) + 2, Math.floor(y) + 4, 12, 10)
          ctx.fillStyle = COLORS.rockDark
          ctx.fillRect(Math.floor(x) + 3, Math.floor(y) + 6, 10, 6)
        }

        if (tile === TILE.BUSH) {
          ctx.fillStyle = COLORS.bush
          ctx.fillRect(Math.floor(x) + 1, Math.floor(y) + 4, 14, 10)
          ctx.fillStyle = COLORS.treeLeaves
          ctx.fillRect(Math.floor(x) + 3, Math.floor(y) + 3, 10, 8)
        }

        if (tile === TILE.TENT) {
          ctx.fillStyle = COLORS.tent
          ctx.fillRect(Math.floor(x), Math.floor(y) + 4, 16, 12)
          ctx.fillStyle = COLORS.tentDark
          ctx.fillRect(Math.floor(x) + 2, Math.floor(y) + 2, 12, 10)
          ctx.fillStyle = COLORS.dirt
          ctx.fillRect(Math.floor(x) + 5, Math.floor(y) + 8, 6, 8)
        }

        if (tile === TILE.CAMPFIRE) {
          ctx.fillStyle = COLORS.campfireGlow
          ctx.fillRect(Math.floor(x) + 5, Math.floor(y) + 8, 6, 4)
          ctx.fillStyle = COLORS.campfire
          const flicker = Math.sin(this.sparkleTimer * 6) * 2
          ctx.fillRect(Math.floor(x) + 6, Math.floor(y) + 4 + flicker, 4, 4)
        }
      }
    }

    // Forage sparkle spots
    for (const spot of this.forageSpots) {
      if (spot.collected) continue
      const { x, y } = cam.worldToScreen(spot.col * TILE_SIZE, spot.row * TILE_SIZE)
      if (x < -16 || x > VIEW_W + 16 || y < -16 || y > VIEW_H + 16) continue
      const pulse = Math.sin(this.sparkleTimer * 4 + spot.col) * 0.5 + 0.5
      ctx.fillStyle = `rgba(255, 255, 180, ${0.3 + pulse * 0.5})`
      ctx.fillRect(Math.floor(x) + 6, Math.floor(y) + 6, 4, 4)
      ctx.fillStyle = `rgba(255, 255, 255, ${pulse * 0.6})`
      ctx.fillRect(Math.floor(x) + 7, Math.floor(y) + 7, 2, 2)
    }

    // Entities sorted by Y
    const entities = []

    entities.push({
      y: this.player.y,
      render: () => {
        const sprite = PLAYER_SPRITES[this.player.direction][this.player.animFrame]
        const { x, y } = cam.worldToScreen(this.player.x, this.player.y)
        drawSprite(ctx, sprite, Math.floor(x), Math.floor(y))
      }
    })

    for (const animal of this.world.animals) {
      if (animal.dead) continue
      entities.push({
        y: animal.y,
        render: () => {
          const spriteData = ANIMAL_SPRITES[animal.speciesId]
          if (!spriteData) return
          const frame = spriteData.frames[animal.animFrame % spriteData.frames.length]
          const { x, y } = cam.worldToScreen(animal.x, animal.y)
          drawSprite(ctx, frame, Math.floor(x), Math.floor(y))

          if (animal.isAlert) {
            ctx.fillStyle = '#e8e840'
            ctx.font = '10px Georgia'
            ctx.fillText('!', Math.floor(x) + animal.size / 2 - 2, Math.floor(y) - 4)
          }
        }
      })
    }

    entities.sort((a, b) => a.y - b.y)
    for (const e of entities) e.render()

    // Layer 2: Canopy
    for (let r = startRow; r <= endRow && r < MAP_CANOPY.length; r++) {
      for (let c = startCol; c <= endCol && c < MAP_CANOPY[0].length; c++) {
        const tile = MAP_CANOPY[r][c]
        if (tile === 0) continue
        if (tile === TILE.TREE_TOP) {
          const { x, y } = cam.worldToScreen(c * TILE_SIZE, r * TILE_SIZE)
          ctx.fillStyle = COLORS.treeLeaves
          ctx.globalAlpha = 0.7
          ctx.fillRect(Math.floor(x), Math.floor(y), TILE_SIZE, TILE_SIZE)
          ctx.fillStyle = COLORS.treeLeavesDark
          ctx.fillRect(Math.floor(x) + 2, Math.floor(y) + 2, 12, 12)
          ctx.globalAlpha = 1
        }
      }
    }

    // UI prompts (only when input not paused)
    if (!this.inputPaused) {
      const nearest = this.world.getNearestEncounterable(this.player.cx, this.player.cy)
      if (nearest) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(VIEW_W / 2 - 50, VIEW_H - 24, 100, 18)
        ctx.fillStyle = '#e8c97a'
        ctx.font = '9px Georgia'
        ctx.textAlign = 'center'
        ctx.fillText('[SPACE] Hunt', VIEW_W / 2, VIEW_H - 11)
        ctx.textAlign = 'start'
      }

      const campCol = Math.floor(this.player.cx / TILE_SIZE)
      const campRow = Math.floor(this.player.cy / TILE_SIZE)
      if (Math.abs(campCol - CAMP_TRIGGER.col) <= 1 && Math.abs(campRow - CAMP_TRIGGER.row) <= 1) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(VIEW_W / 2 - 50, VIEW_H - 24, 100, 18)
        ctx.fillStyle = '#e8c97a'
        ctx.font = '9px Georgia'
        ctx.textAlign = 'center'
        ctx.fillText('[SPACE] Enter Camp', VIEW_W / 2, VIEW_H - 11)
        ctx.textAlign = 'start'
      }
    }
  }

  getHuntResult(distance) {
    if (distance <= PERFECT_DIST) return 'perfect'
    if (distance <= HIT_DIST) return 'hit'
    return 'hit'
  }
}
