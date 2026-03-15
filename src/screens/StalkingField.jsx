import { useStalkingGame } from '../hooks/useStalkingGame'
import './StalkingField.css'

// Fixed tree/bush positions for visual variety
const ENVIRONMENT = [
  { emoji: '🌲', x: 8, y: 15, size: '2rem' },
  { emoji: '🌳', x: 22, y: 35, size: '2.2rem' },
  { emoji: '🌲', x: 75, y: 20, size: '1.8rem' },
  { emoji: '🪨', x: 45, y: 50, size: '1.4rem' },
  { emoji: '🌿', x: 60, y: 65, size: '1.3rem' },
  { emoji: '🌲', x: 88, y: 40, size: '2rem' },
  { emoji: '🌳', x: 35, y: 12, size: '1.9rem' },
  { emoji: '🌿', x: 15, y: 70, size: '1.2rem' },
]

export default function StalkingField({ animal, stalkTime, onComplete }) {
  const {
    hunterPos,
    animalPos,
    animalState,
    stalkTimeLeft,
    shotFired,
    shotResult,
    isMoving,
    hunterFacing,
    arrowPos,
    awarenessRadius,
    shoot,
  } = useStalkingGame({
    stalkDuration: stalkTime,
    onComplete,
  })

  const timerPercent = stalkTime > 0 ? (stalkTimeLeft / stalkTime) * 100 : 0
  const timerColor = timerPercent > 60 ? '#8bc48b' : timerPercent > 30 ? '#e8c97a' : '#e87a7a'

  return (
    <div className="stalking-phase">
      {/* HUD */}
      <div className="stalk-hud">
        <div className="stalk-timer-bar-container">
          <div
            className="stalk-timer-bar"
            style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
          />
        </div>
        <div className="stalk-hud-row">
          <span className="stalk-time" style={{ color: timerColor }}>
            {stalkTimeLeft.toFixed(1)}s
          </span>
          <span className="stalk-instruction">
            {shotFired
              ? ''
              : 'WASD or Arrow keys to move — SPACE to shoot!'
            }
          </span>
          <span className="stalk-animal-name">{animal.icon} {animal.name}</span>
        </div>
      </div>

      {/* Field */}
      <div className="stalking-field">
        {/* Grass texture */}
        <div className="stalking-ground" />

        {/* Environment objects */}
        {ENVIRONMENT.map((obj, i) => (
          <div
            key={i}
            className="stalking-env-obj"
            style={{ left: `${obj.x}%`, top: `${obj.y}%`, fontSize: obj.size }}
          >
            {obj.emoji}
          </div>
        ))}

        {/* Animal with awareness ring */}
        <div
          className={`stalking-animal ${animalState}`}
          style={{ left: `${animalPos.x}%`, top: `${animalPos.y}%` }}
        >
          {/* Awareness radius ring */}
          <div
            className={`awareness-ring ${animalState}`}
            style={{
              width: `${awarenessRadius * 2}%`,
              paddingBottom: `${awarenessRadius * 2}%`,
            }}
          />
          <span className="stalking-animal-icon">{animal.icon}</span>
          {animalState === 'alert' && (
            <div className="stalking-alert-indicator">!</div>
          )}
        </div>

        {/* Hunter */}
        <div
          className={`stalking-hunter facing-${hunterFacing} ${isMoving ? 'walking' : 'idle'}`}
          style={{ left: `${hunterPos.x}%`, top: `${hunterPos.y}%` }}
        >
          🏹
        </div>

        {/* Arrow flight animation */}
        {arrowPos && (
          <div
            className="stalking-arrow"
            style={{
              '--from-x': `${arrowPos.fromX}%`,
              '--from-y': `${arrowPos.fromY}%`,
              '--to-x': `${arrowPos.toX}%`,
              '--to-y': `${arrowPos.toY}%`,
            }}
          />
        )}

        {/* Shot result indicator */}
        {shotResult && (
          <div
            className="stalking-shot-result"
            style={{ left: `${animalPos.x}%`, top: `${animalPos.y}%` }}
          >
            {shotResult === 'perfect' && '🎯'}
            {shotResult === 'hit' && '💥'}
            {shotResult === 'miss' && '❌'}
          </div>
        )}

        {/* Shoot button for mobile/click */}
        {!shotFired && (
          <button className="shoot-btn" onClick={shoot}>
            🏹 SHOOT
          </button>
        )}
      </div>
    </div>
  )
}
