// Each template generates a unique question with randomized values.
// tier: 1 = 3rd grade, 2 = 4th grade, 3 = 5th-6th grade
// topic: multiplication, division, addition, fractions, ratios, percentages, multi-step

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

export const GRADE_LEVELS = {
  3: { label: '3rd Grade', baseTier: 1 },
  4: { label: '4th Grade', baseTier: 2 },
  5: { label: '5th Grade', baseTier: 3 },
  6: { label: '6th Grade', baseTier: 3 },
}

const TEMPLATES = [
  // ========================================================================
  // TIER 1 — 3rd Grade: Basic single-step operations
  // ========================================================================

  // ---- MULTIPLICATION (tier 1) ----
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

  // ---- DIVISION (tier 1) ----
  {
    tier: 1,
    topic: 'division',
    generate() {
      const meat = randInt(4, 12)
      const families = pick([2, 3, 4])
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
    topic: 'division',
    generate() {
      const perCanoe = pick([2, 3, 4])
      const canoes = randInt(2, 5)
      const total = perCanoe * canoes
      return {
        question: `${total} hunters need to cross the river. Each canoe holds ${perCanoe} people. How many canoes do you need?`,
        answer: canoes,
        hint: `${total} ÷ ${perCanoe}`,
      }
    },
  },

  // ---- ADDITION & SUBTRACTION (tier 1) ----
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

  // ---- FRACTIONS (tier 1) ----
  {
    tier: 1,
    topic: 'fractions',
    generate() {
      const total = pick([8, 10, 12, 16, 20])
      const half = total / 2
      return {
        question: `You have ${total} berries. You eat half of them. How many are left?`,
        answer: half,
        hint: `Half of ${total} = ${total} ÷ 2`,
      }
    },
  },
  {
    tier: 1,
    topic: 'fractions',
    generate() {
      const total = pick([9, 12, 15, 18])
      const third = total / 3
      return {
        question: `Your camp caught ${total} fish. You get 1/3 of them. How many fish do you get?`,
        answer: third,
        hint: `${total} ÷ 3`,
      }
    },
  },
  {
    tier: 1,
    topic: 'fractions',
    generate() {
      const total = pick([8, 12, 16, 20])
      const quarter = total / 4
      return {
        question: `There are ${total} arrowheads to share among 4 hunters. What is 1/4 of ${total}?`,
        answer: quarter,
        hint: `${total} ÷ 4`,
      }
    },
  },

  // ---- RATIOS (tier 1) ----
  {
    tier: 1,
    topic: 'ratios',
    generate() {
      const sticks = pick([2, 3])
      const totalSticks = sticks * randInt(3, 6)
      return {
        question: `The ratio of sticks to arrows is ${sticks} to 1. If you have ${totalSticks} sticks, how many arrows can you make?`,
        answer: totalSticks / sticks,
        hint: `For every ${sticks} sticks you get 1 arrow. ${totalSticks} ÷ ${sticks}`,
      }
    },
  },
  {
    tier: 1,
    topic: 'ratios',
    generate() {
      const water = pick([2, 3])
      const cups = water * randInt(2, 5)
      return {
        question: `A trail drink has a ratio of ${water}:1 water to berry juice. You use ${cups} cups of water. How many cups of berry juice do you need to keep the ratio?`,
        answer: cups / water,
        hint: `${cups} ÷ ${water} to keep the same ratio`,
      }
    },
  },
  {
    tier: 1,
    topic: 'ratios',
    generate() {
      const hunters = pick([2, 3, 4])
      const rabbits = pick([3, 4, 5])
      const groups = randInt(2, 4)
      return {
        question: `For every ${hunters} hunters, they catch ${rabbits} rabbits. If there are ${hunters * groups} hunters, how many rabbits will they catch at the same rate?`,
        answer: rabbits * groups,
        hint: `${hunters * groups} ÷ ${hunters} = ${groups} groups. ${groups} × ${rabbits} rabbits`,
      }
    },
  },

  // ---- PERCENTAGES (tier 1) ----
  {
    tier: 1,
    topic: 'percentages',
    generate() {
      const total = pick([10, 20, 40, 50, 100])
      return {
        question: `You shot ${total} arrows today. Half of them hit. What is 50% of ${total}?`,
        answer: total / 2,
        hint: `50% means half. ${total} ÷ 2`,
      }
    },
  },
  {
    tier: 1,
    topic: 'percentages',
    generate() {
      const total = pick([10, 20, 30, 40, 50])
      const ten = total / 10
      return {
        question: `You have ${total} pieces of jerky. You give away 10%. How many do you give away?`,
        answer: ten,
        hint: `10% means 1 out of 10. ${total} ÷ 10`,
      }
    },
  },
  {
    tier: 1,
    topic: 'percentages',
    generate() {
      const total = 100
      const percent = pick([25, 50, 75])
      return {
        question: `The trading post has ${total} flint chips. ${percent}% of them are sharp enough to use. How many are sharp?`,
        answer: (total * percent) / 100,
        hint: `${percent}% of ${total} = ${percent}`,
      }
    },
  },

  // ---- MULTI-STEP (tier 1) ----
  {
    tier: 1,
    topic: 'multi_step',
    generate() {
      const had = randInt(10, 20)
      const found = randInt(3, 8)
      const gave = randInt(2, 5)
      return {
        question: `You had ${had} feathers. You found ${found} more, then gave ${gave} to your friend. How many do you have now?`,
        answer: had + found - gave,
        hint: `${had} + ${found} = ${had + found}. Then ${had + found} − ${gave}`,
      }
    },
  },
  {
    tier: 1,
    topic: 'multi_step',
    generate() {
      const groups = randInt(2, 4)
      const perGroup = randInt(3, 6)
      const eaten = randInt(1, 3)
      return {
        question: `You found ${groups} bushes with ${perGroup} berries each. You ate ${eaten} berries. How many are left?`,
        answer: groups * perGroup - eaten,
        hint: `${groups} × ${perGroup} = ${groups * perGroup}. Then − ${eaten}`,
      }
    },
  },
  {
    tier: 1,
    topic: 'multi_step',
    generate() {
      const a = randInt(5, 15)
      const b = randInt(5, 15)
      const c = randInt(3, 8)
      return {
        question: `You hiked ${a} miles on Day 1 and ${b} miles on Day 2. You still have ${c} miles to go. How far is the total trail?`,
        answer: a + b + c,
        hint: `${a} + ${b} + ${c}`,
      }
    },
  },

  // ========================================================================
  // TIER 2 — 4th Grade: Larger numbers, intro fractions & ratios
  // ========================================================================

  // ---- MULTIPLICATION (tier 2) ----
  {
    tier: 2,
    topic: 'multiplication',
    generate() {
      const days = randInt(5, 9)
      const perDay = randInt(6, 12)
      return {
        question: `Your hunting party travels ${perDay} miles each day for ${days} days. How many miles total?`,
        answer: days * perDay,
        hint: `${days} × ${perDay}`,
      }
    },
  },
  {
    tier: 2,
    topic: 'multiplication',
    generate() {
      const hunters = randInt(4, 8)
      const arrowsEach = randInt(8, 15)
      return {
        question: `${hunters} hunters are going on an expedition. Each hunter needs ${arrowsEach} arrows. How many arrows total?`,
        answer: hunters * arrowsEach,
        hint: `${hunters} × ${arrowsEach}`,
      }
    },
  },
  {
    tier: 2,
    topic: 'multiplication',
    generate() {
      const hides = randInt(6, 12)
      const sinew = randInt(3, 7)
      return {
        question: `You need to make bowstrings. Each hide gives you ${sinew} feet of sinew. You have ${hides} hides. How many feet of sinew total?`,
        answer: hides * sinew,
        hint: `${hides} × ${sinew}`,
      }
    },
  },

  // ---- DIVISION (tier 2) ----
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
    topic: 'division',
    generate() {
      const total = pick([48, 56, 64, 72, 84, 96])
      const days = pick([6, 7, 8])
      return {
        question: `You smoked ${total} pieces of meat. You need it to last ${days} days. How many pieces can you eat per day?`,
        answer: total / days,
        hint: `${total} ÷ ${days}`,
      }
    },
  },
  {
    tier: 2,
    topic: 'division',
    generate() {
      const totalMiles = pick([36, 48, 54, 72])
      const milesPerDay = pick([6, 8, 9])
      return {
        question: `The hunting grounds are ${totalMiles} miles away. You travel ${milesPerDay} miles a day. How many days until you arrive?`,
        answer: totalMiles / milesPerDay,
        hint: `${totalMiles} ÷ ${milesPerDay}`,
      }
    },
  },

  // ---- ADDITION & SUBTRACTION (tier 2) ----
  {
    tier: 2,
    topic: 'addition',
    generate() {
      const a = randInt(125, 350)
      const b = randInt(75, 250)
      return {
        question: `Your camp traded ${a} pelts in the spring and ${b} pelts in the fall. How many pelts total?`,
        answer: a + b,
        hint: `${a} + ${b}`,
      }
    },
  },
  {
    tier: 2,
    topic: 'addition',
    generate() {
      const start = randInt(200, 500)
      const used = randInt(50, 150)
      const found = randInt(30, 100)
      return {
        question: `You started the season with ${start} arrows. You used ${used} and crafted ${found} more. How many do you have?`,
        answer: start - used + found,
        hint: `${start} − ${used} = ${start - used}. Then + ${found}`,
      }
    },
  },
  {
    tier: 2,
    topic: 'addition',
    generate() {
      const a = randInt(45, 99)
      const b = randInt(45, 99)
      const c = randInt(20, 60)
      return {
        question: `Three hunters caught ${a}, ${b}, and ${c} fish. How many fish did they catch in all?`,
        answer: a + b + c,
        hint: `${a} + ${b} + ${c}`,
      }
    },
  },

  // ---- FRACTIONS (tier 2) ----
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
    topic: 'fractions',
    generate() {
      const total = pick([16, 20, 24, 32])
      const half = total / 2
      return {
        question: `You have ${total} pieces of jerky. You eat half today and give away a quarter of what's left. How many do you still have?`,
        answer: half - (half / 4),
        hint: `Half of ${total} = ${half}. A quarter of ${half} = ${half / 4}. Then ${half} − ${half / 4}`,
      }
    },
  },
  {
    tier: 2,
    topic: 'fractions',
    generate() {
      const total = pick([12, 15, 18, 24])
      const denom = pick([3, 4, 6])
      const part = total / denom
      return {
        question: `You caught ${total} trout. You keep 1/${denom} of them and release the rest. How many do you keep?`,
        answer: part,
        hint: `${total} ÷ ${denom}`,
      }
    },
  },

  // ---- RATIOS (tier 2) ----
  {
    tier: 2,
    topic: 'ratios',
    generate() {
      const pelts = pick([5, 10, 15, 20])
      const rate = pick([2, 3, 5])
      return {
        question: `The trade ratio at the post is ${rate} pelts : 1 flint chip. You bring ${pelts} pelts. How many flint chips do you receive?`,
        answer: pelts / rate,
        hint: `Divide by the ratio: ${pelts} ÷ ${rate}`,
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
        question: `The trade ratio is ${fish} fish : ${cord} sinew cord${cord > 1 ? 's' : ''}. You have ${totalFish} fish. Keeping the same ratio, how many cords do you get?`,
        answer: (totalFish / fish) * cord,
        hint: `${totalFish} ÷ ${fish} = ${totalFish / fish} trades. ${totalFish / fish} × ${cord}`,
      }
    },
  },
  {
    tier: 2,
    topic: 'ratios',
    generate() {
      const meatPer = pick([3, 4, 5])
      const animals = randInt(3, 6)
      return {
        question: `The ratio of meat to hide from a deer is ${meatPer}:1. If you collected ${animals} pounds of hide, how many pounds of meat did you get at that ratio?`,
        answer: meatPer * animals,
        hint: `For every 1 hide, you get ${meatPer} meat. ${meatPer} × ${animals}`,
      }
    },
  },

  // ---- PERCENTAGES (tier 2) ----
  {
    tier: 2,
    topic: 'percentages',
    generate() {
      const total = pick([20, 40, 50, 80])
      const percent = pick([25, 50, 75])
      return {
        question: `You shot ${total} arrows this week. ${percent}% of them hit the target. How many arrows hit?`,
        answer: (total * percent) / 100,
        hint: `${percent}% of ${total} = ${total} × ${percent} ÷ 100`,
      }
    },
  },
  {
    tier: 2,
    topic: 'percentages',
    generate() {
      const total = pick([20, 30, 40, 50])
      return {
        question: `Your camp stored ${total} pounds of dried meat. Mice ate 10%. How many pounds did mice eat?`,
        answer: total / 10,
        hint: `10% = ${total} ÷ 10`,
      }
    },
  },
  {
    tier: 2,
    topic: 'percentages',
    generate() {
      const total = pick([40, 60, 80, 100])
      const percent = pick([25, 50])
      const amount = (total * percent) / 100
      return {
        question: `The river is ${total} paces wide. You've waded ${percent}% of the way. How many paces have you crossed?`,
        answer: amount,
        hint: `${percent}% of ${total} = ${total} × ${percent} ÷ 100`,
      }
    },
  },

  // ---- MULTI-STEP (tier 2) ----
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

  // ========================================================================
  // TIER 3 — 5th-6th Grade: Complex fractions, ratios, percentages
  // ========================================================================

  // ---- MULTIPLICATION (tier 3) ----
  {
    tier: 3,
    topic: 'multiplication',
    generate() {
      const a = randInt(12, 25)
      const b = randInt(11, 20)
      return {
        question: `Your hunting party of ${a} hunters each needs ${b} arrows for a week-long expedition. How many arrows total?`,
        answer: a * b,
        hint: `${a} × ${b}`,
      }
    },
  },
  {
    tier: 3,
    topic: 'multiplication',
    generate() {
      const weight = randInt(8, 15)
      const packs = randInt(6, 12)
      return {
        question: `Each supply pack weighs ${weight} pounds. The mule carries ${packs} packs. What's the total weight?`,
        answer: weight * packs,
        hint: `${weight} × ${packs}`,
      }
    },
  },
  {
    tier: 3,
    topic: 'multiplication',
    generate() {
      const yards = randInt(15, 30)
      const feet = 3
      return {
        question: `The elk is ${yards} yards away. How many feet is that? (1 yard = 3 feet)`,
        answer: yards * feet,
        hint: `${yards} × 3`,
      }
    },
  },

  // ---- DIVISION (tier 3) ----
  {
    tier: 3,
    topic: 'division',
    generate() {
      const total = pick([144, 168, 192, 216, 252])
      const weeks = pick([6, 7, 8, 9])
      return {
        question: `You harvested ${total} pounds of meat to last ${weeks} weeks. How many pounds per week?`,
        answer: total / weeks,
        hint: `${total} ÷ ${weeks}`,
      }
    },
  },
  {
    tier: 3,
    topic: 'division',
    generate() {
      const total = pick([125, 150, 175, 225])
      const perQuiver = 25
      return {
        question: `You have ${total} arrows to fill quivers. Each quiver holds ${perQuiver}. How many quivers can you fill?`,
        answer: total / perQuiver,
        hint: `${total} ÷ ${perQuiver}`,
      }
    },
  },
  {
    tier: 3,
    topic: 'division',
    generate() {
      const totalOunces = pick([48, 64, 80, 96])
      const ouncesPerPouch = pick([8, 12, 16])
      return {
        question: `You ground ${totalOunces} ounces of pemmican. Each travel pouch holds ${ouncesPerPouch} ounces. How many pouches can you fill?`,
        answer: totalOunces / ouncesPerPouch,
        hint: `${totalOunces} ÷ ${ouncesPerPouch}`,
      }
    },
  },

  // ---- ADDITION & SUBTRACTION (tier 3) ----
  {
    tier: 3,
    topic: 'addition',
    generate() {
      const a = randInt(250, 600)
      const b = randInt(150, 400)
      const c = randInt(50, 200)
      return {
        question: `Three camps traded pelts: ${a}, ${b}, and ${c}. How many pelts traded in all?`,
        answer: a + b + c,
        hint: `${a} + ${b} + ${c}`,
      }
    },
  },
  {
    tier: 3,
    topic: 'addition',
    generate() {
      const start = randInt(500, 1000)
      const lost = randInt(100, 300)
      const gained = randInt(50, 200)
      const traded = randInt(50, 150)
      return {
        question: `Your camp started with ${start} supplies. You lost ${lost} in a storm, gathered ${gained}, then traded away ${traded}. How many remain?`,
        answer: start - lost + gained - traded,
        hint: `${start} − ${lost} + ${gained} − ${traded}`,
      }
    },
  },
  {
    tier: 3,
    topic: 'addition',
    generate() {
      const buy = randInt(35, 75)
      const sell = randInt(50, 99)
      return {
        question: `You bought supplies for ${buy} pelts and sold furs for ${sell} pelts. What is your profit?`,
        answer: sell - buy,
        hint: `${sell} − ${buy}`,
      }
    },
  },

  // ---- FRACTIONS (tier 3) ----
  {
    tier: 3,
    topic: 'fractions',
    generate() {
      const total = pick([18, 24, 30, 36])
      const numerator = pick([2, 3])
      const denominator = pick([3, 4])
      if (numerator >= denominator) return this.generate()
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
    topic: 'fractions',
    generate() {
      const denominator = pick([3, 4, 5, 6])
      const whole = pick([12, 18, 24, 30])
      const numerator1 = 1
      const numerator2 = pick([1, 2])
      if (numerator1 + numerator2 >= denominator) return this.generate()
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
  {
    tier: 3,
    topic: 'fractions',
    generate() {
      const total = pick([20, 24, 30, 36, 40])
      const num = pick([2, 3, 4])
      const den = pick([5, 6, 8])
      if (num >= den) return this.generate()
      const result = (total * num) / den
      if (!Number.isInteger(result)) return this.generate()
      return {
        question: `The hunting grounds are ${total} miles long. You've traveled ${num}/${den} of the distance. How many miles have you gone?`,
        answer: result,
        hint: `${total} × ${num} ÷ ${den}`,
      }
    },
  },

  // ---- RATIOS (tier 3) ----
  {
    tier: 3,
    topic: 'ratios',
    generate() {
      const pelts = pick([5, 8, 10])
      const arrowheads = pick([2, 3, 4])
      const playerPelts = pelts * randInt(2, 4)
      return {
        question: `The trading ratio is ${pelts} pelts : ${arrowheads} arrowheads. You bring ${playerPelts} pelts. Keeping the proportion, how many arrowheads do you get?`,
        answer: (playerPelts / pelts) * arrowheads,
        hint: `${playerPelts} ÷ ${pelts} = ${playerPelts / pelts} groups. ${playerPelts / pelts} × ${arrowheads}`,
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
        question: `Wind drift ratio: ${windPerTen} paces sideways for every 10 paces forward. Your target is ${distance} paces away. What's the proportional drift?`,
        answer: (distance / 10) * windPerTen,
        hint: `Set up proportion: ${windPerTen}/10 = x/${distance}. So x = ${distance} ÷ 10 × ${windPerTen}`,
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
        question: `A recipe ratio: ${cups} cups of meat makes ${servings} servings. You need ${needed} servings. How many cups of meat do you need to keep the same ratio?`,
        answer: cups * multiplier,
        hint: `Scale the ratio: ${needed} ÷ ${servings} = ${multiplier}. Then ${cups} × ${multiplier}`,
      }
    },
  },

  // ---- PERCENTAGES (tier 3) ----
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
    topic: 'percentages',
    generate() {
      const shots = pick([20, 25, 40, 50])
      const hitPercent = pick([60, 70, 75, 80])
      const hits = (shots * hitPercent) / 100
      return {
        question: `You fired ${shots} arrows and hit ${hitPercent}% of the time. How many arrows hit their target?`,
        answer: hits,
        hint: `${hitPercent}% of ${shots} = ${shots} × ${hitPercent} ÷ 100`,
      }
    },
  },

  // ---- MULTI-STEP (tier 3) ----
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
    topic: 'multi_step',
    generate() {
      const price = randInt(8, 15)
      const qty = randInt(3, 6)
      const paid = price * qty + randInt(5, 20)
      return {
        question: `You buy ${qty} bundles of sinew at ${price} pelts each. You hand over ${paid} pelts. How much change do you get?`,
        answer: paid - price * qty,
        hint: `${qty} × ${price} = ${price * qty}. Then ${paid} − ${price * qty}`,
      }
    },
  },
  {
    tier: 3,
    topic: 'multi_step',
    generate() {
      const perHour = randInt(3, 6)
      const hours = randInt(3, 5)
      const broke = randInt(2, 4)
      return {
        question: `You craft ${perHour} arrows per hour for ${hours} hours. ${broke} arrows broke during testing. How many good arrows remain?`,
        answer: perHour * hours - broke,
        hint: `${perHour} × ${hours} = ${perHour * hours}. Then − ${broke}`,
      }
    },
  },
]

