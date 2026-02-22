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
    unlocked: false,
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
}

// ---- AREAS ----
export const AREAS = {
  meadow: {
    name: 'The Meadow',
    description: 'Open grasslands with small game. A good place to start.',
    animals: ['rabbit', 'quail', 'wild_turkey'],
    unlocked: true,
    minTier: 1,
    materialsFound: ['stick', 'feather', 'flint'],
  },
  river: {
    name: 'The River',
    description: 'A rushing river full of fish. You\'ll need a fish trap.',
    animals: ['trout', 'catfish'],
    unlocked: false,
    unlockRequirement: 'fish_trap',
    minTier: 2,
    materialsFound: ['willow', 'cord', 'sinew'],
  },
}

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
}
