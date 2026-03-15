import { useState, useRef, useEffect, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { ANIMALS } from '../data/gameData'
import { ANIMAL_SPRITES } from './sprites.js'
import { drawSprite } from './SpriteRenderer.js'
import { generateQuestion, getTimerSeconds, getWrongAnswerFeedback } from '../data/mathTemplates'
import './MathEncounterOverlay.css'

const PARTICLE_COUNT = 12

function renderAnimalToCanvas(canvas, speciesId) {
  const spriteData = ANIMAL_SPRITES[speciesId]
  if (!spriteData || !canvas) return
  const frame = spriteData.frames[0]
  const size = spriteData.size || 12
  const scale = Math.floor(Math.min(160, 200) / size)
  canvas.width = size * scale
  canvas.height = size * scale
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  drawSprite(ctx, frame, 0, 0, scale)
}

export default function MathEncounterOverlay({ animal, distance, onComplete }) {
  const state = useGameStore()
  const animalData = ANIMALS[animal.speciesId]
  const [question] = useState(() => generateQuestion(state.difficultyTier, state.mathTopic))
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [huntOutcome, setHuntOutcome] = useState(null)
  const [shaking, setShaking] = useState(false)
  const [particles, setParticles] = useState([])
  const inputRef = useRef(null)
  const timerRef = useRef(null)
  const animalCanvasRef = useRef(null)

  const totalSeconds = getTimerSeconds(state.difficulty)
  const [timeLeft, setTimeLeft] = useState(totalSeconds)

  const isRiver = animalData?.area === 'river'
  const ammoType = isRiver ? 'spear' : 'arrow'
  const ammoCount = state.inventory[ammoType] || 0
  const ammoIcon = isRiver ? '🔱' : '🏹'

  // Render pixel art animal to canvas
  useEffect(() => {
    renderAnimalToCanvas(animalCanvasRef.current, animal.speciesId)
  }, [animal.speciesId])

  // Focus input
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200)
  }, [])

  // Timer
  useEffect(() => {
    if (result || !state.timerEnabled) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleResult(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [result, state.timerEnabled])

  // Spawn impact particles
  const spawnParticles = useCallback((color) => {
    const newParticles = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.5
      const speed = 40 + Math.random() * 80
      const dx = Math.cos(angle) * speed
      const dy = Math.sin(angle) * speed
      newParticles.push({
        id: i,
        dx, dy, color,
        size: 3 + Math.random() * 4,
      })
    }
    setParticles(newParticles)
  }, [])

  const handleResult = useCallback((correct) => {
    clearInterval(timerRef.current)

    let outcome
    if (correct) {
      setResult('correct')
      outcome = distance <= 20 ? 'perfect' : 'hit'
      if (state.inventory[ammoType] > 0) {
        state.forage({ [ammoType]: -1 })
      }
      spawnParticles(outcome === 'perfect' ? '#ffd700' : '#66ff66')
    } else {
      setResult(timeLeft <= 0 ? 'timeout' : 'wrong')
      outcome = 'miss'
      if (state.inventory[ammoType] > 0) {
        state.forage({ [ammoType]: -1 })
      }
      spawnParticles('#ff4444')
    }

    // Screen shake
    setShaking(true)
    setTimeout(() => setShaking(false), 350)

    // Record the hunt/fish
    if (isRiver) {
      state.recordFishing(animal.speciesId, outcome)
    } else {
      state.recordHunt(animal.speciesId, outcome)
    }
    state.checkAndCompleteQuests()
    setHuntOutcome(outcome)
  }, [distance, ammoType, isRiver, animal.speciesId, state, spawnParticles, timeLeft])

  const submit = () => {
    if (result) return
    const num = parseFloat(answer)
    const correct = !isNaN(num) && Math.abs(num - question.answer) < 0.01
    handleResult(correct)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submit()
  }

  const dismiss = () => {
    onComplete(huntOutcome)
  }

  const timerPercent = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0
  const timerColor = timerPercent > 50 ? '#66ff66' : timerPercent > 25 ? '#ffaa00' : '#ff4444'
  const distLabel = distance <= 20 ? 'POINT BLANK' : distance <= 35 ? 'CLOSE RANGE' : 'MID RANGE'

  return (
    <div className={`encounter-overlay ${shaking ? 'screen-shake' : ''}`}>
      {/* Background scene */}
      <div className="encounter-bg" />
      <div className="encounter-trees" />
      <div className="encounter-ground" />

      {/* Pixel art animal rendered large */}
      <canvas
        ref={animalCanvasRef}
        className="encounter-animal-canvas"
      />

      {/* Scope / crosshair */}
      <div className="encounter-scope">
        <div className="scope-vignette" />
        {!result && (
          <div className="crosshair">
            <div className="crosshair-h" />
            <div className="crosshair-v" />
            <div className="crosshair-dot" />
            <div className="crosshair-bracket tl" />
            <div className="crosshair-bracket tr" />
            <div className="crosshair-bracket bl" />
            <div className="crosshair-bracket br" />
          </div>
        )}
      </div>

      {/* HUD */}
      <div className="encounter-hud">
        {/* Target name */}
        <div className="encounter-target-name">
          {animalData?.name || animal.speciesId}
        </div>
        <div className="encounter-distance">{distLabel}</div>

        {/* Timer bar */}
        {!result && state.timerEnabled && (
          <div className="encounter-timer-bar">
            <div
              className="encounter-timer-fill"
              style={{ width: `${timerPercent}%`, background: timerColor, color: timerColor }}
            />
          </div>
        )}

        {/* Ammo counter */}
        <div className="encounter-ammo">
          <div className="encounter-ammo-count">{ammoCount}</div>
          <div>{ammoIcon} {ammoType}s</div>
        </div>
      </div>

      {/* Impact particles */}
      {particles.length > 0 && (
        <div className="impact-particles">
          {particles.map(p => (
            <div
              key={p.id}
              className="particle"
              style={{
                background: p.color,
                width: p.size,
                height: p.size,
                boxShadow: `0 0 6px ${p.color}`,
                animationName: 'particle-fly',
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
                transform: `translate(${p.dx}px, ${p.dy}px)`,
                animationDelay: `${Math.random() * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Math challenge or result */}
      {!result ? (
        <div className="encounter-challenge">
          <div className="challenge-question">{question.question}</div>
          <div className="challenge-input-row">
            <input
              ref={inputRef}
              type="number"
              step="any"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              className="challenge-input"
              placeholder="?"
              autoComplete="off"
            />
            <button className="challenge-fire-btn" onClick={submit}>
              FIRE
            </button>
          </div>
          {question.hint && (
            <div className="challenge-hint">{question.hint}</div>
          )}
        </div>
      ) : (
        <div className="encounter-result-overlay">
          <div className={`result-flash ${huntOutcome}`} />

          {huntOutcome === 'perfect' && (
            <>
              <div className="result-big-text perfect">PERFECT KILL</div>
              <div className="result-subtitle">Critical hit - bonus loot!</div>
            </>
          )}
          {huntOutcome === 'hit' && (
            <>
              <div className="result-big-text hit">TARGET DOWN</div>
              <div className="result-subtitle">Clean shot.</div>
            </>
          )}
          {huntOutcome === 'miss' && (
            <>
              <div className="result-big-text miss">
                {result === 'timeout' ? 'TOO SLOW' : 'MISSED'}
              </div>
              <div className="result-subtitle">
                {result === 'timeout' ? 'The target escaped.' : 'Your shot went wide.'}
              </div>
            </>
          )}

          {result !== 'correct' && (
            <>
              <div className="result-answer-reveal" style={{ marginBottom: '0.3rem' }}>
                CORRECT ANSWER: {question.answer}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#c4a882', maxWidth: '400px', lineHeight: 1.5, textAlign: 'center' }}>
                {getWrongAnswerFeedback(question, answer)}
              </div>
            </>
          )}

          {huntOutcome !== 'miss' && animalData && (
            <div className="result-loot">
              +{animalData.honor} HONOR
              {animalData.drops && Object.entries(animalData.drops).map(([item, qty]) => (
                <span key={item}> | +{qty} {item}</span>
              ))}
            </div>
          )}

          <button className="result-continue" onClick={dismiss}>
            [ CONTINUE ]
          </button>
        </div>
      )}
    </div>
  )
}
