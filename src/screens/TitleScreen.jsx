import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import './TitleScreen.css'

export default function TitleScreen() {
  const [name, setName] = useState('')
  const initGame = useGameStore((s) => s.initGame)
  const loadExistingSave = useGameStore((s) => s.loadExistingSave)
  const hasSave = useGameStore((s) => s.hasSave)

  const handleStart = () => {
    if (name.trim()) {
      initGame(name.trim())
    }
  }

  const handleContinue = () => {
    loadExistingSave()
  }

  return (
    <div className="title-screen">
      <div className="title-content">
        <div className="title-icon">🏹</div>
        <h1>Bow Hunter</h1>
        <h2>Trail of the Arrow</h2>
        <p className="title-tagline">Hunt. Craft. Think fast.</p>

        {hasSave() && (
          <button className="continue-btn" onClick={handleContinue}>
            Continue Journey
          </button>
        )}

        <div className="new-game">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="Enter your hunter name..."
            maxLength={20}
            className="name-input"
          />
          <button
            className="start-btn"
            onClick={handleStart}
            disabled={!name.trim()}
          >
            New Journey
          </button>
        </div>
      </div>
    </div>
  )
}