export function generateQuestion(tier, topic = 'all') {
  let available = TEMPLATES.filter((t) => t.tier <= tier)

  if (topic && topic !== 'all') {
    const topicFiltered = available.filter((t) => t.topic === topic)
    if (topicFiltered.length > 0) {
      available = topicFiltered
    }
  }

  const template = pick(available)
  const question = template.generate()
  return { ...question, tier: template.tier, topic: template.topic }
}

/**
 * Generate a helpful hint when the player gets a wrong answer.
 * Looks at the question topic, their answer vs correct answer, and the hint.
 */
export function getWrongAnswerFeedback(question, playerAnswer) {
  const { answer, hint, topic } = question
  const num = parseFloat(playerAnswer)

  const topicTips = {
    multiplication: "This is a multiplication problem — try multiplying the groups together.",
    division: "This is a division problem — think about splitting into equal parts.",
    addition: "Think about adding and subtracting carefully, one step at a time.",
    fractions: "With fractions, think about what part of the whole you need.",
    ratios: "Ratios compare two amounts — try setting up a proportion.",
    percentages: "For percentages, remember that 'percent' means 'out of 100'.",
    multi_step: "Break this into smaller steps — solve one part first, then use that answer.",
  }

  let feedback = topicTips[topic] || "Read the question carefully and try again."

  if (!isNaN(num) && !isNaN(answer)) {
    if (num === answer * 2) {
      feedback += " You doubled when you didn't need to!"
    } else if (num === answer / 2) {
      feedback += " You might need to double your answer."
    } else if (Math.abs(num - answer) <= 2) {
      feedback += " You're very close! Check your arithmetic one more time."
    } else if (num > answer * 3) {
      feedback += " Your answer is too high — try a smaller number."
    } else if (num < answer / 3 && num > 0) {
      feedback += " Your answer is too low — try a bigger number."
    }
  }

  if (hint) {
    feedback += ` (Hint: ${hint})`
  }

  return feedback
}

export function getTimerSeconds(difficulty) {
  switch (difficulty) {
    case 'easy': return 30
    case 'normal': return 20
    case 'hunter': return 12
    default: return 20
  }
}
