// Each template generates a unique question with randomized values.
// tier: 1 = 3rd grade, 2 = 4th grade, 3 = 5th grade
// topic: multiplication, division, addition, subtraction, fractions, ratios, percentages, multi-step

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const TOPICS = {
  all: 'All Topics',
  multiplication: 'Multiplication',
  division: 'Division',
  addition: 'Addition & Subtraction',
  fractions: 'Fractions',
  ratios: 'Ratios & Proportions',
  percentages: 'Percentages',
  multi_step: 'Multi-Step Problems',
}

const TEMPLATES = [
  // ---- TIER 1: Basic operations ----
  {
    tier: 1,
    topic: 'multiplication',
    generate() {
      const animal = pick(['rabbit', 'quail', 'turkey', 'squirrel', 'pheasant'])
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
    topic: 'addition',
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
    topic: 'division',
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
    topic: 'multiplication',
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
    topic: 'addition',
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
    topic: 'multiplication',
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
  {
    tier: 1,
    topic: 'division',
    generate() {
      const perBundle = pick([3, 4, 5, 6])
      const bundles = randInt(2, 6)
      const total = perBundle * bundles
      return {
        question: `You collected ${total} feathers. You tie them in bundles of ${perBundle}. How many bundles do you get?`,
        answer: bundles,
        hint: `${total} ÷ ${perBundle}`,
      }
    },
  },
  {
    tier: 1,
    topic: 'addition',
    generate() {
      const morning = randInt(3, 12)
      const afternoon = randInt(3, 12)
      const evening = randInt(1, 5)
      return {
        question: `You caught ${morning} fish in the morning, ${afternoon} in the afternoon, and ${evening} in the evening. How many fish total?`,
        answer: morning + afternoon + evening,
        hint: `${morning} + ${afternoon} + ${evening}`,
      }
    },
  },
  {
    tier: 1,
    topic: 'multiplication',
    generate() {
      const rows = randInt(3, 6)
      const cols = randInt(3, 8)
      return {
        question: `You're drying meat on a rack with ${rows} rows and ${cols} pieces per row. How many pieces of meat are drying?`,
        answer: rows * cols,
        hint: `${rows} × ${cols}`,
      }
    },
  },

  // ---- TIER 2: Multi-step, intro fractions ----
  {
    tier: 2,
    topic: 'division',
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
    topic: 'fractions',
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
    topic: 'multi_step',
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
    topic: 'multi_step',
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
    topic: 'ratios',
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
    topic: 'multi_step',
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
  {
    tier: 2,
    topic: 'fractions',
    generate() {
      const total = pick([16, 20, 24, 32])
      const half = total / 2
      const quarter = total / 4
      return {
        question: `You have ${total} pieces of jerky. You eat half today and give away a quarter of what's left. How many do you still have?`,
        answer: half - (half / 4),
        hint: `Half of ${total} = ${half}. A quarter of ${half} = ${quarter / 2}. Then ${half} − ${quarter / 2}`,
      }
    },
  },
  {
    tier: 2,
    topic: 'ratios',
    generate() {
      const fish = pick([3, 4, 5])
      const cord = pick([1, 2])
      const totalFish = fish * randInt(2, 5)
      return {
        question: `The trader swaps ${fish} fish for ${cord} sinew cord${cord > 1 ? 's' : ''}. You have ${totalFish} fish. How many sinew cords can you get?`,
        answer: (totalFish / fish) * cord,
        hint: `${totalFish} ÷ ${fish} = ${totalFish / fish} trades. ${totalFish / fish} × ${cord}`,
      }
    },
  },

  // ---- TIER 3: Fractions, decimals, ratios ----
  {
    tier: 3,
    topic: 'fractions',
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
    topic: 'ratios',
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
    topic: 'percentages',
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
    topic: 'multi_step',
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
    topic: 'ratios',
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
    topic: 'ratios',
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
  {
    tier: 3,
    topic: 'percentages',
    generate() {
      const original = pick([40, 50, 60, 80])
      const percent = pick([10, 20, 25])
      const discount = (original * percent) / 100
      return {
        question: `A trading post sells a knife for ${original} pelts. They offer you ${percent}% off for bringing rare feathers. How many pelts do you pay?`,
        answer: original - discount,
        hint: `${percent}% of ${original} = ${discount}. Then ${original} − ${discount}`,
      }
    },
  },
  {
    tier: 3,
    topic: 'fractions',
    generate() {
      const denominator = pick([3, 4, 5, 6])
      const whole = pick([12, 18, 24, 30])
      const numerator1 = 1
      const numerator2 = pick([1, 2])
      while (numerator1 + numerator2 >= denominator) { return this.generate() }
      const part1 = (whole * numerator1) / denominator
      const part2 = (whole * numerator2) / denominator
      if (!Number.isInteger(part1) || !Number.isInteger(part2)) return this.generate()
      return {
        question: `You have ${whole} arrowheads. You give ${numerator1}/${denominator} to your brother and ${numerator2}/${denominator} to your cousin. How many do you keep?`,
        answer: whole - part1 - part2,
        hint: `${numerator1}/${denominator} of ${whole} = ${part1}. ${numerator2}/${denominator} of ${whole} = ${part2}. ${whole} − ${part1} − ${part2}`,
      }
    },
  },
]

export function generateQuestion(tier, topic = 'all') {
  let available = TEMPLATES.filter((t) => t.tier <= tier)

  if (topic && topic !== 'all') {
    const topicFiltered = available.filter((t) => t.topic === topic)
    // Fall back to all topics if no questions match the selected topic at this tier
    if (topicFiltered.length > 0) {
      available = topicFiltered
    }
  }

  const template = pick(available)
  const question = template.generate()
  return { ...question, tier: template.tier, topic: template.topic }
}

export function getTimerSeconds(difficulty) {
  switch (difficulty) {
    case 'easy': return 30
    case 'normal': return 20
    case 'hunter': return 12
    default: return 20
  }
}
