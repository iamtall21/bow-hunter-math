// ---- MATERIALS ----
export const MATERIALS = {
  stick: { name: 'Straight Stick', icon: '🪵' },
  flint: { name: 'Flint Chip', icon: '🪨' },
  feather: { name: 'Feather', icon: '🪶' },
  sinew: { name: 'Sinew Cord', icon: '🧵' },
  ash_branch: { name: 'Ash Branch', icon: '🌿' },
  grip_wrap: { name: 'Grip Wrap', icon: '🎀' },
  willow: { name: 'Willow Branch', icon: '🌾' },
  cord: { name: 'Cord', icon: '🪢' },
  spear: { name: 'Fishing Spear', icon: '🔱' },
}

// ---- RECIPES ----
export const RECIPES = {
  basic_arrow: {
    name: 'Basic Arrows (x5)',
    description: 'A bundle of 5 sturdy arrows for hunting small game.',
    materials: { stick: 3, flint: 5, feather: 10 },
    produces: { arrow: 5 },
    unlocked: true,
  },
  recurve_bow: {
    name: 'Recurve Bow',
    description: 'A traditional bow carved from ash. Required for hunting.',
    materials: { ash_branch: 1, sinew: 2, grip_wrap: 1 },
    produces: { bow: 1 },
    unlocked: true,
  },
  fish_trap: {
    name: 'Fish Trap',
    description: 'Woven willow trap for catching river fish.',
    materials: { willow: 12, cord: 8 },
    produces: { fish_trap: 1 },
    unlocked: true,
  },
  fishing_spear: {
    name: 'Fishing Spear',
    description: 'A sharp-tipped spear for spearing fish in the river.',
    materials: { stick: 4, flint: 8 },
    produces: { spear: 1 },
    unlocked: true,
  },
  snare: {
    name: 'Snare',
    description: 'A simple snare for catching rabbits.',
    materials: { stick: 1, cord: 6 },
    produces: { snare: 1 },
    unlocked: true,
  },
}

// ---- ANIMALS ----
export const ANIMALS = {
  rabbit: {
    name: 'Rabbit',
    icon: '🐇',
    area: 'meadow',
    difficulty: 1,
    honor: 1,
    drops: { meat: 2, pelt: 1 },
    fleeChance: 0.3,
  },
  quail: {
    name: 'Quail',
    icon: '🐦',
    area: 'meadow',
    difficulty: 1,
    honor: 1,
    drops: { meat: 1, feather: 3 },
    fleeChance: 0.5,
  },
  wild_turkey: {
    name: 'Wild Turkey',
    icon: '🦃',
    area: 'meadow',
    difficulty: 2,
    honor: 2,
    drops: { meat: 4, feather: 5 },
    fleeChance: 0.4,
  },
  squirrel: {
    name: 'Squirrel',
    icon: '🐿️',
    area: 'meadow',
    difficulty: 1,
    honor: 1,
    drops: { meat: 1, pelt: 1 },
    fleeChance: 0.6,
  },
  deer: {
    name: 'Whitetail Deer',
    icon: '🦌',
    area: 'meadow',
    difficulty: 2,
    honor: 3,
    drops: { meat: 8, pelt: 2, sinew: 1 },
    fleeChance: 0.5,
  },
  pheasant: {
    name: 'Pheasant',
    icon: '🪶',
    area: 'meadow',
    difficulty: 1,
    honor: 1,
    drops: { meat: 2, feather: 4 },
    fleeChance: 0.5,
  },
  raccoon: {
    name: 'Raccoon',
    icon: '🦝',
    area: 'meadow',
    difficulty: 2,
    honor: 2,
    drops: { meat: 3, pelt: 2 },
    fleeChance: 0.3,
  },
  fox: {
    name: 'Fox',
    icon: '🦊',
    area: 'meadow',
    difficulty: 2,
    honor: 2,
    drops: { pelt: 3 },
    fleeChance: 0.6,
  },
  trout: {
    name: 'Rainbow Trout',
    icon: '🐟',
    area: 'river',
    difficulty: 1,
    honor: 2,
    drops: { meat: 3, sinew: 1 },
    fleeChance: 0.7,
  },
  catfish: {
    name: 'Channel Catfish',
    icon: '🐱',
    area: 'river',
    difficulty: 2,
    honor: 3,
    drops: { meat: 5, sinew: 2 },
    fleeChance: 0.5,
  },
  bass: {
    name: 'Largemouth Bass',
    icon: '🐠',
    area: 'river',
    difficulty: 1,
    honor: 1,
    drops: { meat: 2 },
    fleeChance: 0.8,
  },
  pike: {
    name: 'Northern Pike',
    icon: '🦈',
    area: 'river',
    difficulty: 2,
    honor: 3,
    drops: { meat: 6, cord: 1 },
    fleeChance: 0.4,
  },
  elk: {
    name: 'Bull Elk',
    icon: '🫎',
    area: 'forest',
    difficulty: 3,
    honor: 5,
    drops: { meat: 12, pelt: 3, sinew: 2 },
    fleeChance: 0.3,
  },
  antelope: {
    name: 'Pronghorn Antelope',
    icon: '🦌',
    area: 'meadow',
    difficulty: 3,
    honor: 4,
    drops: { meat: 6, pelt: 2, sinew: 1 },
    fleeChance: 0.7,
  },
}

