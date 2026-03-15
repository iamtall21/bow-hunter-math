// Tile & map
export const TILE_SIZE = 16
export const MAP_COLS = 64
export const MAP_ROWS = 48
export const WORLD_W = MAP_COLS * TILE_SIZE  // 1024
export const WORLD_H = MAP_ROWS * TILE_SIZE  // 768

// Viewport (native canvas resolution — CSS scales it up)
export const VIEW_W = 320
export const VIEW_H = 240

// Player
export const PLAYER_SIZE = 16
export const PLAYER_SPEED = 80 // pixels per second
export const PLAYER_ANIM_RATE = 0.2 // seconds per frame

// Animals
export const ANIMAL_WANDER_SPEED = 35
export const ANIMAL_FLEE_SPEED = 140
export const ANIMAL_AWARENESS_RADIUS = 72 // px
export const ANIMAL_ENCOUNTER_RADIUS = 48 // px (3 tiles)
export const ANIMAL_ALERT_TIME = 2.5 // seconds before fleeing
export const ANIMAL_INSTANT_FLEE_MULT = 3 // speed multiplier for bolting

// Encounter distance thresholds (for perfect vs hit)
export const PERFECT_DIST = 20  // px
export const HIT_DIST = 40      // px

// Zone IDs
export const ZONE = {
  CAMP: 'camp',
  MEADOW: 'meadow',
  RIVER: 'river',
  FOREST: 'forest',
}

// Tile type IDs
export const TILE = {
  GRASS: 0,
  TALL_GRASS: 1,
  DIRT: 2,
  WATER: 3,
  WATER_EDGE: 4,
  SAND: 5,
  TREE_TRUNK: 6,
  ROCK: 8,
  BUSH: 9,
  FLOWERS: 10,
  CAMPFIRE: 11,
  TENT: 12,
  BRIDGE: 13,
  REEDS: 14,
  TREE_TOP: 15,
  DARK_GRASS: 16,
}

// Solid tiles (cannot walk through)
export const SOLID_TILES = new Set([
  TILE.WATER,
  TILE.TREE_TRUNK,
  TILE.ROCK,
  TILE.BUSH,
  TILE.TENT,
])

// Colors
export const COLORS = {
  grass: '#4a8c3f',
  grassDark: '#3d7534',
  tallGrass: '#5a9e4a',
  dirt: '#9e8a6e',
  water: '#3a7cc2',
  waterDark: '#2d6aaa',
  waterEdge: '#6ba3d4',
  sand: '#d4c49a',
  treeTrunk: '#6b4e2f',
  treeLeaves: '#2d6b2d',
  treeLeavesDark: '#1f5a1f',
  rock: '#8a8a8a',
  rockDark: '#6e6e6e',
  bush: '#3a7a3a',
  campfire: '#e8a030',
  campfireGlow: '#d44a00',
  tent: '#8b6e50',
  tentDark: '#6b5040',
  bridge: '#9e7a4a',
  reeds: '#7aaa5a',
  flowers: '#d45a8a',
  flowerYellow: '#e8c84a',
  skin: '#e8b87a',
  hair: '#5a3a1e',
  tunic: '#4a7a3a',
  tunicDark: '#3a6a2a',
  boots: '#5a3a1e',
  quiver: '#8a6a3a',
  bow: '#9e7a4a',
}
