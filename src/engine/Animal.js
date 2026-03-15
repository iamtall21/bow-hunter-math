import {
  ANIMAL_WANDER_SPEED, ANIMAL_FLEE_SPEED, ANIMAL_INSTANT_FLEE_MULT,
  ANIMAL_AWARENESS_RADIUS, ANIMAL_ALERT_TIME,
  TILE_SIZE, MAP_COLS, MAP_ROWS, SOLID_TILES
} from './constants.js'

const STATE = { IDLE: 0, WANDER: 1, ALERT: 2, FLEE: 3 }

export class Animal {
  constructor(id, speciesId, x, y, size) {
    this.id = id
    this.speciesId = speciesId
    this.x = x
    this.y = y
    this.size = size
    this.state = STATE.IDLE
    this.animFrame = 0
    this.animTimer = 0

    // Wander target
    this.targetX = x
    this.targetY = y

    // Timers
    this.idleTimer = 1 + Math.random() * 3
    this.alertTimer = 0

    // Flee direction
    this.fleeDx = 0
    this.fleeDy = 0
    this._fleeSpeed = ANIMAL_FLEE_SPEED

    this.dead = false // marked for removal after hunt
  }

  /** Bolt instantly at untrackable speed (wrong math answer) */
  instantFlee(playerX, playerY) {
    this.state = STATE.FLEE
    const fdx = this.cx - playerX
    const fdy = this.cy - playerY
    const fd = Math.sqrt(fdx * fdx + fdy * fdy) || 1
    this.fleeDx = fdx / fd
    this.fleeDy = fdy / fd
    this._fleeSpeed = ANIMAL_FLEE_SPEED * ANIMAL_INSTANT_FLEE_MULT
  }

  update(dt, playerX, playerY, groundLayer, objectLayer) {
    if (this.dead) return

    const distToPlayer = Math.sqrt(
      (this.cx - playerX) ** 2 + (this.cy - playerY) ** 2
    )

    this.animTimer += dt
    if (this.animTimer > 0.5) {
      this.animTimer = 0
      this.animFrame = (this.animFrame + 1) % 2
    }

    switch (this.state) {
      case STATE.IDLE:
        this.idleTimer -= dt
        if (this.idleTimer <= 0) {
          // Pick a random nearby position to wander to (wider range)
          this.targetX = this.x + (Math.random() - 0.5) * 140
          this.targetY = this.y + (Math.random() - 0.5) * 140
          // Clamp to world
          this.targetX = Math.max(16, Math.min((MAP_COLS - 2) * TILE_SIZE, this.targetX))
          this.targetY = Math.max(16, Math.min((MAP_ROWS - 2) * TILE_SIZE, this.targetY))
          this.state = STATE.WANDER
        }
        // Check if player is too close
        if (distToPlayer < ANIMAL_AWARENESS_RADIUS) {
          this.state = STATE.ALERT
          this.alertTimer = ANIMAL_ALERT_TIME
        }
        break

      case STATE.WANDER: {
        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 2) {
          this.state = STATE.IDLE
          this.idleTimer = 2 + Math.random() * 3
        } else {
          const speed = ANIMAL_WANDER_SPEED * dt
          const nx = dx / d
          const ny = dy / d
          const newX = this.x + nx * speed
          const newY = this.y + ny * speed
          if (!this._blocked(newX, this.y, groundLayer, objectLayer)) this.x = newX
          if (!this._blocked(this.x, newY, groundLayer, objectLayer)) this.y = newY
        }
        // Check player proximity
        if (distToPlayer < ANIMAL_AWARENESS_RADIUS) {
          this.state = STATE.ALERT
          this.alertTimer = ANIMAL_ALERT_TIME
        }
        break
      }

      case STATE.ALERT:
        this.alertTimer -= dt
        // If player backs off, return to idle
        if (distToPlayer > ANIMAL_AWARENESS_RADIUS * 1.5) {
          this.state = STATE.IDLE
          this.idleTimer = 1
        }
        // If timer expires, flee
        if (this.alertTimer <= 0) {
          this.state = STATE.FLEE
          this._fleeSpeed = ANIMAL_FLEE_SPEED
          // Flee away from player
          const fdx = this.cx - playerX
          const fdy = this.cy - playerY
          const fd = Math.sqrt(fdx * fdx + fdy * fdy) || 1
          this.fleeDx = fdx / fd
          this.fleeDy = fdy / fd
        }
        break

      case STATE.FLEE: {
        const speed = this._fleeSpeed * dt
        this.x += this.fleeDx * speed
        this.y += this.fleeDy * speed
        // If off map, mark dead
        if (this.x < -32 || this.x > MAP_COLS * TILE_SIZE + 32 ||
            this.y < -32 || this.y > MAP_ROWS * TILE_SIZE + 32) {
          this.dead = true
        }
        break
      }
    }
  }

  _blocked(px, py, groundLayer, objectLayer) {
    const col = Math.floor(px / TILE_SIZE)
    const row = Math.floor(py / TILE_SIZE)
    if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return false
    const gt = groundLayer[row]?.[col] ?? 0
    const ot = objectLayer[row]?.[col] ?? 0
    return SOLID_TILES.has(gt) || SOLID_TILES.has(ot)
  }

  get cx() { return this.x + this.size / 2 }
  get cy() { return this.y + this.size / 2 }

  get isAlert() { return this.state === STATE.ALERT }
  get isFleeing() { return this.state === STATE.FLEE }
}
