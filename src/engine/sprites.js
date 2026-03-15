import { COLORS as C } from './constants.js'

// Shorthand
const _ = null  // transparent
const s = C.skin
const h = C.hair
const t = C.tunic
const d = C.tunicDark
const b = C.boots
const q = C.quiver
const w = C.bow

// ============================================================
// PLAYER SPRITES (16x16)
// ============================================================

const PLAYER_DOWN_0 = [
  [_,_,_,_,_,_,h,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,h,_,_,_,_,_],
  [_,_,_,_,_,h,s,s,s,s,h,_,_,_,_,_],
  [_,_,_,_,_,s,s,s,s,s,s,_,_,_,_,_],
  [_,_,_,_,_,_,s,s,s,s,_,_,_,_,_,_],
  [_,_,_,_,_,t,t,t,t,t,t,_,_,_,_,_],
  [_,_,_,_,t,t,t,t,t,t,t,q,_,_,_,_],
  [_,_,_,_,t,t,t,t,t,t,t,q,_,_,_,_],
  [_,_,_,s,t,t,t,t,t,t,t,q,_,_,_,_],
  [_,_,_,s,_,t,t,t,t,t,_,s,_,_,_,_],
  [_,_,_,_,_,d,d,d,d,d,_,_,_,_,_,_],
  [_,_,_,_,_,d,d,d,d,d,_,_,_,_,_,_],
  [_,_,_,_,_,b,_,_,_,b,_,_,_,_,_,_],
  [_,_,_,_,_,b,_,_,_,b,_,_,_,_,_,_],
  [_,_,_,_,b,b,_,_,_,b,b,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

const PLAYER_DOWN_1 = [
  [_,_,_,_,_,_,h,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,h,_,_,_,_,_],
  [_,_,_,_,_,h,s,s,s,s,h,_,_,_,_,_],
  [_,_,_,_,_,s,s,s,s,s,s,_,_,_,_,_],
  [_,_,_,_,_,_,s,s,s,s,_,_,_,_,_,_],
  [_,_,_,_,_,t,t,t,t,t,t,_,_,_,_,_],
  [_,_,_,_,t,t,t,t,t,t,t,q,_,_,_,_],
  [_,_,_,_,t,t,t,t,t,t,t,q,_,_,_,_],
  [_,_,_,_,s,t,t,t,t,t,s,q,_,_,_,_],
  [_,_,_,_,_,t,t,t,t,t,_,_,_,_,_,_],
  [_,_,_,_,_,d,d,d,d,d,_,_,_,_,_,_],
  [_,_,_,_,_,d,d,d,d,d,_,_,_,_,_,_],
  [_,_,_,_,b,b,_,_,_,_,b,_,_,_,_,_],
  [_,_,_,_,b,_,_,_,_,_,b,_,_,_,_,_],
  [_,_,_,_,b,_,_,_,_,b,b,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

const PLAYER_UP_0 = [
  [_,_,_,_,_,_,h,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,h,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,h,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,h,_,_,_,_,_],
  [_,_,_,_,_,_,h,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,_,t,t,t,t,t,t,_,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,t,_,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,t,_,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,t,s,_,_,_,_],
  [_,_,_,_,_,t,t,t,t,t,_,s,_,_,_,_],
  [_,_,_,_,_,d,d,d,d,d,_,_,_,_,_,_],
  [_,_,_,_,_,d,d,d,d,d,_,_,_,_,_,_],
  [_,_,_,_,_,b,_,_,_,b,_,_,_,_,_,_],
  [_,_,_,_,_,b,_,_,_,b,_,_,_,_,_,_],
  [_,_,_,_,b,b,_,_,_,b,b,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

const PLAYER_UP_1 = [
  [_,_,_,_,_,_,h,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,h,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,h,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,h,_,_,_,_,_],
  [_,_,_,_,_,_,h,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,_,t,t,t,t,t,t,_,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,t,_,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,t,_,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,s,_,_,_,_,_],
  [_,_,_,_,_,t,t,t,t,t,_,_,_,_,_,_],
  [_,_,_,_,_,d,d,d,d,d,_,_,_,_,_,_],
  [_,_,_,_,_,d,d,d,d,d,_,_,_,_,_,_],
  [_,_,_,_,b,b,_,_,_,_,b,_,_,_,_,_],
  [_,_,_,_,b,_,_,_,_,_,b,_,_,_,_,_],
  [_,_,_,_,b,_,_,_,_,b,b,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

const PLAYER_LEFT_0 = [
  [_,_,_,_,_,_,h,h,h,_,_,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,s,s,s,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,s,s,s,s,h,_,_,_,_,_,_,_],
  [_,_,_,_,_,s,s,s,_,_,_,_,_,_,_,_],
  [_,_,_,_,t,t,t,t,t,_,_,_,_,_,_,_],
  [_,_,_,t,t,t,t,t,t,q,_,_,_,_,_,_],
  [_,_,w,t,t,t,t,t,t,q,_,_,_,_,_,_],
  [_,_,s,t,t,t,t,t,t,q,_,_,_,_,_,_],
  [_,_,_,_,t,t,t,t,t,_,_,_,_,_,_,_],
  [_,_,_,_,d,d,d,d,d,_,_,_,_,_,_,_],
  [_,_,_,_,d,d,_,d,d,_,_,_,_,_,_,_],
  [_,_,_,_,b,_,_,_,b,_,_,_,_,_,_,_],
  [_,_,_,_,b,_,_,_,b,_,_,_,_,_,_,_],
  [_,_,_,b,b,_,_,_,b,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

const PLAYER_LEFT_1 = [
  [_,_,_,_,_,_,h,h,h,_,_,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,s,s,s,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,s,s,s,s,h,_,_,_,_,_,_,_],
  [_,_,_,_,_,s,s,s,_,_,_,_,_,_,_,_],
  [_,_,_,_,t,t,t,t,t,_,_,_,_,_,_,_],
  [_,_,_,t,t,t,t,t,t,q,_,_,_,_,_,_],
  [_,_,w,t,t,t,t,t,t,q,_,_,_,_,_,_],
  [_,_,s,t,t,t,t,t,t,q,_,_,_,_,_,_],
  [_,_,_,_,t,t,t,t,t,_,_,_,_,_,_,_],
  [_,_,_,_,d,d,d,d,d,_,_,_,_,_,_,_],
  [_,_,_,_,d,d,_,d,d,_,_,_,_,_,_,_],
  [_,_,_,b,b,_,_,b,_,_,_,_,_,_,_,_],
  [_,_,_,b,_,_,_,b,_,_,_,_,_,_,_,_],
  [_,_,_,b,_,_,b,b,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

const PLAYER_RIGHT_0 = [
  [_,_,_,_,_,_,_,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,s,s,s,_,_,_,_,_],
  [_,_,_,_,_,_,h,s,s,s,s,_,_,_,_,_],
  [_,_,_,_,_,_,_,s,s,s,_,_,_,_,_,_],
  [_,_,_,_,_,t,t,t,t,t,_,_,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,t,_,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,t,w,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,t,s,_,_,_,_],
  [_,_,_,_,_,t,t,t,t,t,_,_,_,_,_,_],
  [_,_,_,_,_,d,d,d,d,d,_,_,_,_,_,_],
  [_,_,_,_,_,d,d,_,d,d,_,_,_,_,_,_],
  [_,_,_,_,_,b,_,_,_,b,_,_,_,_,_,_],
  [_,_,_,_,_,b,_,_,_,b,_,_,_,_,_,_],
  [_,_,_,_,_,b,_,_,_,b,b,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

const PLAYER_RIGHT_1 = [
  [_,_,_,_,_,_,_,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,h,h,_,_,_,_,_,_],
  [_,_,_,_,_,h,h,h,s,s,s,_,_,_,_,_],
  [_,_,_,_,_,_,h,s,s,s,s,_,_,_,_,_],
  [_,_,_,_,_,_,_,s,s,s,_,_,_,_,_,_],
  [_,_,_,_,_,t,t,t,t,t,_,_,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,t,_,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,t,w,_,_,_,_],
  [_,_,_,_,q,t,t,t,t,t,t,s,_,_,_,_],
  [_,_,_,_,_,t,t,t,t,t,_,_,_,_,_,_],
  [_,_,_,_,_,d,d,d,d,d,_,_,_,_,_,_],
  [_,_,_,_,_,d,d,_,d,d,_,_,_,_,_,_],
  [_,_,_,_,_,_,b,_,_,b,b,_,_,_,_,_],
  [_,_,_,_,_,_,b,_,_,b,_,_,_,_,_,_],
  [_,_,_,_,_,b,b,_,_,b,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

export const PLAYER_SPRITES = {
  down:  [PLAYER_DOWN_0, PLAYER_DOWN_1],
  up:    [PLAYER_UP_0, PLAYER_UP_1],
  left:  [PLAYER_LEFT_0, PLAYER_LEFT_1],
  right: [PLAYER_RIGHT_0, PLAYER_RIGHT_1],
}

// ============================================================
// TILE SPRITES (16x16)
// ============================================================

function solidTile(color) {
  return Array(16).fill(null).map(() => Array(16).fill(color))
}

function noiseTile(baseColor, noiseColor, density = 0.15) {
  return Array(16).fill(null).map(() =>
    Array(16).fill(null).map(() =>
      Math.random() < density ? noiseColor : baseColor
    )
  )
}

// Pre-generate deterministic tile sprites
const _grassBase = solidTile(C.grass)
const _grassDark = solidTile(C.grassDark)
const _dirtBase = solidTile(C.dirt)
const _waterBase = solidTile(C.water)
const _waterBase2 = solidTile(C.waterDark)
const _sandBase = solidTile(C.sand)

export function getGrassTile(col, row) {
  // Alternate slightly for visual variety
  return (col + row) % 3 === 0 ? _grassDark : _grassBase
}

export function getTallGrassTile() {
  return _grassBase  // Will add tufts during render
}

export const TILE_COLORS = {
  0: C.grass,       // GRASS
  1: C.tallGrass,   // TALL_GRASS
  2: C.dirt,         // DIRT
  3: C.water,        // WATER
  4: C.waterEdge,    // WATER_EDGE
  5: C.sand,         // SAND
  6: C.treeTrunk,    // TREE_TRUNK
  8: C.rock,         // ROCK
  9: C.bush,         // BUSH
  10: C.grass,       // FLOWERS (base is grass)
  11: C.dirt,        // CAMPFIRE (base is dirt)
  12: C.dirt,        // TENT (base is dirt)
  13: C.bridge,      // BRIDGE
  14: C.grass,       // REEDS
  15: C.treeLeaves,  // TREE_TOP
  16: C.grassDark,   // DARK_GRASS
}

// ============================================================
// ANIMAL SPRITES (12x12 or 16x16)
// ============================================================

const br = '#8b6e50'  // brown
const wh = '#f0e8d8'  // white
const dk = '#6a5540'  // dark brown (brightened for visibility)
const gy = '#7a7a7a'  // grey
const bl = '#3a5a8a'  // blue (fish)
const gn = '#5a8a5a'  // green
const rd = '#a04030'  // red
const or = '#d08030'  // orange
const yl = '#e8c84a'  // yellow

// Rabbit — 12x12
const RABBIT_0 = [
  [_,_,_,br,_,_,_,br,_,_,_,_],
  [_,_,_,br,_,_,_,br,_,_,_,_],
  [_,_,br,br,br,br,br,br,_,_,_,_],
  [_,_,br,dk,br,br,dk,br,_,_,_,_],
  [_,_,br,br,br,br,br,br,_,_,_,_],
  [_,br,br,br,br,br,br,br,br,_,_,_],
  [_,br,br,br,br,br,br,br,br,_,_,_],
  [_,_,br,br,br,br,br,br,_,_,_,_],
  [_,_,br,br,br,br,br,br,wh,_,_,_],
  [_,_,_,br,_,_,br,_,_,_,_,_],
  [_,_,_,br,_,_,br,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_],
]

const RABBIT_1 = [
  [_,_,_,br,_,_,_,br,_,_,_,_],
  [_,_,_,br,_,_,_,br,_,_,_,_],
  [_,_,br,br,br,br,br,br,_,_,_,_],
  [_,_,br,dk,br,br,dk,br,_,_,_,_],
  [_,_,br,br,br,br,br,br,_,_,_,_],
  [_,br,br,br,br,br,br,br,br,_,_,_],
  [_,br,br,br,br,br,br,br,br,_,_,_],
  [_,_,br,br,br,br,br,br,_,_,_,_],
  [_,_,br,br,br,br,br,br,wh,_,_,_],
  [_,_,br,_,_,_,_,br,_,_,_,_],
  [_,_,_,br,_,_,br,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_],
]

// Deer — 16x16
const DEER_0 = [
  [_,_,_,br,_,_,_,_,_,_,br,_,_,_,_,_],
  [_,_,_,br,br,_,_,_,br,br,_,_,_,_,_,_],
  [_,_,_,_,br,_,_,_,br,_,_,_,_,_,_,_],
  [_,_,_,br,br,br,br,br,br,br,_,_,_,_,_,_],
  [_,_,_,br,dk,br,br,br,dk,br,_,_,_,_,_,_],
  [_,_,_,br,br,br,br,br,br,br,_,_,_,_,_,_],
  [_,_,_,_,br,br,wh,br,br,_,_,_,_,_,_,_],
  [_,_,br,br,br,br,br,br,br,br,br,_,_,_,_,_],
  [_,_,br,br,br,br,br,br,br,br,br,_,_,_,_,_],
  [_,_,br,br,br,br,br,br,br,br,br,_,_,_,_,_],
  [_,_,_,br,br,br,br,br,br,br,_,_,_,_,_,_],
  [_,_,_,br,_,_,_,_,_,br,_,_,_,_,_,_],
  [_,_,_,br,_,_,_,_,_,br,_,_,_,_,_,_],
  [_,_,br,br,_,_,_,_,br,br,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

const DEER_1 = [
  [_,_,_,br,_,_,_,_,_,_,br,_,_,_,_,_],
  [_,_,_,br,br,_,_,_,br,br,_,_,_,_,_,_],
  [_,_,_,_,br,_,_,_,br,_,_,_,_,_,_,_],
  [_,_,_,br,br,br,br,br,br,br,_,_,_,_,_,_],
  [_,_,_,br,dk,br,br,br,dk,br,_,_,_,_,_,_],
  [_,_,_,br,br,br,br,br,br,br,_,_,_,_,_,_],
  [_,_,_,_,br,br,wh,br,br,_,_,_,_,_,_,_],
  [_,_,br,br,br,br,br,br,br,br,br,_,_,_,_,_],
  [_,_,br,br,br,br,br,br,br,br,br,_,_,_,_,_],
  [_,_,br,br,br,br,br,br,br,br,br,_,_,_,_,_],
  [_,_,_,br,br,br,br,br,br,br,_,_,_,_,_,_],
  [_,_,br,_,_,_,_,_,_,_,br,_,_,_,_,_],
  [_,_,br,_,_,_,_,_,_,_,br,_,_,_,_,_],
  [_,_,_,br,_,_,_,_,_,br,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

// Turkey — 12x12
const TURKEY_0 = [
  [_,_,_,_,_,dk,dk,_,_,_,_,_],
  [_,_,_,_,dk,dk,dk,dk,_,_,_,_],
  [_,_,_,_,dk,dk,dk,dk,_,_,_,_],
  [_,_,_,rd,dk,dk,dk,_,_,_,_,_],
  [_,_,_,_,br,br,br,br,_,_,_,_],
  [_,_,br,br,br,br,br,br,br,_,_,_],
  [_,_,br,br,br,br,br,br,br,_,_,_],
  [_,_,_,br,br,br,br,br,_,_,_,_],
  [_,_,_,_,br,br,br,_,_,_,_,_],
  [_,_,_,_,or,_,or,_,_,_,_,_],
  [_,_,_,_,or,_,or,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_],
]

// Trout — 12x8
const TROUT_0 = [
  [_,_,_,_,bl,bl,bl,bl,_,_,_,_],
  [_,_,_,bl,bl,bl,bl,bl,bl,_,_,_],
  [_,bl,bl,bl,dk,bl,bl,bl,bl,bl,_,_],
  [bl,bl,bl,bl,bl,bl,bl,bl,bl,bl,bl,_],
  [_,bl,bl,bl,bl,bl,bl,bl,bl,bl,_,_],
  [_,_,_,bl,bl,bl,bl,bl,bl,_,_,_],
  [_,_,_,_,bl,bl,bl,bl,_,_,_,_],
  [_,_,_,_,_,bl,bl,_,_,_,_,_],
]

const TROUT_1 = [
  [_,_,_,_,_,bl,bl,bl,_,_,_,_],
  [_,_,_,bl,bl,bl,bl,bl,bl,_,_,_],
  [_,bl,bl,bl,dk,bl,bl,bl,bl,bl,_,_],
  [bl,bl,bl,bl,bl,bl,bl,bl,bl,bl,bl,_],
  [bl,bl,bl,bl,bl,bl,bl,bl,bl,bl,_,_],
  [_,_,bl,bl,bl,bl,bl,bl,bl,_,_,_],
  [_,_,_,_,bl,bl,bl,_,_,_,_,_],
  [_,_,_,_,_,bl,_,_,_,_,_,_],
]

// Fox — 12x12
const FOX_0 = [
  [_,_,_,or,or,_,_,or,or,_,_,_],
  [_,_,_,or,or,_,_,or,or,_,_,_],
  [_,_,or,or,or,or,or,or,or,_,_,_],
  [_,_,or,dk,or,or,or,dk,or,_,_,_],
  [_,_,or,or,or,wh,or,or,or,_,_,_],
  [_,or,or,or,or,or,or,or,or,or,_,_],
  [_,or,or,or,or,or,or,or,or,or,_,_],
  [_,_,or,or,or,or,or,or,or,_,_,_],
  [_,_,or,or,or,or,or,or,or,wh,_,_],
  [_,_,_,or,_,_,_,or,_,_,_,_],
  [_,_,_,or,_,_,_,or,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_],
]

// Quail — 10x10
const qb = '#8a7050' // quail body (warm brown, visible on dark bg)
const qc = '#c4a060' // quail chest (tan)
const QUAIL_0 = [
  [_,_,_,_,dk,_,_,_,_,_],
  [_,_,_,dk,dk,dk,_,_,_,_],
  [_,_,dk,dk,dk,dk,dk,_,_,_],
  [_,_,dk,wh,dk,dk,wh,_,_,_],
  [_,_,dk,dk,dk,dk,dk,_,_,_],
  [_,qc,qc,qb,qb,qb,qc,qc,_,_],
  [_,qc,qb,qb,qb,qb,qb,qc,_,_],
  [_,_,qb,qb,qb,qb,qb,_,_,_],
  [_,_,_,or,_,_,or,_,_,_],
  [_,_,_,_,_,_,_,_,_,_],
]

// Elk — 16x16 (dark brown, prominent antlers, bulky)
const eb = '#5a4030'  // elk brown (dark)
const el = '#7a5e48'  // elk light brown

const ELK_0 = [
  [_,_,eb,_,_,_,_,_,_,_,_,eb,_,_,_,_],
  [_,eb,eb,eb,_,_,_,_,_,eb,eb,eb,_,_,_,_],
  [_,_,eb,eb,_,_,_,_,_,eb,eb,_,_,_,_,_],
  [_,_,_,eb,eb,eb,eb,eb,eb,eb,_,_,_,_,_,_],
  [_,_,_,eb,dk,el,el,el,dk,eb,_,_,_,_,_,_],
  [_,_,_,eb,el,el,el,el,el,eb,_,_,_,_,_,_],
  [_,_,_,_,eb,el,wh,el,eb,_,_,_,_,_,_,_],
  [_,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,_,_,_,_],
  [_,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,_,_,_,_],
  [_,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,_,_,_,_],
  [_,_,eb,eb,eb,eb,eb,eb,eb,eb,eb,_,_,_,_,_],
  [_,_,_,eb,eb,eb,eb,eb,eb,eb,_,_,_,_,_,_],
  [_,_,_,eb,_,_,_,_,_,eb,_,_,_,_,_,_],
  [_,_,_,eb,_,_,_,_,_,eb,_,_,_,_,_,_],
  [_,_,eb,eb,_,_,_,_,eb,eb,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

const ELK_1 = [
  [_,_,eb,_,_,_,_,_,_,_,_,eb,_,_,_,_],
  [_,eb,eb,eb,_,_,_,_,_,eb,eb,eb,_,_,_,_],
  [_,_,eb,eb,_,_,_,_,_,eb,eb,_,_,_,_,_],
  [_,_,_,eb,eb,eb,eb,eb,eb,eb,_,_,_,_,_,_],
  [_,_,_,eb,dk,el,el,el,dk,eb,_,_,_,_,_,_],
  [_,_,_,eb,el,el,el,el,el,eb,_,_,_,_,_,_],
  [_,_,_,_,eb,el,wh,el,eb,_,_,_,_,_,_,_],
  [_,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,_,_,_,_],
  [_,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,_,_,_,_],
  [_,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,eb,_,_,_,_],
  [_,_,eb,eb,eb,eb,eb,eb,eb,eb,eb,_,_,_,_,_],
  [_,_,_,eb,eb,eb,eb,eb,eb,eb,_,_,_,_,_,_],
  [_,_,eb,_,_,_,_,_,_,_,eb,_,_,_,_,_],
  [_,_,eb,_,_,_,_,_,_,_,eb,_,_,_,_,_],
  [_,_,_,eb,_,_,_,_,_,eb,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

// Antelope — 14x14 (tan, slender, short horns)
const tn = '#c8a878'  // tan
const lt = '#e0d0b0'  // light tan

const ANTELOPE_0 = [
  [_,_,_,_,dk,_,_,_,dk,_,_,_,_,_],
  [_,_,_,_,dk,_,_,_,dk,_,_,_,_,_],
  [_,_,_,tn,tn,tn,tn,tn,tn,_,_,_,_,_],
  [_,_,_,tn,dk,tn,tn,dk,tn,_,_,_,_,_],
  [_,_,_,tn,tn,tn,tn,tn,tn,_,_,_,_,_],
  [_,_,_,_,tn,tn,lt,tn,_,_,_,_,_,_],
  [_,_,tn,tn,tn,tn,tn,tn,tn,tn,_,_,_,_],
  [_,_,tn,tn,tn,tn,tn,tn,tn,tn,_,_,_,_],
  [_,_,_,tn,tn,lt,lt,tn,tn,_,_,_,_,_],
  [_,_,_,tn,tn,lt,lt,tn,tn,_,_,_,_,_],
  [_,_,_,tn,_,_,_,_,tn,_,_,_,_,_],
  [_,_,_,tn,_,_,_,_,tn,_,_,_,_,_],
  [_,_,tn,tn,_,_,_,tn,tn,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

const ANTELOPE_1 = [
  [_,_,_,_,dk,_,_,_,dk,_,_,_,_,_],
  [_,_,_,_,dk,_,_,_,dk,_,_,_,_,_],
  [_,_,_,tn,tn,tn,tn,tn,tn,_,_,_,_,_],
  [_,_,_,tn,dk,tn,tn,dk,tn,_,_,_,_,_],
  [_,_,_,tn,tn,tn,tn,tn,tn,_,_,_,_,_],
  [_,_,_,_,tn,tn,lt,tn,_,_,_,_,_,_],
  [_,_,tn,tn,tn,tn,tn,tn,tn,tn,_,_,_,_],
  [_,_,tn,tn,tn,tn,tn,tn,tn,tn,_,_,_,_],
  [_,_,_,tn,tn,lt,lt,tn,tn,_,_,_,_,_],
  [_,_,_,tn,tn,lt,lt,tn,tn,_,_,_,_,_],
  [_,_,tn,_,_,_,_,_,_,tn,_,_,_,_],
  [_,_,tn,_,_,_,_,_,_,tn,_,_,_,_],
  [_,_,_,tn,_,_,_,_,tn,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

export const ANIMAL_SPRITES = {
  rabbit:      { frames: [RABBIT_0, RABBIT_1], size: 12 },
  deer:        { frames: [DEER_0, DEER_1], size: 16 },
  wild_turkey: { frames: [TURKEY_0, TURKEY_0], size: 12 },
  trout:       { frames: [TROUT_0, TROUT_1], size: 12 },
  bass:        { frames: [TROUT_0, TROUT_1], size: 12 },
  catfish:     { frames: [TROUT_0, TROUT_1], size: 12 },
  pike:        { frames: [TROUT_0, TROUT_1], size: 12 },
  fox:         { frames: [FOX_0, FOX_0], size: 12 },
  quail:       { frames: [QUAIL_0, QUAIL_0], size: 10 },
  pheasant:    { frames: [QUAIL_0, QUAIL_0], size: 10 },
  squirrel:    { frames: [RABBIT_0, RABBIT_1], size: 12 },
  raccoon:     { frames: [FOX_0, FOX_0], size: 12 },
  elk:         { frames: [ELK_0, ELK_1], size: 16 },
  antelope:    { frames: [ANTELOPE_0, ANTELOPE_1], size: 14 },
}
