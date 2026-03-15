import { PLAYER_SIZE, PLAYER_SPEED, PLAYER_ANIM_RATE, TILE_SIZE, SOLID_TILES, MAP_COLS, MAP_ROWS } from './constants.js'

export class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = PLAYER_SIZE
    this.direction = 'down'   // up | down | left | right
    this.animFrame = 0
    this.animTimer = 0
    this.moving = false
  }

  update(dt, input, groundLayer, objectLayer) {
    const { dx, dy } = input.getMovement()
    this.moving = dx !== 0 || dy !== 0

    if (this.moving) {
      // Set facing direction
      if (Math.abs(dx) > Math.abs(dy)) {
        this.direction = dx > 0 ? 'right' : 'left'
      } else {
        this.direction = dy > 0 ? 'down' : 'up'
      }

      // Calculate new position
      const speed = PLAYER_SPEED * dt
      let newX = this.x + dx * speed
      let newY = this.y + dy * speed

      // Collision check (check corners of the player hitbox)
      // Use a slightly smaller hitbox for smoother movement around corners
      const pad = 3
      const left = newX + pad
      const right = newX + this.size - pad
      const top = newY + pad
      const bottom = newY + this.size - pad

      // Check horizontal movement
      if (!this._blocked(left, this.y + pad, groundLayer, objectLayer) &&
          !this._blocked(right, this.y + pad, groundLayer, objectLayer) &&
          !this._blocked(left, this.y + this.size - pad, groundLayer, objectLayer) &&
          !this._blocked(right, this.y + this.size - pad, groundLayer, objectLayer)) {
        this.x = newX
      }

      // Check vertical movement
      if (!this._blocked(this.x + pad, top, groundLayer, objectLayer) &&
          !this._blocked(this.x + this.size - pad, top, groundLayer, objectLayer) &&
          !this._blocked(this.x + pad, bottom, groundLayer, objectLayer) &&
          !this._blocked(this.x + this.size - pad, bottom, groundLayer, objectLayer)) {
        this.y = newY
      }

      // Clamp to world bounds
      this.x = Math.max(0, Math.min((MAP_COLS - 1) * TILE_SIZE, this.x))
      this.y = Math.max(0, Math.min((MAP_ROWS - 1) * TILE_SIZE, this.y))

      // Animate walk cycle
      this.animTimer += dt
      if (this.animTimer >= PLAYER_ANIM_RATE) {
        this.animTimer = 0
        this.animFrame = (this.animFrame + 1) % 2
      }
    } else {
      this.animFrame = 0
      this.animTimer = 0
    }
  }

  _blocked(px, py, groundLayer, objectLayer) {
    const col = Math.floor(px / TILE_SIZE)
    const row = Math.floor(py / TILE_SIZE)
    if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return true
    const groundTile = groundLayer[row]?.[col] ?? 0
    const objectTile = objectLayer[row]?.[col] ?? 0
    return SOLID_TILES.has(groundTile) || SOLID_TILES.has(objectTile)
  }

  /** Center position */
  get cx() { return this.x + this.size / 2 }
  get cy() { return this.y + this.size / 2 }
}
