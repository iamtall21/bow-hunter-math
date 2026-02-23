import { create } from 'zustand'
import { STARTER_INVENTORY, RECIPES, ANIMALS, AREAS, RANKS, QUESTS } from '../data/gameData'

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
    difficultyTier: 1,
    difficulty: 'normal',
    mathTopic: 'all',
    inventory: { ...STARTER_INVENTORY },
    craftedItems: {},
    unlockedAreas: ['meadow'],
    completedQuests: [],
    perfectStreak: 0,
    stats: {
      totalHunts: 0,
      perfectShots: 0,
      totalCorrect: 0,
      totalAttempted: 0,
      animalsHarvested: {},
      totalCrafted: {},
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
      set({ ...save, screen: 'camp', initialized: true })
    } else {
      set({ ...getDefaultState(), playerName: name, screen: 'camp', initialized: true })
      get().saveGame()
    }
  },

  loadExistingSave() {
    const save = loadSave()
    if (save && save.playerName) {
      set({ ...save, screen: 'camp', initialized: true })
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
      difficultyTier: state.difficultyTier,
      difficulty: state.difficulty,
      mathTopic: state.mathTopic,
      inventory: state.inventory,
      craftedItems: state.craftedItems,
      unlockedAreas: state.unlockedAreas,
      completedQuests: state.completedQuests,
      perfectStreak: state.perfectStreak,
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

    // Adjust difficulty tier based on accuracy
    let newTier = state.difficultyTier
    if (newAccuracy.length >= 5) {
      const avgAccuracy = newAccuracy.reduce((a, b) => a + b, 0) / newAccuracy.length
      if (avgAccuracy > 0.8 && newTier < 3) newTier = Math.min(newTier + 1, 3)
      else if (avgAccuracy < 0.4 && newTier > 1) newTier = Math.max(newTier - 1, 1)
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
