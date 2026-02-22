# Bow Hunter: Trail of the Arrow
## Project Design Record (PDR)

---

## 1. Overview

**Title:** Bow Hunter: Trail of the Arrow
**Genre:** Educational hunting/crafting game with timed math challenges
**Target Player:** 11-year-old boy (5th-6th grade math, loves hunting, fishing, woodworking, outdoors)
**Platform:** Web app (React), future iOS via Capacitor
**Core Hook:** You are a young Native American hunter learning the traditional ways. To craft weapons, catch food, and complete hunts, you must solve math problems under time pressure. The math IS the skill — just like a real hunter has to think fast and calculate distances, wind, and supplies.

---

## 2. Core Game Loop

```
CAMP (home base)
  → View quests / objectives
  → Craft gear (requires collected materials in specific RATIOS)
  → Check inventory
  → Choose a hunting or fishing expedition

EXPEDITION (the action)
  → Encounter animals/fish
  → Math challenge appears (must answer before timer runs out)
  → Correct + fast = successful hunt/catch
  → Correct + slow = animal spooked, partial reward
  → Incorrect = miss / animal escapes
  → Collect materials from the environment along the way

RETURN TO CAMP
  → Tally harvest
  → Craft new gear with materials
  → Unlock new areas / harder expeditions
  → Track progress on the season board
```

---

## 3. The Math System (Hidden Curriculum)

Math is embedded in EVERY action, never presented as "school work."

### 3a. Hunting & Fishing — Timed Math Questions

Before each shot/cast, a challenge appears styled as a hunter's calculation:

| Game Framing | Actual Math Concept |
|---|---|
| "The elk is 120 paces away. Your arrow drops 1 pace for every 15 paces. How far does it drop?" | Division, multiplication |
| "You need to split 24 fish equally among 6 families. How many each?" | Division |
| "Wind is pushing 3/4 pace left per 10 paces. Target is 40 paces. How far left do you aim?" | Fractions × multiplication |
| "You used 2/3 of your arrows. You started with 18. How many are left?" | Fractions of a whole |
| "The deer is moving 8 paces per breath. You need 3 breaths to aim. How far will it move?" | Multi-step multiplication |
| "Your snare line is 15 feet. You need traps every 2.5 feet. How many traps?" | Decimal division |
| "Trade 5 pelts for 3 arrowheads. You have 20 pelts. How many arrowheads?" | Ratios / proportional reasoning |

**Timer:** Each question has a countdown (adjustable difficulty):
- **Easy mode:** 15 seconds
- **Normal mode:** 10 seconds
- **Hunter mode:** 7 seconds

**Scoring:**
- Correct + within first 40% of time = **Perfect Shot** (full reward + bonus material)
- Correct + within time = **Hit** (full reward)
- Correct + time expired = **Spooked** (animal runs, half reward or nothing)
- Incorrect = **Miss** (no reward, arrow/bait lost)

### 3b. Crafting System — Ratios and Proportions

Crafting gear requires materials in specific ratios. The player must figure out what they need.

**Example Recipes:**

| Item | Recipe | Math Concept |
|---|---|---|
| **Basic Arrow (x5)** | 3 straight sticks + 5 flint chips + 10 feathers | Ratios, counting |
| **Recurve Bow** | 1 ash branch + 2 sinew cords + 1 grip wrap | Simple recipe |
| **Strong Bow** | Upgrade: 1 recurve bow + 3 sinew cords + 2 elk antler tips | Multi-step |
| **Fish Trap** | 12 willow branches + 8 lengths of cord (each 1.5 ft) | Decimals, multiplication |
| **Snare** | 1 sapling + 6 ft cord + 1 trigger stick (ratio: 3 snares need 18 ft cord) | Proportional reasoning |
| **War Paint** | 2 parts red clay + 1 part bear grease + 3 parts water | Ratio mixing |
| **Pemmican (trail food)** | 4 cups dried meat + 2 cups berries + 1 cup fat — makes 7 portions | Fractions, ratios |
| **Dugout Canoe** | 1 large log + 40 chisel strikes (each removes 1/8 of remaining wood) | Fractions, exponential thinking |

**The trick:** The player sees "I want to make 15 arrows" and has to calculate:
- 15 arrows ÷ 5 per batch = 3 batches
- 3 batches × 3 sticks = 9 sticks
- 3 batches × 5 flint = 15 flint chips
- 3 batches × 10 feathers = 30 feathers

