import { WORLD_W, WORLD_H, TILE_SIZE } from './constants.js'

export class Camera {
  constructor(viewW, viewH) {
    this.x = 0
    this.y = 0
    this.viewW = viewW
    this.viewH = viewH
  }

  follow(player, smooth = 0.12) {
    const targetX = player.x + player.size / 2 - this.viewW / 2
    const targetY = player.y + player.size / 2 - this.viewH / 2

    this.x += (targetX - this.x) * smooth
    this.y += (targetY - this.y) * smooth

    // Clamp to world bounds
    this.x = Math.max(0, Math.min(WORLD_W - this.viewW, this.x))
    this.y = Math.max(0, Math.min(WORLD_H - this.viewH, this.y))
  }

  /** Snap instantly (no lerp) */
  snapTo(player) {
    this.x = player.x + player.size / 2 - this.viewW / 2
    this.y = player.y + player.size / 2 - this.viewH / 2
    this.x = Math.max(0, Math.min(WORLD_W - this.viewW, this.x))
    this.y = Math.max(0, Math.min(WORLD_H - this.viewH, this.y))
  }

  /** Convert world coords to screen coords */
  worldToScreen(wx, wy) {
    return { x: wx - this.x, y: wy - this.y }
  }

  /** Returns which tile rows/cols are visible */
  getVisibleRange() {
    const startCol = Math.max(0, Math.floor(this.x / TILE_SIZE))
    const startRow = Math.max(0, Math.floor(this.y / TILE_SIZE))
    const endCol = Math.min(Math.ceil((this.x + this.viewW) / TILE_SIZE))
    const endRow = Math.min(Math.ceil((this.y + this.viewH) / TILE_SIZE))
    return { startCol, startRow, endCol, endRow }
  }
}
