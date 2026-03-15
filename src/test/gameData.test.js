import { describe, it, expect } from 'vitest'
import { MATERIALS, RECIPES, ANIMALS, AREAS, RANKS, QUESTS, STARTER_INVENTORY } from '../data/gameData'

describe('MATERIALS', () => {
  it('each material has name and icon', () => {
    Object.entries(MATERIALS).forEach(([id, mat]) => {
      expect(mat.name, `${id} missing name`).toBeTruthy()
      expect(mat.icon, `${id} missing icon`).toBeTruthy()
    })
  })
})

describe('RECIPES', () => {
  it('each recipe references valid materials', () => {
    Object.entries(RECIPES).forEach(([recipeId, recipe]) => {
      Object.keys(recipe.materials).forEach((matId) => {
        expect(
          MATERIALS[matId] || STARTER_INVENTORY.hasOwnProperty(matId),
          `Recipe ${recipeId} references unknown material: ${matId}`
        ).toBeTruthy()
      })
    })
  })

  it('each recipe has name, description, materials, and produces', () => {
    Object.entries(RECIPES).forEach(([id, recipe]) => {
      expect(recipe.name, `${id} missing name`).toBeTruthy()
      expect(recipe.description, `${id} missing description`).toBeTruthy()
      expect(Object.keys(recipe.materials).length, `${id} has no materials`).toBeGreaterThan(0)
      expect(Object.keys(recipe.produces).length, `${id} has no produces`).toBeGreaterThan(0)
    })
  })
})

describe('ANIMALS', () => {
  it('each animal has required properties', () => {
    Object.entries(ANIMALS).forEach(([id, animal]) => {
      expect(animal.name, `${id} missing name`).toBeTruthy()
      expect(animal.icon, `${id} missing icon`).toBeTruthy()
      expect(animal.area, `${id} missing area`).toBeTruthy()
      expect(animal.difficulty, `${id} missing difficulty`).toBeGreaterThan(0)
      expect(animal.honor, `${id} missing honor`).toBeGreaterThan(0)
      expect(animal.drops, `${id} missing drops`).toBeTruthy()
    })
  })

  it('each animal references a valid area', () => {
    Object.entries(ANIMALS).forEach(([id, animal]) => {
      expect(AREAS[animal.area], `${id} references unknown area: ${animal.area}`).toBeTruthy()
    })
  })
})

describe('AREAS', () => {
  it('each unlocked area references valid animals', () => {
    Object.entries(AREAS).forEach(([areaId, area]) => {
      if (!area.unlocked) return
      area.animals.forEach((animalId) => {
        expect(ANIMALS[animalId], `Area ${areaId} references unknown animal: ${animalId}`).toBeTruthy()
      })
    })
  })

  it('river area is unlocked', () => {
    expect(AREAS.river.unlocked).toBe(true)
  })

  it('each area references valid materials in materialsFound', () => {
    Object.entries(AREAS).forEach(([areaId, area]) => {
      area.materialsFound.forEach((matId) => {
        expect(MATERIALS[matId], `Area ${areaId} references unknown material: ${matId}`).toBeTruthy()
      })
    })
  })

  it('meadow is unlocked by default', () => {
    expect(AREAS.meadow.unlocked).toBe(true)
  })
})

describe('RANKS', () => {
  it('are sorted by honor requirement ascending', () => {
    for (let i = 1; i < RANKS.length; i++) {
      expect(RANKS[i].honorRequired).toBeGreaterThan(RANKS[i - 1].honorRequired)
    }
  })

  it('first rank requires 0 honor', () => {
    expect(RANKS[0].honorRequired).toBe(0)
  })
})

describe('QUESTS', () => {
  it('each quest has required properties', () => {
    QUESTS.forEach((quest) => {
      expect(quest.id).toBeTruthy()
      expect(quest.title).toBeTruthy()
      expect(quest.description).toBeTruthy()
      expect(quest.goal).toBeTruthy()
      expect(quest.goal.type).toBeTruthy()
      expect(quest.reward).toBeTruthy()
      expect(quest.reward.honor).toBeGreaterThan(0)
    })
  })

  it('all quest IDs are unique', () => {
    const ids = QUESTS.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('STARTER_INVENTORY', () => {
  it('starts with arrows', () => {
    expect(STARTER_INVENTORY.arrow).toBeGreaterThan(0)
  })

  it('starts with a spear', () => {
    expect(STARTER_INVENTORY.spear).toBeGreaterThan(0)
  })

  it('has enough materials to craft basic arrows', () => {
    const recipe = RECIPES.basic_arrow
    Object.entries(recipe.materials).forEach(([mat, qty]) => {
      expect(
        STARTER_INVENTORY[mat] >= qty,
        `Not enough ${mat} to craft arrows: have ${STARTER_INVENTORY[mat]}, need ${qty}`
      ).toBe(true)
    })
  })
})
