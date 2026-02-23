// Each template generates a unique question with randomized values.
// tier: 1 = 3rd grade, 2 = 4th grade, 3 = 5th grade

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const TEMPLATES = [
  // ---- TIER 1: Basic operations ----
  {
    tier: 1,
    generate() {
      const animal = pick(['rabbit', 'quail', 'turkey', 'squirrel'])
      const packs = randInt(2, 5)
      const perPack = randInt(2, 6)
      return {
        question: `You spot ${packs} groups of ${animal}s with ${perPack} in each group. How many ${animal}s total?`,
        answer: packs * perPack,
        hint: `${packs} × ${perPack}`,
      }
    },
  },
  {
    tier: 1,
    generate() {
      const total = randInt(12, 30)
      const used = randInt(3, total - 2)
      return {
        question: `You started with ${total} arrows. You've shot ${used}. How many arrows do you have left?`,
        answer: total - used,
        hint: `${total} − ${used}`,
      }
    },
  },
  {
    tier: 1,
    generate() {
      const meat = randInt(10, 30)
      const families = pick([2, 3, 4, 5, 6])
      const total = meat * families
      return {
        question: `You have ${total} pieces of meat to split equally among ${families} families. How many pieces does each family get?`,
        answer: meat,
        hint: `${total} ÷ ${families}`,
      }
    },
  },
  {
    tier: 1,
    generate() {
      const feathersPerArrow = pick([2, 3, 4])
      const arrows = randInt(3, 8)
      return {
        question: `Each arrow needs ${feathersPerArrow} feathers. You want to make ${arrows} arrows. How many feathers do you need?`,
        answer: feathersPerArrow * arrows,
        hint: `${feathersPerArrow} × ${arrows}`,
      }
    },
  },
  {
    tier: 1,
    generate() {
      const a = randInt(15, 50)
      const b = randInt(10, 40)
      return {
        question: `You walked ${a} paces to the north and ${b} paces to the east. How many paces did you walk in total?`,
        answer: a + b,
        hint: `${a} + ${b}`,
      }
    },
  },
  {
    tier: 1,
    generate() {
      const traps = randInt(3, 7)
      const baitPer = randInt(2, 4)
      return {
        question: `You're setting ${traps} snares. Each one needs ${baitPer} pieces of bait. How much bait do you need?`,
        answer: traps * baitPer,
        hint: `${traps} × ${baitPer}`,
      }
    },
  },

  // ---- TIER 2: Multi-step, intro fractions ----
  {
    tier: 2,
    generate() {
      const distance = pick([60, 80, 100, 120, 150])
      const divisor = pick([10, 15, 20])
      return {
        question: `The deer is ${distance} paces away. Your arrow drops 1 pace for every ${divisor} paces of distance. How many paces does the arrow drop?`,
        answer: distance / divisor,
        hint: `${distance} ÷ ${divisor}`,
      }
    },
  },
  {
    tier: 2,
    generate() {
      const total = pick([12, 18, 24, 30])
      const fraction = pick([2, 3, 4])
      const used = total / fraction
      return {
        question: `You used 1/${fraction} of your ${total} arrows on the morning hunt. How many did you use?`,
        answer: used,
        hint: `${total} ÷ ${fraction}`,
      }
    },
  },
  {
    tier: 2,
    generate() {
      const speed = randInt(5, 12)
      const breaths = randInt(2, 5)
      const distance = randInt(40, 100)
      return {
        question: `The elk moves ${speed} paces every breath. You need ${breaths} breaths to aim. It's ${distance} paces away. How far will it move before you shoot?`,
        answer: speed * breaths,
        hint: `${speed} × ${breaths} (the starting distance is extra information!)`,
      }
    },
  },
  {
    tier: 2,
    generate() {
      const batches = randInt(2, 4)
      const sticksPerBatch = 3
      const flintPerBatch = 5
      const feathersPerBatch = 10
      const item = pick(['sticks', 'flint chips', 'feathers'])
      const perBatch = item === 'sticks' ? sticksPerBatch : item === 'flint chips' ? flintPerBatch : feathersPerBatch
      const arrowCount = batches * 5
      return {
        question: `You want to craft ${arrowCount} arrows. Each batch of 5 arrows needs ${sticksPerBatch} sticks, ${flintPerBatch} flint, and ${feathersPerBatch} feathers. How many ${item} do you need total?`,
        answer: batches * perBatch,
        hint: `${arrowCount} arrows ÷ 5 per batch = ${batches} batches. ${batches} × ${perBatch}`,
      }
    },
  },
  {
    tier: 2,
    generate() {
      const pelts = pick([5, 10, 15, 20])
      const rate = pick([2, 3, 5])
      return {
        question: `At the trading post, every ${rate} rabbit pelts gets you 1 flint chip. You have ${pelts} pelts. How many flint chips can you get?`,
        answer: pelts / rate,
        hint: `${pelts} ÷ ${rate}`,
      }
    },
  },
  {
    tier: 2,
    generate() {
      const tracks = randInt(8, 20)
      const spacing = pick([2, 3, 4])
      return {
        question: `You count ${tracks} deer tracks. Each track is ${spacing} feet apart. How far did the deer travel?`,
        answer: (tracks - 1) * spacing,
        hint: `The distance is between tracks, so ${tracks} tracks = ${tracks - 1} gaps. ${tracks - 1} × ${spacing}`,
      }
    },
  },

  // ---- TIER 3: Fractions, decimals, ratios ----
  {
    tier: 3,
    generate() {
      const total = pick([18, 24, 30, 36])
      const numerator = pick([2, 3])
      const denominator = pick([3, 4])
      while (numerator >= denominator) { return this.generate() }
      const used = (total * numerator) / denominator
      if (!Number.isInteger(used)) return this.generate()
      return {
        question: `You started the day with ${total} arrows. By sundown you've used ${numerator}/${denominator} of them. How many arrows did you use?`,
        answer: used,
        hint: `${total} × ${numerator}/${denominator} = ${total} × ${numerator} ÷ ${denominator}`,
      }
    },
  },
  {
    tier: 3,
    generate() {
      const pelts = pick([5, 8, 10])
      const arrowheads = pick([2, 3, 4])
      const playerPelts = pelts * randInt(2, 4)
      return {
        question: `The trader offers ${arrowheads} arrowheads for every ${pelts} pelts. You have ${playerPelts} pelts. How many arrowheads can you get?`,
        answer: (playerPelts / pelts) * arrowheads,
        hint: `${playerPelts} ÷ ${pelts} = ${playerPelts / pelts} trades. ${playerPelts / pelts} × ${arrowheads}`,
      }
    },
  },
  {
    tier: 3,
    generate() {
      const total = pick([20, 25, 40, 50])
      const percent = pick([10, 20, 25, 50])
      return {
        question: `You have ${total} feet of cord. You need to save ${percent}% for emergency repairs. How many feet can you use for traps?`,
        answer: total - (total * percent) / 100,
        hint: `${percent}% of ${total} = ${(total * percent) / 100}. Then ${total} − ${(total * percent) / 100}`,
      }
    },
  },
  {
    tier: 3,
    generate() {
      const meatPerDay = pick([3, 4, 5])
      const people = randInt(3, 6)
      const days = pick([5, 7, 10])
      return {
        question: `Your camp has ${people} people. Each person eats ${meatPerDay} pieces of meat per day. How much meat do you need for ${days} days?`,
        answer: meatPerDay * people * days,
        hint: `${meatPerDay} × ${people} = ${meatPerDay * people} per day. Then × ${days} days`,
      }
    },
  },
  {
    tier: 3,
    generate() {
      const distance = pick([30, 45, 60, 90])
      const windPerTen = pick([2, 3, 4])
      return {
        question: `Wind pushes your arrow ${windPerTen} paces left for every 10 paces of distance. The target is ${distance} paces away. How far left should you aim?`,
        answer: (distance / 10) * windPerTen,
        hint: `${distance} ÷ 10 = ${distance / 10}. Then ${distance / 10} × ${windPerTen}`,
      }
    },
  },
  {
    tier: 3,
    generate() {
      const cups = pick([2, 3, 4])
      const servings = cups * pick([3, 4, 5])
      const needed = servings * randInt(2, 3)
      const multiplier = needed / servings
      return {
        question: `A pemmican recipe uses ${cups} cups of dried meat and makes ${servings} servings. You need ${needed} servings. How many cups of dried meat do you need?`,
        answer: cups * multiplier,
        hint: `${needed} ÷ ${servings} = ${multiplier}. Then ${cups} × ${multiplier}`,
      }
    },
  },
]

export function generateQuestion(tier) {
  const available = TEMPLATES.filter((t) => t.tier <= tier)
  const template = pick(available)
  const question = template.generate()
  return { ...question, tier: template.tier }
}

export function getTimerSeconds(difficulty) {
  switch (difficulty) {
    case 'easy': return 30
    case 'normal': return 20
    case 'hunter': return 12
    default: return 20
  }
}
