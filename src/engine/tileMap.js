import { TILE as T, ZONE, MAP_COLS, MAP_ROWS } from './constants.js'

/**
 * Generate the world map procedurally.
 * 64 cols x 48 rows. Four zones:
 *   Camp (top-left ~16x12), Meadow (top-right ~48x24),
 *   Forest (bottom-left ~24x24), River (bottom-right ~40x24)
 */

function createEmptyMap(fill = 0) {
  return Array.from({ length: MAP_ROWS }, () => Array(MAP_COLS).fill(fill))
}

// ---- GROUND LAYER ----
const ground = createEmptyMap(T.GRASS)

// River band: cols 38-44, rows 20-47
for (let r = 18; r < MAP_ROWS; r++) {
  for (let c = 36; c < 46; c++) {
    ground[r][c] = T.WATER
  }
  // Water edges
  if (r >= 18) {
    ground[r][35] = T.SAND
    ground[r][46] = T.SAND
  }
}
// River widens toward bottom
for (let r = 30; r < MAP_ROWS; r++) {
  for (let c = 34; c < 48; c++) {
    if (ground[r][c] !== T.WATER) ground[r][c] = T.WATER
  }
  ground[r][33] = T.SAND
  ground[r][48] = T.SAND
}

// Dirt paths
// Horizontal path from camp to meadow (row 10)
for (let c = 0; c < 35; c++) {
  ground[10][c] = T.DIRT
  ground[11][c] = T.DIRT
}
// Vertical path from camp down to forest (col 12-13)
for (let r = 10; r < MAP_ROWS; r++) {
  ground[r][12] = T.DIRT
  ground[r][13] = T.DIRT
}
// Path to river (row 24)
for (let c = 13; c < 36; c++) {
  ground[24][c] = T.DIRT
  ground[25][c] = T.DIRT
}

// Bridge over river (row 24-25, cols 36-45)
for (let c = 36; c < 46; c++) {
  ground[24][c] = T.BRIDGE
  ground[25][c] = T.BRIDGE
}

// Camp area — dirt ground around tent (top-left corner)
for (let r = 4; r < 9; r++) {
  for (let c = 4; c < 12; c++) {
    ground[r][c] = T.DIRT
  }
}

// Tall grass patches in meadow
for (let r = 2; r < 18; r++) {
  for (let c = 20; c < 60; c++) {
    if (ground[r][c] === T.GRASS && Math.random() < 0.35) {
      ground[r][c] = T.TALL_GRASS
    }
  }
}

// Dark grass in forest
for (let r = 26; r < MAP_ROWS; r++) {
  for (let c = 0; c < 30; c++) {
    if (ground[r][c] === T.GRASS && Math.random() < 0.4) {
      ground[r][c] = T.DARK_GRASS
    }
  }
}

// Flowers in meadow
for (let r = 2; r < 16; r++) {
  for (let c = 22; c < 58; c++) {
    if (ground[r][c] === T.GRASS && Math.random() < 0.06) {
      ground[r][c] = T.FLOWERS
    }
  }
}

// Reeds near river
for (let r = 18; r < MAP_ROWS; r++) {
  if (ground[r][34] === T.GRASS || ground[r][34] === T.SAND) ground[r][34] = T.REEDS
  if (ground[r][47] === T.GRASS || ground[r][47] === T.SAND) ground[r][47] = T.REEDS
}

// ---- OBJECT LAYER (trees, rocks, bushes, tent, campfire) ----
const objects = createEmptyMap(0)

// Camp tent and campfire
objects[5][7] = T.TENT
objects[5][8] = T.TENT
objects[7][8] = T.CAMPFIRE

// Trees scattered around edges and forest
const treePositions = []

// Border trees (top/bottom edges)
for (let c = 0; c < MAP_COLS; c++) {
  if (Math.random() < 0.6) { objects[0][c] = T.TREE_TRUNK; treePositions.push([0, c]) }
  if (Math.random() < 0.6) { objects[1][c] = T.TREE_TRUNK; treePositions.push([1, c]) }
  if (Math.random() < 0.5) { objects[MAP_ROWS - 1][c] = T.TREE_TRUNK }
  if (Math.random() < 0.5) { objects[MAP_ROWS - 2][c] = T.TREE_TRUNK }
}
// Border trees (left/right edges)
for (let r = 0; r < MAP_ROWS; r++) {
  if (Math.random() < 0.6) { objects[r][0] = T.TREE_TRUNK }
  if (Math.random() < 0.5) { objects[r][1] = T.TREE_TRUNK }
  if (Math.random() < 0.6) { objects[r][MAP_COLS - 1] = T.TREE_TRUNK }
  if (Math.random() < 0.5) { objects[r][MAP_COLS - 2] = T.TREE_TRUNK }
}

// Forest zone — dense trees
for (let r = 28; r < MAP_ROWS - 2; r++) {
  for (let c = 2; c < 28; c++) {
    if (ground[r][c] === T.DIRT) continue // keep paths clear
    if (objects[r][c] !== 0) continue
    if (Math.random() < 0.25) {
      objects[r][c] = T.TREE_TRUNK
      treePositions.push([r, c])
    } else if (Math.random() < 0.08) {
      objects[r][c] = T.BUSH
    }
  }
}

// Scattered trees in meadow
for (let r = 2; r < 18; r++) {
  for (let c = 18; c < MAP_COLS - 2; c++) {
    if (ground[r][c] === T.DIRT || ground[r][c] === T.WATER) continue
    if (objects[r][c] !== 0) continue
    if (Math.random() < 0.04) {
      objects[r][c] = T.TREE_TRUNK
      treePositions.push([r, c])
    }
  }
}

// Rocks near river and in forest
for (let r = 18; r < MAP_ROWS; r++) {
  for (let c = 30; c < 35; c++) {
    if (ground[r][c] === T.DIRT || ground[r][c] === T.WATER) continue
    if (objects[r][c] !== 0) continue
    if (Math.random() < 0.08) {
      objects[r][c] = T.ROCK
    }
  }
}

// ---- CANOPY LAYER (tree tops that render above player) ----
const canopy = createEmptyMap(0)
for (const [r, c] of treePositions) {
  // Tree canopy is one row above the trunk
  if (r > 0) canopy[r - 1][c] = T.TREE_TOP
  // Also spread canopy
  if (r > 0 && c > 0 && canopy[r - 1][c - 1] === 0 && Math.random() < 0.4) canopy[r - 1][c - 1] = T.TREE_TOP
  if (r > 0 && c < MAP_COLS - 1 && canopy[r - 1][c + 1] === 0 && Math.random() < 0.4) canopy[r - 1][c + 1] = T.TREE_TOP
}

// ---- ZONE MAP ----
const zones = createEmptyMap(ZONE.MEADOW)

// Camp zone: top-left quadrant
for (let r = 0; r < 16; r++) {
  for (let c = 0; c < 16; c++) {
    zones[r][c] = ZONE.CAMP
  }
}

// Forest zone: bottom-left
for (let r = 26; r < MAP_ROWS; r++) {
  for (let c = 0; c < 30; c++) {
    zones[r][c] = ZONE.FOREST
  }
}

// River zone: around the water
for (let r = 16; r < MAP_ROWS; r++) {
  for (let c = 30; c < MAP_COLS; c++) {
    zones[r][c] = ZONE.RIVER
  }
}

// Export
export const MAP_GROUND = ground
export const MAP_OBJECTS = objects
export const MAP_CANOPY = canopy
export const MAP_ZONES = zones

// Camp trigger position (the tent)
export const CAMP_TRIGGER = { col: 7, row: 5 }