The game asks: "How many feathers do you need for 15 arrows?" — and they have to figure it out.

### 3c. Trading Post — Proportional Reasoning

A trading post lets the player swap materials:
- "5 rabbit pelts = 2 flint chips"
- "3 fish = 1 sinew cord"
- "10 feathers = 1 ash branch"

Questions like: "You have 12 fish. How many sinew cords can you trade for?"

### 3d. Tracking & Estimation

Between hunts, the player follows animal tracks:
- "The tracks are 2.5 feet apart. You see 14 tracks. How far did the animal walk?"
- "The tracks get 0.5 feet closer together each set of 4. The animal is slowing/speeding?"
- Visual estimation: "About how many deer are in this herd?" (rounding, estimation)

---

## 4. Game World & Areas

### 4a. Areas (unlock progressively)

| Area | Unlocked By | Animals/Fish | Difficulty |
|---|---|---|---|
| **The Meadow** | Start | Rabbit, Quail, Wild Turkey | Easy (whole numbers, basic operations) |
| **The River** | Craft a fish trap | Trout, Catfish, Crawfish | Easy-Medium (intro fractions) |
| **The Deep Woods** | Craft a strong bow | Deer, Wild Boar | Medium (fractions, multi-step) |
| **The High Ridge** | Complete 10 hunts | Elk, Mountain Goat, Eagle feathers | Medium-Hard (decimals, ratios) |
| **The Great Lake** | Craft a canoe | Large Mouth Bass, Pike, Sturgeon | Hard (proportions, percentages) |
| **The Sacred Grounds** | Collect all artifacts | All + rare legendary animals | Challenge (mixed, complex) |

### 4b. Seasons

The game runs in 4 seasons, each with different available animals and challenges:
- **Spring:** Fishing is best, planting, baby animals (no hunting fawns — teaches conservation)
- **Summer:** All areas open, longest days (more time on timer)
- **Fall:** Best hunting, harvest gathering, preparation for winter
- **Winter:** Limited animals, survival focus, manage stored food with fractions

---

## 5. Progression & Rewards

### 5a. Hunter Rank
Player levels up through ranks:
1. **Apprentice** — Learning the basics
2. **Scout** — Can track animals
3. **Hunter** — Access to harder areas
4. **Warrior** — Bonus crafting recipes
5. **Elder Hunter** — All areas, all recipes, legend hunts

Rank up by earning **Honor Points:**
- Perfect Shot = 3 honor
- Hit = 1 honor
- Completing a quest = 5 honor
- Crafting a new item for the first time = 2 honor

### 5b. Artifact Collection
Rare artifacts are hidden across areas. Collecting them all unlocks the Sacred Grounds:
- **Obsidian Arrowhead** (The Meadow)
- **Carved Bone Hook** (The River)
- **Bear Claw Necklace** (The Deep Woods)
- **Eagle Feather Headdress** (The High Ridge)
- **Turquoise Stone** (The Great Lake)

Each artifact requires completing a special multi-step math challenge (word problem style).

### 5c. Camp Upgrades
Use harvested materials to upgrade your camp:
- **Drying Rack** — Store more meat (inventory expansion)
- **Tanning Station** — Make pelts worth 2x in trades
- **Fletching Bench** — Craft arrows faster (reduce material cost by fractions)
- **Smoke House** — Food lasts through winter

Each upgrade has a material cost that requires ratio calculations.

---

## 6. Math Difficulty Scaling

The game adapts based on performance:

| Player Performance | Adjustment |
|---|---|
| 80%+ correct, fast answers | Increase difficulty tier, reduce timer |
| 60-80% correct | Stay at current level, mix in review |
| Below 60% | Drop difficulty, add hints, increase timer |

**Difficulty Tiers (mapped to grade levels):**
- **Tier 1 (3rd grade):** Addition, subtraction, basic multiplication, simple division
- **Tier 2 (4th grade):** Multi-digit multiplication, long division, intro fractions
- **Tier 3 (5th grade):** Fraction operations, decimals, basic ratios
- **Tier 4 (6th grade):** Proportional reasoning, percentages, multi-step word problems, negative numbers (temperature/depth)

---

## 7. UI & Visual Style

