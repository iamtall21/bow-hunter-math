import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { RECIPES, MATERIALS } from '../data/gameData'
import './CraftingScreen.css'

export default function CraftingScreen() {
  const state = useGameStore()
  const [craftedMessage, setCraftedMessage] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [craftQty, setCraftQty] = useState(1)

  const recipes = Object.entries(RECIPES).filter(([, r]) => r.unlocked)

  const handleCraft = (recipeId) => {
    const success = state.craft(recipeId)
    if (success) {
      setCraftedMessage(`Crafted ${RECIPES[recipeId].name}!`)
      // Check quests after crafting
      state.checkAndCompleteQuests()
      setTimeout(() => setCraftedMessage(''), 2000)
    }
  }

  const getMaxCraftable = (recipeId) => {
    const recipe = RECIPES[recipeId]
    let max = Infinity
    Object.entries(recipe.materials).forEach(([mat, qty]) => {
      const have = state.inventory[mat] || 0
      max = Math.min(max, Math.floor(have / qty))
    })
    return max === Infinity ? 0 : max
  }

  return (
    <div className="crafting-screen">
      <header className="crafting-header">
        <button className="back-btn" onClick={() => state.goTo('camp')}>
          Back to Camp
        </button>
        <h1>Crafting Bench</h1>
      </header>

      {craftedMessage && (
        <div className="crafted-banner">{craftedMessage}</div>
      )}

      <div className="crafting-layout">
        <div className="recipe-list">
          {recipes.map(([id, recipe]) => {
            const canCraft = state.canCraft(id)
            const maxQty = getMaxCraftable(id)

            return (
              <div
                key={id}
                className={`recipe-card ${canCraft ? 'craftable' : 'locked'} ${selectedRecipe === id ? 'selected' : ''}`}
                onClick={() => setSelectedRecipe(id)}
              >
                <div className="recipe-name">{recipe.name}</div>
                <div className="recipe-desc">{recipe.description}</div>

                <div className="recipe-materials">
                  <div className="recipe-label">Materials needed:</div>
                  {Object.entries(recipe.materials).map(([mat, qty]) => {
                    const have = state.inventory[mat] || 0
                    const enough = have >= qty
                    const matInfo = MATERIALS[mat]
                    return (
                      <div key={mat} className={`material-req ${enough ? 'have' : 'need'}`}>
                        <span>{matInfo?.icon || '📦'} {matInfo?.name || mat}</span>
                        <span className="material-count">
                          {have}/{qty}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="recipe-produces">
                  Produces: {Object.entries(recipe.produces).map(([item, qty]) =>
                    `${qty}x ${item}`
                  ).join(', ')}
                </div>

                {canCraft && (
                  <div className="craft-controls">
                    <span className="can-craft-note">Can craft up to {maxQty}x</span>
                    <button
                      className="craft-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCraft(id)
                      }}
                    >
                      Craft 1
                    </button>
                  </div>
                )}

                {!canCraft && (
                  <div className="not-enough">Not enough materials</div>
                )}
              </div>
            )
          })}
        </div>

        <div className="current-materials">
          <h3>Your Materials</h3>
          {Object.entries(state.inventory)
            .filter(([id]) => MATERIALS[id])
            .map(([id, qty]) => {
              const mat = MATERIALS[id]
              return (
                <div key={id} className="mat-row">
                  <span>{mat.icon} {mat.name}</span>
                  <span className="mat-qty">x{qty}</span>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
