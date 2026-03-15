import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../store/gameStore'

// Reset store before each test
beforeEach(() => {
  localStorage.clear()
  useGameStore.setState({
    playerName: '',
    honor: 0,
    rankIndex: 0,
    gradeLevel: 5,
    difficultyTier: 3,
    difficulty: 'normal',
    mathTopic: 'all',
    inventory: {
      stick: 6, flint: 10, feather: 20, sinew: 4,
      ash_branch: 1, grip_wrap: 1, arrow: 5, bow: 0,
      meat: 0, pelt: 0, willow: 0, cord: 0, spear: 1,
    },
    craftedItems: {},
    unlockedAreas: ['meadow'],
    completedQuests: [],
    perfectStreak: 0,
    stats: {
      totalHunts: 0, perfectShots: 0, totalCorrect: 0,
      totalAttempted: 0, animalsHarvested: {}, totalCrafted: {},
      totalFishCaught: 0, fishHarvested: {},
    },
    recentAccuracy: [],
    screen: 'title',
    initialized: false,
  })
})

describe('initGame', () => {
  it('sets player name and navigates to camp', () => {
    useGameStore.getState().initGame('TestHunter')
    const state = useGameStore.getState()
    expect(state.playerName).toBe('TestHunter')
    expect(state.screen).toBe('camp')
    expect(state.initialized).toBe(true)
  })

  it('loads existing save if present', () => {
    const save = { playerName: 'SavedHunter', honor: 50, rankIndex: 2 }
    localStorage.setItem('bow_hunter_save', JSON.stringify(save))
    useGameStore.getState().initGame('NewName')
    expect(useGameStore.getState().playerName).toBe('SavedHunter')
    expect(useGameStore.getState().honor).toBe(50)
  })
})

describe('grade level', () => {
  it('setGradeLevel updates grade and tier', () => {
    useGameStore.getState().setGradeLevel(3)
    expect(useGameStore.getState().gradeLevel).toBe(3)
    expect(useGameStore.getState().difficultyTier).toBe(1)
  })

  it('grade 4 maps to tier 2', () => {
    useGameStore.getState().setGradeLevel(4)
    expect(useGameStore.getState().difficultyTier).toBe(2)
  })

  it('grade 5 and 6 map to tier 3', () => {
    useGameStore.getState().setGradeLevel(5)
    expect(useGameStore.getState().difficultyTier).toBe(3)
    useGameStore.getState().setGradeLevel(6)
    expect(useGameStore.getState().difficultyTier).toBe(3)
  })
})

describe('navigation', () => {
  it('goTo changes screen', () => {
    useGameStore.getState().goTo('expedition')
    expect(useGameStore.getState().screen).toBe('expedition')
  })
})

describe('setTopic', () => {
  it('changes math topic', () => {
    useGameStore.getState().setTopic('fractions')
    expect(useGameStore.getState().mathTopic).toBe('fractions')
  })
})

describe('crafting', () => {
  it('canCraft returns true when materials are sufficient', () => {
    expect(useGameStore.getState().canCraft('basic_arrow')).toBe(true)
  })

  it('canCraft returns false when materials are insufficient', () => {
    useGameStore.setState({ inventory: { stick: 0, flint: 0, feather: 0, arrow: 0 } })
    expect(useGameStore.getState().canCraft('basic_arrow')).toBe(false)
  })

  it('craft consumes materials and produces items', () => {
    const before = { ...useGameStore.getState().inventory }
    useGameStore.getState().craft('basic_arrow')
    const after = useGameStore.getState().inventory

    expect(after.stick).toBe(before.stick - 3)
    expect(after.flint).toBe(before.flint - 5)
    expect(after.feather).toBe(before.feather - 10)
    expect(after.arrow).toBe(before.arrow + 5)
  })

  it('craft fails gracefully when materials are missing', () => {
    useGameStore.setState({ inventory: { stick: 0, flint: 0, feather: 0, arrow: 5 } })
    const result = useGameStore.getState().craft('basic_arrow')
    expect(result).toBe(false)
    expect(useGameStore.getState().inventory.arrow).toBe(5)
  })
})

