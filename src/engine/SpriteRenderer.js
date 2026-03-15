/**
 * Draw a pixel-art sprite (2D array of hex colors) onto a canvas context.
 * Null entries are transparent.
 */
export function drawSprite(ctx, spriteData, x, y, scale = 1) {
  const rows = spriteData.length
  for (let r = 0; r < rows; r++) {
    const row = spriteData[r]
    const cols = row.length
    for (let c = 0; c < cols; c++) {
      const color = row[c]
      if (color === null) continue
      ctx.fillStyle = color
      ctx.fillRect(
        Math.floor(x + c * scale),
        Math.floor(y + r * scale),
        scale,
        scale
      )
    }
  }
}

/**
 * Pre-render a sprite to an offscreen canvas for faster blitting.
 * Returns the offscreen canvas.
 */
export function spriteToCanvas(spriteData, scale = 1) {
  const rows = spriteData.length
  const cols = spriteData[0].length
  const canvas = document.createElement('canvas')
  canvas.width = cols * scale
  canvas.height = rows * scale
  const ctx = canvas.getContext('2d')
  drawSprite(ctx, spriteData, 0, 0, scale)
  return canvas
}

// Cache for pre-rendered sprites
const _cache = new Map()

/**
 * Get or create a cached offscreen canvas for a sprite.
 */
export function getCachedSprite(key, spriteData, scale = 1) {
  const cacheKey = `${key}_${scale}`
  if (!_cache.has(cacheKey)) {
    _cache.set(cacheKey, spriteToCanvas(spriteData, scale))
  }
  return _cache.get(cacheKey)
}
