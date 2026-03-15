import { create } from 'zustand'
import { STARTER_INVENTORY, RECIPES, ANIMALS, AREAS, RANKS, QUESTS, LEVELS } from '../data/gameData'
import { GRADE_LEVELS } from '../data/mathTemplates'

const SAVE_KEY = 'bow_hunter_save'

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function getDefaultState() {
  return {
    playerName: '',
    honor: 0,
    rankIndex: 0,
    gradeLevel: 5,
    difficultyTier: 3,
    difficulty: 'normal',
    mathTopic: 'all',
    timerEnabled: true,
    inventory: { ...STARTER_INVENTORY },
    craftedItems: {},
    level: 1,
    unlockedAreas: ['meadow'],
    unlockedRecipes: ['basic_arrow', 'snare'],
    completedQuests: [],
    perfectStreak: 0,
    playerWorldX: null,
    playerWorldY: null,
    stats: {
      totalHunts: 0,
      perfectShots: 0,
      totalCorrect: 0,
      totalAttempted: 0,
      animalsHarvested: {},
      totalCrafted: {},
      totalFishCaught: 0,
      fishHarvested: {},
    },
    recentAccuracy: [],
  }
}

export const useGameStore = create((set, get) => ({
  ...getDefaultState(),
  screen: 'title',
  initialized: false,

  // ---- INIT ----
  initGame(name) {
    const save = loadSave()
    if (save && save.playerName) {
      set({ ...getDefaultState(), ...save, screen: 'overworld', initialized: true })
    } else {
      set({ ...getDefaultState(), playerName: name, screen: 'overworld', initialized: true })
      get().saveGame()
    }
  },

  loadExistingSave() {
    const save = loadSave()
    if (save && save.playerName) {
      set({ ...getDefaultState(), ...save, screen: 'overworld', initialized: true })
      return true
    }
    return false
  },

  hasSave() {
    const save = loadSave()
    return save && save.playerName
  },

  saveGame() {
    const state = get()
    const toSave = {
      playerName: state.playerName,
      honor: state.honor,
      rankIndex: state.rankIndex,
      gradeLevel: state.gradeLevel,
      difficultyTier: state.difficultyTier,
      difficulty: state.difficulty,
      mathTopic: state.mathTopic,
      timerEnabled: state.timerEnabled,
      level: state.level,
      inventory: state.inventory,
      craftedItems: state.craftedItems,
      unlockedAreas: state.unlockedAreas,
      unlockedRecipes: state.unlockedRecipes,
      completedQuests: state.completedQuests,
      perfectStreak: state.perfectStreak,
      playerWorldX: state.playerWorldX,
      playerWorldY: state.playerWorldY,
      stats: state.stats,
      recentAccuracy: state.recentAccuracy,
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave))
  },

  resetGame() {
    localStorage.removeItem(SAVE_KEY)
    set({ ...getDefaultState(), screen: 'title', initialized: false })
  },

  // ---- NAVIGATION ----
  goTo(screen) {
    set({ screen })
  },

  setTopic(topic) {
    set({ mathTopic: topic })
    get().saveGame()
  },

  setGradeLevel(grade) {
    const baseTier = GRADE_LEVELS[grade]?.baseTier || 1
    set({ gradeLevel: grade, difficultyTier: baseTier })
    get().saveGame()
  },

  toggleTimer() {
    set({ timerEnabled: !get().timerEnabled })
    get().saveGame()
  },

  // ---- HUNTING RESULTS ----
  recordHunt(animalId, result) {
    const state = get()
    const animal = ANIMALS[animalId]
    if (!animal) return

    let honorGain = 0
    let perfectStreak = state.perfectStreak
    const newInventory = { ...state.inventory }
    const newStats = { ...state.stats }
    const newAccuracy = [...state.recentAccuracy]

    newStats.totalAttempted++

    if (result === 'perfect') {
      honorGain = animal.honor * 3
      newStats.totalCorrect++
      newStats.perfectShots++
      newStats.totalHunts++
      perfectStreak++
      newAccuracy.push(1)
      // Full drops + bonus material
      Object.entries(animal.drops).forEach(([mat, qty]) => {
        newInventory[mat] = (newInventory[mat] || 0) + qty + 1
      })
      // Bonus: random forage material from area
      const areaId = animal.area
      const forageOptions = AREAS[areaId]?.materialsFound || []
      if (forageOptions.length > 0) {
        const bonus = forageOptions[Math.floor(Math.random() * forageOptions.length)]
        newInventory[bonus] = (newInventory[bonus] || 0) + 2
      }
    } else if (result === 'hit') {
      honorGain = animal.honor
      newStats.totalCorrect++
      newStats.totalHunts++
      perfectStreak++
      newAccuracy.push(1)
      Object.entries(animal.drops).forEach(([mat, qty]) => {
        newInventory[mat] = (newInventory[mat] || 0) + qty
      })
    } else if (result === 'spooked') {
      honorGain = 0
      newStats.totalCorrect++
      perfectStreak = 0
      newAccuracy.push(0.5)
    } else {
      // miss
      perfectStreak = 0
      newAccuracy.push(0)
      // Lose an arrow on miss
      if (newInventory.arrow > 0) newInventory.arrow--
    }

    // Track animal harvested
    if (result === 'perfect' || result === 'hit') {
      newStats.animalsHarvested[animalId] = (newStats.animalsHarvested[animalId] || 0) + 1
    }

    // Keep only last 20 accuracy entries
    while (newAccuracy.length > 20) newAccuracy.shift()

    // Calculate new rank
    const newHonor = state.honor + honorGain
    let newRankIndex = state.rankIndex
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (newHonor >= RANKS[i].honorRequired) {
        newRankIndex = i
        break
      }
    }

    // Adjust difficulty tier based on accuracy (within grade range)
    const baseTier = GRADE_LEVELS[state.gradeLevel]?.baseTier || 1
    const minTier = Math.max(1, baseTier - 1)
    const maxTier = Math.min(3, baseTier + 1)
    let newTier = state.difficultyTier
    if (newAccuracy.length >= 5) {
      const avgAccuracy = newAccuracy.reduce((a, b) => a + b, 0) / newAccuracy.length
      if (avgAccuracy > 0.8 && newTier < maxTier) newTier = Math.min(newTier + 1, maxTier)
      else if (avgAccuracy < 0.4 && newTier > minTier) newTier = Math.max(newTier - 1, minTier)
    }

    set({
      honor: newHonor,
      rankIndex: newRankIndex,
      inventory: newInventory,
      perfectStreak,
      stats: newStats,
      recentAccuracy: newAccuracy,
      difficultyTier: newTier,
    })
    get().saveGame()
  },

  // ---- FISHING RESULTS ----
  recordFishing(fishId, result) {
    const state = get()
    const fish = ANIMALS[fishId]
    if (!fish) return

    let honorGain = 0
    let perfectStreak = state.perfectStreak
    const newInventory = { ...state.inventory }
    const newStats = { ...state.stats }
    const newAccuracy = [...state.recentAccuracy]

    newStats.totalAttempted++

    if (result === 'perfect') {
      honorGain = fish.honor * 3
      newStats.totalCorrect++
      newStats.perfectShots++
      newStats.totalFishCaught++
      perfectStreak++
      newAccuracy.push(1)
      Object.entries(fish.drops).forEach(([mat, qty]) => {
        newInventory[mat] = (newInventory[mat] || 0) + qty + 1
      })
      // Bonus river materials
      const forageOptions = AREAS.river?.materialsFound || []
      if (forageOptions.length > 0) {
        const bonus = forageOptions[Math.floor(Math.random() * forageOptions.length)]
        newInventory[bonus] = (newInventory[bonus] || 0) + 2
      }
    } else if (result === 'hit') {
      honorGain = fish.honor
      newStats.totalCorrect++
      newStats.totalFishCaught++
      perfectStreak++
      newAccuracy.push(1)
      Object.entries(fish.drops).forEach(([mat, qty]) => {
        newInventory[mat] = (newInventory[mat] || 0) + qty
      })
    } else if (result === 'spooked') {
      honorGain = 0
      newStats.totalCorrect++
      perfectStreak = 0
      newAccuracy.push(0.5)
    } else {
      // miss
      perfectStreak = 0
      newAccuracy.push(0)
      if (newInventory.spear > 0) newInventory.spear--
    }

    // Track fish harvested
    if (result === 'perfect' || result === 'hit') {
      newStats.fishHarvested = { ...newStats.fishHarvested }
      newStats.fishHarvested[fishId] = (newStats.fishHarvested[fishId] || 0) + 1
    }

    while (newAccuracy.length > 20) newAccuracy.shift()

    const newHonor = state.honor + honorGain
    let newRankIndex = state.rankIndex
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (newHonor >= RANKS[i].honorRequired) {
        newRankIndex = i
        break
      }
    }

    const baseTier = GRADE_LEVELS[state.gradeLevel]?.baseTier || 1
    const minTier = Math.max(1, baseTier - 1)
    const maxTier = Math.min(3, baseTier + 1)
    let newTier = state.difficultyTier
    if (newAccuracy.length >= 5) {
      const avgAccuracy = newAccuracy.reduce((a, b) => a + b, 0) / newAccuracy.length
      if (avgAccuracy > 0.8 && newTier < maxTier) newTier = Math.min(newTier + 1, maxTier)
      else if (avgAccuracy < 0.4 && newTier > minTier) newTier = Math.max(newTier - 1, minTier)
    }

    set({
      honor: newHonor,
      rankIndex: newRankIndex,
      inventory: newInventory,
      perfectStreak,
      stats: newStats,
      recentAccuracy: newAccuracy,
      difficultyTier: newTier,
    })
    get().saveGame()
  },

  // ---- CRAFTING ----
  canCraft(recipeId) {
    const recipe = RECIPES[recipeId]
    if (!recipe) return false
    const inv = get().inventory
    return Object.entries(recipe.materials).every(
      ([mat, qty]) => (inv[mat] || 0) >= qty
    )
  },

  craft(recipeId) {
    const recipe = RECIPES[recipeId]
    if (!recipe || !get().canCraft(recipeId)) return false

    const newInventory = { ...get().inventory }
    // Consume materials
    Object.entries(recipe.materials).forEach(([mat, qty]) => {
      newInventory[mat] -= qty
    })
    // Add produced items
    Object.entries(recipe.produces).forEach(([item, qty]) => {
      newInventory[item] = (newInventory[item] || 0) + qty
    })

    const newCrafted = { ...get().craftedItems }
    newCrafted[recipeId] = (newCrafted[recipeId] || 0) + 1

    const newStats = { ...get().stats }
    newStats.totalCrafted = { ...newStats.totalCrafted }
    newStats.totalCrafted[recipeId] = (newStats.totalCrafted[recipeId] || 0) + 1

    set({ inventory: newInventory, craftedItems: newCrafted, stats: newStats })
    get().saveGame()
    return true
  },

  // ---- FORAGING (camp) ----
  forage(materials) {
    const newInventory = { ...get().inventory }
    Object.entries(materials).forEach(([mat, qty]) => {
      newInventory[mat] = (newInventory[mat] || 0) + qty
    })
    set({ inventory: newInventory })
    get().saveGame()
  },

  // ---- LEVEL PROGRESSION ----
  checkLevelUp() {
    const state = get()
    const currentLevel = state.level || 1
    const correctCount = state.stats.totalCorrect

    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (correctCount >= LEVELS[i].correctNeeded && LEVELS[i].level > currentLevel) {
        const newLevel = LEVELS[i].level
        const newUnlockedAreas = [...state.unlockedAreas]
        const newUnlockedRecipes = [...(state.unlockedRecipes || ['basic_arrow', 'snare'])]

        // Apply all unlocks from currentLevel+1 to newLevel
        for (const lvl of LEVELS) {
          if (lvl.level > currentLevel && lvl.level <= newLevel) {
            for (const unlock of lvl.unlocks) {
              if (unlock.type === 'area' && !newUnlockedAreas.includes(unlock.id)) {
                newUnlockedAreas.push(unlock.id)
              }
              if (unlock.type === 'recipe' && !newUnlockedRecipes.includes(unlock.id)) {
                newUnlockedRecipes.push(unlock.id)
              }
            }
          }
        }

        set({
          level: newLevel,
          unlockedAreas: newUnlockedAreas,
          unlockedRecipes: newUnlockedRecipes,
        })
        get().saveGame()
        return {
          leveledUp: true,
          newLevel,
          unlocks: LEVELS.find(l => l.level === newLevel)?.unlocks || [],
        }
      }
    }
    return { leveledUp: false }
  },

  // ---- QUEST CHECKING ----
  getActiveQuests() {
    const state = get()
    return QUESTS.filter((q) => !state.completedQuests.includes(q.id))
  },

  getCompletedQuests() {
    return get().completedQuests.map((id) => QUESTS.find((q) => q.id === id)).filter(Boolean)
  },

  checkAndCompleteQuests() {
    const state = get()
    const newCompleted = [...state.completedQuests]
    let honorBonus = 0
    const newInventory = { ...state.inventory }

    for (const quest of QUESTS) {
      if (newCompleted.includes(quest.id)) continue

      let done = false
      const g = quest.goal

      if (g.type === 'hunt_total') {
        done = state.stats.totalHunts >= g.count
      } else if (g.type === 'hunt_animal') {
        done = (state.stats.animalsHarvested[g.animal] || 0) >= g.count
      } else if (g.type === 'craft') {
        done = (state.stats.totalCrafted?.[g.item] || 0) >= g.count
      } else if (g.type === 'perfect_streak') {
        done = state.perfectStreak >= g.count
      } else if (g.type === 'fish_total') {
        done = (state.stats.totalFishCaught || 0) >= g.count
      }

      if (done) {
        newCompleted.push(quest.id)
        honorBonus += quest.reward.honor || 0
        if (quest.reward.materials) {
          Object.entries(quest.reward.materials).forEach(([mat, qty]) => {
            newInventory[mat] = (newInventory[mat] || 0) + qty
          })
        }
      }
    }

    if (newCompleted.length > state.completedQuests.length) {
      const newHonor = state.honor + honorBonus
      let newRankIndex = state.rankIndex
      for (let i = RANKS.length - 1; i >= 0; i--) {
        if (newHonor >= RANKS[i].honorRequired) {
          newRankIndex = i
          break
        }
      }
      set({
        completedQuests: newCompleted,
        honor: newHonor,
        rankIndex: newRankIndex,
        inventory: newInventory,
      })
      get().saveGame()
      return newCompleted.filter((id) => !state.completedQuests.includes(id))
    }
    return []
  },
}))