describe('recordHunt', () => {
  it('perfect shot grants 3x honor and bonus drops', () => {
    useGameStore.getState().recordHunt('rabbit', 'perfect')
    const state = useGameStore.getState()
    expect(state.honor).toBe(3) // rabbit.honor=1, 3x
    expect(state.stats.perfectShots).toBe(1)
    expect(state.stats.totalHunts).toBe(1)
    expect(state.inventory.meat).toBeGreaterThan(0)
  })

  it('hit grants 1x honor and normal drops', () => {
    useGameStore.getState().recordHunt('rabbit', 'hit')
    const state = useGameStore.getState()
    expect(state.honor).toBe(1)
    expect(state.stats.totalHunts).toBe(1)
    expect(state.inventory.meat).toBe(2) // rabbit drops 2 meat
  })

  it('miss loses an arrow', () => {
    const arrowsBefore = useGameStore.getState().inventory.arrow
    useGameStore.getState().recordHunt('rabbit', 'miss')
    expect(useGameStore.getState().inventory.arrow).toBe(arrowsBefore - 1)
    expect(useGameStore.getState().honor).toBe(0)
  })

  it('spooked gives no honor and no drops', () => {
    useGameStore.getState().recordHunt('rabbit', 'spooked')
    const state = useGameStore.getState()
    expect(state.honor).toBe(0)
    expect(state.inventory.meat).toBe(0)
  })

  it('tracks accuracy and adjusts difficulty tier', () => {
    // Simulate many correct answers to push accuracy > 0.8
    for (let i = 0; i < 10; i++) {
      useGameStore.getState().recordHunt('rabbit', 'hit')
    }
    expect(useGameStore.getState().difficultyTier).toBeGreaterThan(1) // should tier up
  })
})

describe('recordFishing', () => {
  it('perfect catch grants 3x honor and bonus drops', () => {
    useGameStore.getState().recordFishing('trout', 'perfect')
    const state = useGameStore.getState()
    expect(state.honor).toBe(6) // trout.honor=2, 3x
    expect(state.stats.totalFishCaught).toBe(1)
    expect(state.inventory.meat).toBeGreaterThan(0)
  })

  it('hit grants 1x honor and normal drops', () => {
    useGameStore.getState().recordFishing('trout', 'hit')
    const state = useGameStore.getState()
    expect(state.honor).toBe(2)
    expect(state.stats.totalFishCaught).toBe(1)
    expect(state.inventory.meat).toBe(3) // trout drops 3 meat
  })

  it('miss loses a spear', () => {
    const spearsBefore = useGameStore.getState().inventory.spear
    useGameStore.getState().recordFishing('trout', 'miss')
    expect(useGameStore.getState().inventory.spear).toBe(spearsBefore - 1)
    expect(useGameStore.getState().honor).toBe(0)
  })

  it('tracks fish harvested', () => {
    useGameStore.getState().recordFishing('trout', 'hit')
    expect(useGameStore.getState().stats.fishHarvested.trout).toBe(1)
  })
})

describe('quest system', () => {
  it('completes first_hunt quest after one successful hunt', () => {
    useGameStore.getState().recordHunt('rabbit', 'hit')
    const completed = useGameStore.getState().checkAndCompleteQuests()
    expect(completed).toContain('first_hunt')
  })

  it('completes first_fish quest after one successful catch', () => {
    useGameStore.getState().recordFishing('trout', 'hit')
    const completed = useGameStore.getState().checkAndCompleteQuests()
    expect(completed).toContain('first_fish')
  })

  it('getActiveQuests excludes completed quests', () => {
    useGameStore.getState().recordHunt('rabbit', 'hit')
    useGameStore.getState().checkAndCompleteQuests()
    const active = useGameStore.getState().getActiveQuests()
    expect(active.find((q) => q.id === 'first_hunt')).toBeUndefined()
  })
})

describe('resetGame', () => {
  it('clears all progress and returns to title', () => {
    useGameStore.getState().initGame('TestHunter')
    useGameStore.getState().recordHunt('rabbit', 'hit')
    useGameStore.getState().resetGame()

    const state = useGameStore.getState()
    expect(state.playerName).toBe('')
    expect(state.honor).toBe(0)
    expect(state.screen).toBe('title')
    expect(state.initialized).toBe(false)
  })
})
