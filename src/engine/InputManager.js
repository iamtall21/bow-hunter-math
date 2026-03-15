export class InputManager {
  constructor() {
    this.keys = {}
    this._justPressed = new Set()
    this._onKeyDown = (e) => {
      if (!this.keys[e.code]) {
        this._justPressed.add(e.code)
      }
      this.keys[e.code] = true
    }
    this._onKeyUp = (e) => { this.keys[e.code] = false }
  }

  attach() {
    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup', this._onKeyUp)
  }

  detach() {
    window.removeEventListener('keydown', this._onKeyDown)
    window.removeEventListener('keyup', this._onKeyUp)
    this.keys = {}
    this._justPressed.clear()
  }

  /** Call once per frame AFTER update to clear consumed presses */
  poll() {
    this._justPressed.clear()
  }

  isDown(code) {
    return !!this.keys[code]
  }

  wasPressed(code) {
    return this._justPressed.has(code)
  }

  /** Returns normalized { dx, dy } from WASD / arrow keys */
  getMovement() {
    let dx = 0
    let dy = 0
    if (this.isDown('KeyW') || this.isDown('ArrowUp')) dy -= 1
    if (this.isDown('KeyS') || this.isDown('ArrowDown')) dy += 1
    if (this.isDown('KeyA') || this.isDown('ArrowLeft')) dx -= 1
    if (this.isDown('KeyD') || this.isDown('ArrowRight')) dx += 1

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy)
      dx /= len
      dy /= len
    }
    return { dx, dy }
  }

  /** Action key (Space or E) */
  actionPressed() {
    return this.wasPressed('Space') || this.wasPressed('KeyE')
  }
}
