import { useGameStore } from '../store/gameStore'
import { RANKS } from '../data/gameData'
import './OverworldHUD.css'

const ZONE_NAMES = {
  camp: 'Camp',
  meadow: 'The Meadow',
  river: 'The River',
  forest: 'The Forest',
}

export default function OverworldHUD({ currentZone }) {
  const arrows = useGameStore(s => s.inventory?.arrow ?? 0)
  const spears = useGameStore(s => s.inventory?.spear ?? 0)
  const honor = useGameStore(s => s.honor)
  const rankIndex = useGameStore(s => s.rankIndex)
  const playerName = useGameStore(s => s.playerName)
  const rank = RANKS[rankIndex]

  return (
    <div className="ow-hud">
      <div className="ow-hud-left">
        <span className="ow-hud-name">{playerName}</span>
        <span className="ow-hud-rank">{rank?.icon} {rank?.name}</span>
      </div>
      <div className="ow-hud-center">
        <span className="ow-hud-zone">{ZONE_NAMES[currentZone] || ''}</span>
      </div>
      <div className="ow-hud-right">
        <span className="ow-hud-item">🏹 {arrows}</span>
        <span className="ow-hud-item">🔱 {spears}</span>
        <span className="ow-hud-honor">⭐ {honor}</span>
      </div>
    </div>
  )
}