// ---- AREAS ----
export const AREAS = {
  meadow: {
    name: 'The Meadow',
    description: 'Open grasslands with small game. A good place to start.',
    animals: ['rabbit', 'quail', 'wild_turkey', 'squirrel', 'deer', 'pheasant', 'raccoon', 'fox', 'antelope'],
    unlocked: true,
    minTier: 1,
    materialsFound: ['stick', 'feather', 'flint'],
  },
  forest: {
    name: 'The Forest',
    description: 'Dense woodland with larger game lurking in the shadows.',
    animals: ['deer', 'fox', 'raccoon', 'wild_turkey', 'squirrel', 'elk'],
    unlocked: false,
    minTier: 1,
    materialsFound: ['stick', 'sinew', 'hide'],
  },
  river: {
    name: 'The River',
    description: 'A rushing river full of fish. Grab your spear!',
    animals: ['trout', 'catfish', 'bass', 'pike'],
    unlocked: false,
    minTier: 1,
    materialsFound: ['willow', 'cord', 'sinew'],
  },
}

// ---- LEVELS (progression gating) ----
export const LEVELS = [
  { level: 1,  correctNeeded: 0,   unlocks: [], title: 'Apprentice' },
  { level: 2,  correctNeeded: 5,   unlocks: [{ type: 'recipe', id: 'fishing_spear' }], title: 'Novice' },
  { level: 3,  correctNeeded: 12,  unlocks: [{ type: 'area', id: 'forest' }], title: 'Scout' },
  { level: 4,  correctNeeded: 20,  unlocks: [{ type: 'recipe', id: 'recurve_bow' }], title: 'Tracker' },
  { level: 5,  correctNeeded: 30,  unlocks: [{ type: 'area', id: 'river' }], title: 'Hunter' },
  { level: 6,  correctNeeded: 45,  unlocks: [{ type: 'recipe', id: 'fish_trap' }], title: 'Pathfinder' },
  { level: 7,  correctNeeded: 60,  unlocks: [], title: 'Warrior' },
  { level: 8,  correctNeeded: 80,  unlocks: [], title: 'Master Hunter' },
  { level: 9,  correctNeeded: 100, unlocks: [], title: 'Elder' },
  { level: 10, correctNeeded: 130, unlocks: [], title: 'Legend' },
]

// ---- RANKS ----
export const RANKS = [
  { name: 'Apprentice', honorRequired: 0, icon: '🏹' },
  { name: 'Scout', honorRequired: 15, icon: '👁️' },
  { name: 'Hunter', honorRequired: 40, icon: '🦌' },
  { name: 'Warrior', honorRequired: 80, icon: '⚔️' },
  { name: 'Elder Hunter', honorRequired: 150, icon: '🦅' },
]

// ---- QUESTS ----
export const QUESTS = [
  {
    id: 'first_hunt',
    title: 'First Hunt',
    description: 'Hunt your first animal in The Meadow.',
    goal: { type: 'hunt_total', count: 1 },
    reward: { honor: 5, materials: { flint: 5 } },
  },
  {
    id: 'arrow_crafter',
    title: 'Arrow Crafter',
    description: 'Craft your first bundle of arrows.',
    goal: { type: 'craft', item: 'basic_arrow', count: 1 },
    reward: { honor: 5, materials: { feather: 10 } },
  },
  {
    id: 'five_hunts',
    title: 'Persistent Tracker',
    description: 'Successfully hunt 5 animals.',
    goal: { type: 'hunt_total', count: 5 },
    reward: { honor: 10, materials: { sinew: 3 } },
  },
  {
    id: 'turkey_hunter',
    title: 'Turkey Hunter',
    description: 'Hunt 3 Wild Turkeys.',
    goal: { type: 'hunt_animal', animal: 'wild_turkey', count: 3 },
    reward: { honor: 10, materials: { ash_branch: 1, grip_wrap: 1 } },
  },
  {
    id: 'perfect_three',
    title: 'Sharp Eye',
    description: 'Get 3 Perfect Shots in a row.',
    goal: { type: 'perfect_streak', count: 3 },
    reward: { honor: 15, materials: { flint: 10, feather: 15 } },
  },
  {
    id: 'ten_hunts',
    title: 'Seasoned Hunter',
    description: 'Successfully hunt 10 animals.',
    goal: { type: 'hunt_total', count: 10 },
    reward: { honor: 15, materials: { cord: 10, willow: 12 } },
  },
  {
    id: 'first_fish',
    title: 'First Catch',
    description: 'Spear your first fish in The River.',
    goal: { type: 'fish_total', count: 1 },
    reward: { honor: 5, materials: { willow: 5 } },
  },
  {
    id: 'five_fish',
    title: 'River Provider',
    description: 'Catch 5 fish total.',
    goal: { type: 'fish_total', count: 5 },
    reward: { honor: 10, materials: { cord: 8 } },
  },
]

// ---- STARTER INVENTORY ----
export const STARTER_INVENTORY = {
  stick: 6,
  flint: 10,
  feather: 20,
  sinew: 4,
  ash_branch: 1,
  grip_wrap: 1,
  arrow: 5,
  bow: 0,
  meat: 0,
  pelt: 0,
  willow: 0,
  cord: 0,
  spear: 1,
}
