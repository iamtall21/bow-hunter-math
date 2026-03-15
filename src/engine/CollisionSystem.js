import { TILE_SIZE, MAP_COLS, MAP_ROWS, SOLID_TILES, ZONE } from './constants.js'

/**
 * Get the zone ID at a world pixel position.
 */
export function getZoneAt(zoneMap, px, py) {
  const col = Math.floor(px / TILE_SIZE)
  const row = Math.floor(py / TILE_SIZE)
  if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return null
  return zoneMap[row]?.[col] ?? null
}

/**
 * Distance between two points.
 */
export function dist(x1, y1, x2, y2) {
  const dx = x1 - x2
  const dy = y1 - y2
  return Math.sqrt(dx * dx + dy * dy)
}