### 7a. Art Direction
- **Style:** Hand-drawn / watercolor aesthetic — think field journal sketches
- **Palette:** Earth tones — browns, greens, tans, with pops of sunset orange and river blue
- **Font:** Slightly rugged, readable (no Comic Sans — something like a hand-lettered look)
- **Animals:** Illustrated, not cartoonish — respectful, somewhat realistic
- **Camp view:** Top-down or isometric, cozy, firepit in center

### 7b. Key Screens

**Camp Screen:**
- Central firepit with camp around it
- Clickable areas: Crafting bench, Inventory pouch, Quest board, Trail (go hunting)
- Current season and weather shown
- Hunter rank badge displayed

**Expedition Screen:**
- Side-scrolling or scene-based (walk through environment)
- Animal appears → math challenge overlays → timer bar counts down
- Answer input: number pad for quick entry (mobile-friendly)
- Visual feedback: arrow flying on correct, miss animation on wrong

**Crafting Screen:**
- Recipe list on left
- Player inventory on right
- "How many can you make?" and "What do you need?" prompts
- Drag-and-drop or tap to assign materials

**Trading Post:**
- NPC trader with exchange rates displayed
- Player proposes a trade, must calculate the math
- Bonus: haggling mini-game (percentages)

---

## 8. Audio

- Ambient nature sounds per area (birds, river, wind)
- Bowstring twang on shot
- Satisfying "thunk" on hit
- Drum-beat timer countdown
- Celebratory flute melody on quest complete
- Crackling fire at camp

---

## 9. Technical Architecture

### 9a. Stack
- **Frontend:** React + Vite
- **State Management:** React Context or Zustand (lightweight)
- **Styling:** CSS modules or Tailwind
- **Storage:** localStorage for save data (single-player, no backend needed)
- **Future:** Capacitor for iOS/Android wrapper
- **Art assets:** SVG illustrations (scalable, lightweight)

### 9b. Data Model (simplified)

```
GameState {
  player: {
    name: string
    rank: number (1-5)
    honor: number
    currentSeason: "spring" | "summer" | "fall" | "winter"
    difficultyTier: number (1-4)
    recentAccuracy: number[] (last 20 answers)
  }
  inventory: {
    [materialName]: quantity
  }
  craftedItems: {
    [itemName]: quantity
  }
  artifacts: string[] (collected artifact IDs)
  unlockedAreas: string[]
  campUpgrades: string[]
  questLog: {
    active: Quest[]
    completed: Quest[]
  }
  stats: {
    totalHunts: number
    perfectShots: number
    totalCorrect: number
    totalAttempted: number
    animalsHarvested: { [animal]: number }
  }
}
```

### 9c. Question Engine

Questions are generated from templates with randomized numbers:
```
Template: "The {animal} is {distance} paces away. Your arrow drops 1 pace for every {divisor} paces. How far does it drop?"
Variables: animal = random, distance = [30-200], divisor = [10, 15, 20, 25]
Answer: distance / divisor
Tier: 2
```

A bank of 50+ templates across all tiers, with randomized values so questions never repeat exactly.

---

## 10. MVP Scope (Build First)

For the initial buildable version, focus on:

1. **Camp screen** with inventory and quest board
2. **One area** (The Meadow) with 3 animals
3. **Math challenge system** with timer and scoring
4. **Basic crafting** (arrows and bow)
5. **5-10 question templates** per tier, tiers 1-3
6. **Progression:** Honor points and rank tracking
7. **Save/load** via localStorage
8. **Clean, functional UI** (art polish can come later)

### MVP NOT included (Phase 2+):
- Multiple areas beyond The Meadow
- Trading post
- Seasons system
- Artifact collection
- Audio
- Animations beyond basic feedback
- Mobile/iOS build

---

## 11. Success Metrics

How we know it's working:
- The kid WANTS to play it without being told to
- He doesn't realize he's doing math until you point it out
- Accuracy on math improves over play sessions (tracked in stats)
- He talks about "needing more flint" not "needing to do more math"

---

## 12. Cultural Note

This game draws inspiration from Native American hunting traditions with respect. The framing is about learning from elders, respecting animals (take only what you need), and honoring the land. Conservation is woven in — you cannot over-hunt an area, and the game rewards sustainable practices. No stereotypes, no costumes — just skills, respect, and the natural world.
