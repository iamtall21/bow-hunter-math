import { useGameStore } from '../store/gameStore'
import { RANKS, MATERIALS } from '../data/gameData'
import './CampScreen.css'

export default function CampScreen() {
  const state = useGameStore()
  const rank = RANKS[state.rankIndex]
  const nextRank = RANKS[state.rankIndex + 1]
  const activeQuests = state.getActiveQuests()
  const completedQuests = state.getCompletedQuests()

  const inventoryItems = Object.entries(state.inventory).filter(
    ([, qty]) => qty > 0
  )

  return (
    <div className="camp-screen">
      <header className="camp-header">
        <div className="player-info">
          <h1>{state.playerName}'s Camp</h1>
          <div className="rank-badge">
            <span className="rank-icon">{rank.icon}</span>
            <span className="rank-name">{rank.name}</span>
          </div>
        </div>
        <div className="honor-display">
          <span className="honor-count">{state.honor} Honor</span>
          {nextRank && (
            <span className="next-rank">
              Next: {nextRank.name} at {nextRank.honorRequired}
            </span>
          )}
        </div>
      </header>

      <div className="camp-grid">
        <button className="camp-action hunt-action" onClick={() => state.goTo('expedition')}>
          <span className="action-icon">🏹</span>
          <span className="action-label">Go Hunting</span>
          <span className="action-desc">Head to The Meadow</span>
          {state.inventory.arrow > 0 && (
            <span className="action-note">{state.inventory.arrow} arrows ready</span>
          )}
          {state.inventory.arrow === 0 && (
            <span className="action-warn">No arrows! Craft some first.</span>
          )}
        </button>

        <button className="camp-action craft-action" onClick={() => state.goTo('crafting')}>
          <span className="action-icon">🔨</span>
          <span className="action-label">Crafting Bench</span>
          <span className="action-desc">Build gear and weapons</span>
        </button>

        <div className="camp-panel inventory-panel">
          <h3>Inventory</h3>
          <div className="inventory-grid">
            {inventoryItems.map(([id, qty]) => {
              const mat = MATERIALS[id]
              return (
                <div key={id} className="inv-item">
                  <span className="inv-icon">{mat?.icon || '📦'}</span>
                  <span className="inv-name">{mat?.name || id}</span>
                  <span className="inv-qty">x{qty}</span>
                </div>
              )
            })}
            {inventoryItems.length === 0 && (
              <p className="empty-msg">Nothing here yet. Go hunting!</p>
            )}
          </div>
        </div>

        <div className="camp-panel quest-panel">
          <h3>Quests</h3>
          {activeQuests.length === 0 && completedQuests.length > 0 && (
            <p className="empty-msg">All quests completed! You are a true hunter.</p>
          )}
          {activeQuests.map((quest) => (
            <div key={quest.id} className="quest-item">
              <div className="quest-title">{quest.title}</div>
              <div className="quest-desc">{quest.description}</div>
              <div className="quest-reward">
                Reward: +{quest.reward.honor} honor
                {quest.reward.materials && (
                  <> + materials</>
                )}
              </div>
            </div>
          ))}
          {completedQuests.length > 0 && (
            <div className="completed-count">
              {completedQuests.length} quest{completedQuests.length !== 1 ? 's' : ''} completed
            </div>
          )}
        </div>

        <div className="camp-panel stats-panel">
          <h3>Hunter Stats</h3>
          <div className="stat-row">
            <span>Successful Hunts</span>
            <span>{state.stats.totalHunts}</span>
          </div>
          <div className="stat-row">
            <span>Perfect Shots</span>
            <span>{state.stats.perfectShots}</span>
          </div>
          <div className="stat-row">
            <span>Accuracy</span>
            <span>
              {state.stats.totalAttempted > 0
                ? Math.round((state.stats.totalCorrect / state.stats.totalAttempted) * 100)
                : 0}%
            </span>
          </div>
          <div className="stat-row">
            <span>Math Difficulty</span>
            <span>Tier {state.difficultyTier}</span>
          </div>
        </div>
      </div>

      <button className="reset-btn" onClick={() => { if (confirm('Start over? This erases all progress.')) state.resetGame() }}>
        Reset Game
      </button>
    </div>
  )
}
