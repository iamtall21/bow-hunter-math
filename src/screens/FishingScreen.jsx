import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { ANIMALS, AREAS, MATERIALS } from '../data/gameData'
import { generateQuestion, getTimerSeconds, getWrongAnswerFeedback } from '../data/mathTemplates'
import './FishingScreen.css'

// Fish movement — darting with pauses
function getFishPath(time, speed, dartPhase) {
  // Fish dart quickly then pause
  const dartCycle = (time * speed) % 6
  let moveScale
  if (dartCycle < 2) {
    // Darting phase — fast movement
    moveScale = 1.5
  } else if (dartCycle < 3.5) {
    // Hovering/idle — very slow drift
    moveScale = 0.15
  } else {
    // Normal swimming
    moveScale = 0.7
  }

  const x = 50 + Math.sin(time * speed * 0.6 + dartPhase) * 28 * moveScale
    + Math.sin(time * speed * 1.8 + dartPhase * 2) * 8 * moveScale
  const y = 35 + Math.sin(time * speed * 0.4 + dartPhase + 1) * 20 * moveScale
    + Math.cos(time * speed * 1.1 + dartPhase) * 5 * moveScale
  return {
    x: Math.max(8, Math.min(92, x)),
    y: Math.max(12, Math.min(82, y)),
  }
}

export default function FishingScreen() {
  const state = useGameStore()
  const area = AREAS.river

  // Game flow
  const [phase, setPhase] = useState('wading')
  const [currentFish, setCurrentFish] = useState(null)
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [encounterCount, setEncounterCount] = useState(0)
  const [questCompleted, setQuestCompleted] = useState([])

  // Timer
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const timerRef = useRef(null)

  // Aiming system
  const [aimSteadiness, setAimSteadiness] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [fishPos, setFishPos] = useState({ x: 50, y: 40 })
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 })
  const [shotFired, setShotFired] = useState(false)
  const [shotResult, setShotResult] = useState(null)
  const [fishSpeed, setFishSpeed] = useState(0.5)
  const [fishFacing, setFishFacing] = useState('right')
  const [dartPhase] = useState(() => Math.random() * Math.PI * 2)

  // Foraging system
  const [forageItems, setForageItems] = useState([])
  const [forageQuestion, setForageQuestion] = useState(null)
  const [forageAnswer, setForageAnswer] = useState('')
  const [forageResult, setForageResult] = useState(null)
  const forageInputRef = useRef(null)

  const fishingGroundRef = useRef(null)
  const animFrameRef = useRef(null)
  const aimStartTime = useRef(0)
  const inputRef = useRef(null)

  const maxEncounters = 5

  // ---- START ENCOUNTER ----
  const startEncounter = useCallback(() => {
    if (state.inventory.spear <= 0) {
      setPhase('no_spears')
      return
    }

    const fishId = area.animals[Math.floor(Math.random() * area.animals.length)]
    const fish = ANIMALS[fishId]
    setCurrentFish({ id: fishId, ...fish })

    const q = generateQuestion(state.difficultyTier, state.mathTopic)
    setQuestion(q)
    setAnswer('')
    setShowHint(false)
    setShotFired(false)
    setShotResult(null)
    setAimSteadiness(0)

    setFishSpeed(0.4 + fish.difficulty * 0.25 + Math.random() * 0.2)

    const seconds = getTimerSeconds(state.difficulty)
    setTimeLeft(seconds)
    setTotalTime(seconds)
    setPhase('math')
  }, [state.inventory.spear, state.difficultyTier, state.difficulty, state.mathTopic, area.animals])

  // ---- MATH TIMER ----
  useEffect(() => {
    if (phase !== 'math' || !state.timerEnabled) return

    if (inputRef.current) inputRef.current.focus()

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current)
          setAimSteadiness(0.15)
          setPhase('aiming')
          return 0
        }
        return Math.max(prev - 0.1, 0)
      })
    }, 100)

    return () => clearInterval(timerRef.current)
  }, [phase, state.timerEnabled])

  // ---- FISH MOVEMENT (runs during math + aiming) ----
  useEffect(() => {
    if (phase !== 'math' && phase !== 'aiming') {
      cancelAnimationFrame(animFrameRef.current)
      return
    }

    let startTime = null
    let lastX = fishPos.x

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000

      const pos = getFishPath(elapsed, fishSpeed, dartPhase)
      setFishPos(pos)

      if (pos.x > lastX + 0.1) setFishFacing('right')
      else if (pos.x < lastX - 0.1) setFishFacing('left')
      lastX = pos.x

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [phase, fishSpeed, dartPhase])

  // ---- THROW SPEAR ----
  const handleShoot = useCallback(() => {
    if (phase !== 'aiming' || shotFired) return

    setShotFired(true)
    cancelAnimationFrame(animFrameRef.current)

    const dx = crosshairPos.x - fishPos.x
    const dy = crosshairPos.y - fishPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    let outcome
    if (distance < 5) {
      outcome = 'perfect'
    } else if (distance < 10) {
      outcome = 'hit'
    } else if (distance < 16) {
      outcome = 'graze'
    } else {
      outcome = 'miss'
    }

    setShotResult(outcome)

    setTimeout(() => {
      const storeResult = outcome === 'graze' ? 'spooked' : outcome
      state.recordFishing(currentFish.id, storeResult)
      const newlyCompleted = state.checkAndCompleteQuests()
      if (newlyCompleted.length > 0) {
        setQuestCompleted(newlyCompleted)
      }
      setEncounterCount((c) => c + 1)
      setPhase('result')
    }, 1200)
  }, [phase, shotFired, crosshairPos, fishPos, currentFish, state])

  const handleGroundClick = useCallback(() => {
    if (phase === 'aiming' && !shotFired) {
      handleShoot()
    }
  }, [phase, shotFired, handleShoot])

  // ---- CROSSHAIR with sway ----
  useEffect(() => {
    if (phase !== 'aiming' || shotFired) return

    aimStartTime.current = Date.now()

    const updateCrosshair = () => {
      const elapsed = (Date.now() - aimStartTime.current) / 1000
      const sway = (1 - aimSteadiness) * 14 // slightly more sway underwater
      const swayX = Math.sin(elapsed * 3.2) * sway + Math.sin(elapsed * 6.5) * (sway * 0.35)
      const swayY = Math.cos(elapsed * 2.5) * sway + Math.cos(elapsed * 5.0) * (sway * 0.35)

      setCrosshairPos({
        x: Math.max(2, Math.min(98, mousePos.x + swayX)),
        y: Math.max(2, Math.min(98, mousePos.y + swayY)),
      })

      animFrameRef.current = requestAnimationFrame(updateCrosshair)
    }

    animFrameRef.current = requestAnimationFrame(updateCrosshair)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [phase, mousePos, aimSteadiness, shotFired])

  // ---- MOUSE TRACKING ----
  const handleMouseMove = useCallback((e) => {
    if (phase !== 'aiming' || shotFired) return
    const rect = fishingGroundRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({
      x: Math.max(2, Math.min(98, x)),
      y: Math.max(2, Math.min(98, y)),
    })
  }, [phase, shotFired])

  // ---- KEYBOARD CONTROLS ----
  const keysPressed = useRef({})

  useEffect(() => {
    if (phase !== 'aiming' || shotFired) return

    const MOVE_SPEED = 1.2

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }
      keysPressed.current[e.key] = true

      if (e.key === ' ') {
        handleShoot()
      }
    }

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false
    }

    let frameId
    const moveLoop = () => {
      const keys = keysPressed.current
      setMousePos((prev) => {
        let { x, y } = prev
        if (keys['ArrowLeft']) x -= MOVE_SPEED
        if (keys['ArrowRight']) x += MOVE_SPEED
        if (keys['ArrowUp']) y -= MOVE_SPEED
        if (keys['ArrowDown']) y += MOVE_SPEED
        return {
          x: Math.max(2, Math.min(98, x)),
          y: Math.max(2, Math.min(98, y)),
        }
      })
      frameId = requestAnimationFrame(moveLoop)
    }
    frameId = requestAnimationFrame(moveLoop)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      cancelAnimationFrame(frameId)
      keysPressed.current = {}
    }
  }, [phase, shotFired, handleShoot])

  // ---- SUBMIT MATH ANSWER ----
  const handleSubmitAnswer = () => {
    clearInterval(timerRef.current)
    const numAnswer = parseFloat(answer)

    if (isNaN(numAnswer) || Math.abs(numAnswer - question.answer) >= 0.01) {
      setAimSteadiness(0.1)
    } else {
      const timePercent = timeLeft / totalTime
      if (timePercent > 0.6) {
        setAimSteadiness(0.95)
      } else if (timePercent > 0.3) {
        setAimSteadiness(0.7)
      } else {
        setAimSteadiness(0.45)
      }
    }

    setPhase('aiming')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && answer.trim()) {
      handleSubmitAnswer()
    }
  }

  const handleNext = () => {
    setQuestCompleted([])
    if (encounterCount >= maxEncounters) {
      state.goTo('camp')
    } else {
      startForaging()
    }
  }

  // ---- FORAGING ----
  const startForaging = () => {
    const areaMaterials = area.materialsFound
    const count = 2 + Math.floor(Math.random() * 2)
    const items = []
    for (let i = 0; i < count; i++) {
      const matId = areaMaterials[Math.floor(Math.random() * areaMaterials.length)]
      const baseQty = 1 + Math.floor(Math.random() * 3)
      items.push({ id: matId, baseQty, bonusQty: baseQty * 2 })
    }
    setForageItems(items)
    setForageAnswer('')
    setForageResult(null)

    const q = generateQuestion(state.difficultyTier, state.mathTopic)
    setForageQuestion(q)
    setPhase('forage')
  }

  useEffect(() => {
    if (phase === 'forage' && forageInputRef.current) {
      forageInputRef.current.focus()
    }
  }, [phase])

  const handleForageSubmit = () => {
    const numAnswer = parseFloat(forageAnswer)
    const correct = !isNaN(numAnswer) && Math.abs(numAnswer - forageQuestion.answer) < 0.01

    const inv = { ...state.inventory }
    forageItems.forEach((item) => {
      const qty = correct ? item.bonusQty : item.baseQty
      inv[item.id] = (inv[item.id] || 0) + qty
    })

    useGameStore.setState({ inventory: inv })
    state.saveGame()

    setForageResult(correct ? 'bonus' : 'basic')
  }

  const handleForageKeyDown = (e) => {
    if (e.key === 'Enter' && forageAnswer.trim()) {
      handleForageSubmit()
    }
  }

  const handleForageContinue = () => {
    setPhase('wading')
  }

  const handleSkipForage = () => {
    const inv = { ...state.inventory }
    forageItems.forEach((item) => {
      inv[item.id] = (inv[item.id] || 0) + item.baseQty
    })
    useGameStore.setState({ inventory: inv })
    state.saveGame()
    setPhase('wading')
  }

  const timerPercent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100
  const timerColor = timerPercent > 60 ? '#6bc4c4' : timerPercent > 30 ? '#c4c97a' : '#e87a7a'

  const steadinessLabel = aimSteadiness > 0.8 ? 'Steady' :
    aimSteadiness > 0.5 ? 'Slightly Shaky' :
    aimSteadiness > 0.25 ? 'Shaky' : 'Very Shaky'

  const steadinessColor = aimSteadiness > 0.8 ? '#6bc4c4' :
    aimSteadiness > 0.5 ? '#c4c97a' :
    aimSteadiness > 0.25 ? '#c4a07a' : '#e87a7a'

  return (
    <div className="fishing-screen">
      <header className="fishing-header">
        <button className="back-btn" onClick={() => state.goTo('camp')}>
          Back to Camp
        </button>
        <div className="fishing-info">
          <span className="area-name">{area.name}</span>
          <span className="spear-count">Spears: {state.inventory.spear}</span>
          <span className="encounter-progress">
            Catch {Math.min(encounterCount + 1, maxEncounters)}/{maxEncounters}
          </span>
        </div>
      </header>

      <main className="fishing-main">
        {/* WADING */}
        {phase === 'wading' && (
          <div className="phase-wading">
            <div className="water-ground wading-ground">
              <div className="water-surface" />
              <div className="water-rays" />
              <div className="riverbed" />
            </div>
            <div className="scene-text">
              You wade into the shallows, spear raised, eyes searching the murky water...
            </div>
            <button className="scout-btn fish-btn" onClick={startEncounter}>
              Search for Fish
            </button>
          </div>
        )}

        {/* NO SPEARS */}
        {phase === 'no_spears' && (
          <div className="phase-no-arrows">
            <div className="scene-text">
              You reach for your spear... but you don't have one. Head back to camp and craft a fishing spear.
            </div>
            <button className="scout-btn" onClick={() => state.goTo('camp')}>
              Return to Camp
            </button>
          </div>
        )}

        {/* MATH PHASE */}
        {phase === 'math' && currentFish && (
          <div className="phase-math">
            <div className="water-ground">
              <div className="water-surface" />
              <div className="water-rays" />
              <div className="riverbed" />
              <div
                className={`fish-target ${fishFacing}`}
                style={{ left: `${fishPos.x}%`, top: `${fishPos.y}%` }}
              >
                {currentFish.icon}
              </div>
            </div>

            <div className="math-overlay water-math-overlay">
              {state.timerEnabled && (
                <>
                  <div className="timer-bar-container">
                    <div
                      className="timer-bar"
                      style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
                    />
                  </div>
                  <div className="timer-text">{timeLeft.toFixed(1)}s</div>
                </>
              )}

              <div className="challenge-box">
                <div className="challenge-label">Quick — solve this to steady your throw!</div>
                <div className="challenge-question">{question.question}</div>
                <div className="answer-row">
                  <input
                    ref={inputRef}
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Your answer..."
                    className="answer-input"
                    step="any"
                  />
                  <button
                    className="submit-answer-btn"
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim()}
                  >
                    LOCK IN
                  </button>
                </div>
                {!showHint && (
                  <button className="hint-btn" onClick={() => setShowHint(true)}>
                    Need a hint?
                  </button>
                )}
                {showHint && question.hint && (
                  <div className="hint-text">Hint: {question.hint}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AIMING PHASE — underwater spear fishing */}
        {phase === 'aiming' && currentFish && (
          <div className="phase-aiming">
            <div className="aim-hud water-hud">
              <span className="steadiness-label" style={{ color: steadinessColor }}>
                Aim: {steadinessLabel}
              </span>
              <span className="aim-instruction">
                {shotFired ? '' : 'Arrow keys or mouse to aim — SPACE or CLICK to throw!'}
              </span>
            </div>

            <div
              ref={fishingGroundRef}
              className={`water-ground aiming-ground ${shotFired ? 'shot-fired' : ''}`}
              onMouseMove={handleMouseMove}
              onClick={handleGroundClick}
            >
              <div className="water-surface" />
              <div className="water-rays" />
              <div className="riverbed" />
              <div className="water-bubbles" />

              {/* Fish (depth-scaled) */}
              <div
                className={`fish-target ${fishFacing} ${shotFired ? 'fish-hit' : ''} ${shotFired && shotResult === 'miss' ? 'fish-flee' : ''}`}
                style={{
                  left: `${fishPos.x}%`,
                  top: `${fishPos.y}%`,
                  fontSize: `${1.5 + (fishPos.y / 100) * 3}rem`,
                }}
              >
                {currentFish.icon}
                <div className="fish-ripple" style={{
                  width: `${16 + (fishPos.y / 100) * 30}px`,
                  opacity: 0.2 + (fishPos.y / 100) * 0.15,
                }} />
              </div>

              {/* Scope crosshair (blue-tinted) */}
              {!shotFired && (
                <div
                  className="crosshair water-crosshair"
                  style={{
                    left: `${crosshairPos.x}%`,
                    top: `${crosshairPos.y}%`,
                    '--gap': `${Math.round(4 + (1 - aimSteadiness) * 16)}px`,
                  }}
                >
                  <div className="scope-ring" />
                  <div className="crosshair-seg seg-top" />
                  <div className="crosshair-seg seg-bottom" />
                  <div className="crosshair-seg seg-left" />
                  <div className="crosshair-seg seg-right" />
                  <div className="crosshair-dot" />
                </div>
              )}

              {/* Shot impact */}
              {shotFired && (
                <div
                  className="shot-impact"
                  style={{ left: `${crosshairPos.x}%`, top: `${crosshairPos.y}%` }}
                >
                  {shotResult === 'perfect' && '🎯'}
                  {shotResult === 'hit' && '💥'}
                  {shotResult === 'graze' && '💨'}
                  {shotResult === 'miss' && '❌'}
                </div>
              )}

              {/* FPS spear weapon (right side) */}
              <div className={`spear-weapon ${shotFired ? 'spear-thrown' : 'spear-ready'}`}>
                <div className="spear-shaft" />
                <div className="spear-point" />
                <div className="spear-hand" />
              </div>

              {/* Underwater vignette */}
              <div className="vignette-overlay water-vignette" />
            </div>
          </div>
        )}

        {/* FORAGING */}
        {phase === 'forage' && forageQuestion && (
          <div className="phase-forage">
            <div className="forage-scene water-forage">
              <div className="forage-header">
                <span className="forage-icon">🌊</span>
                <span>You spot some useful materials along the riverbank!</span>
              </div>

              <div className="forage-items">
                {forageItems.map((item, i) => {
                  const mat = MATERIALS[item.id]
                  return (
                    <div key={i} className="forage-item">
                      <span className="forage-item-icon">{mat?.icon || '📦'}</span>
                      <span className="forage-item-name">{mat?.name || item.id}</span>
                      <span className="forage-item-qty">
                        {forageResult ? (
                          forageResult === 'bonus' ? `+${item.bonusQty}` : `+${item.baseQty}`
                        ) : (
                          `${item.baseQty} — or ${item.bonusQty} if you solve this!`
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>

              {!forageResult && (
                <div className="forage-challenge">
                  <div className="forage-prompt">Solve this to gather extra materials:</div>
                  <div className="forage-question">{forageQuestion.question}</div>
                  <div className="answer-row">
                    <input
                      ref={forageInputRef}
                      type="number"
                      value={forageAnswer}
                      onChange={(e) => setForageAnswer(e.target.value)}
                      onKeyDown={handleForageKeyDown}
                      placeholder="Your answer..."
                      className="answer-input"
                      step="any"
                    />
                    <button
                      className="submit-answer-btn"
                      onClick={handleForageSubmit}
                      disabled={!forageAnswer.trim()}
                    >
                      GATHER
                    </button>
                  </div>
                  <button className="skip-forage-btn" onClick={handleSkipForage}>
                    Just grab what I can and move on
                  </button>
                </div>
              )}

              {forageResult && (
                <div className={`forage-result ${forageResult}`}>
                  {forageResult === 'bonus' ? (
                    <div className="forage-result-text forage-success">
                      Nice! You found the best spots along the bank — full haul!
                    </div>
                  ) : (
                    <div className="forage-result-text forage-basic">
                      <div>You grabbed what you could find along the bank.</div>
                      <div className="forage-correct">
                        The answer was: <strong>{forageQuestion.answer}</strong>
                        {forageQuestion.hint && <div className="forage-hint">{forageQuestion.hint}</div>}
                      </div>
                    </div>
                  )}
                  <button className="next-btn" onClick={handleForageContinue}>
                    Keep Fishing
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase === 'result' && (
          <div className={`phase-result result-${shotResult}`}>
            <div className="result-icon">
              {shotResult === 'perfect' && '🎯'}
              {shotResult === 'hit' && '🐟'}
              {shotResult === 'graze' && '💨'}
              {shotResult === 'miss' && '❌'}
            </div>
            <div className="result-title">
              {shotResult === 'perfect' && 'PERFECT STRIKE!'}
              {shotResult === 'hit' && 'Caught it!'}
              {shotResult === 'graze' && 'Barely missed!'}
              {shotResult === 'miss' && 'It got away!'}
            </div>
            <div className="result-desc">
              {shotResult === 'perfect' &&
                `Clean strike! The ${currentFish.name} is yours, plus bonus materials. +${currentFish.honor * 3} honor`}
              {shotResult === 'hit' &&
                `Nice throw! You speared the ${currentFish.name}! +${currentFish.honor} honor`}
              {shotResult === 'graze' &&
                `Your spear grazed the ${currentFish.name} and it darted away!`}
              {shotResult === 'miss' &&
                `Your spear plunges into the riverbed. The ${currentFish.name} vanishes downstream.`}
            </div>

            <div className="question-review">
              <div className="review-label">The Question:</div>
              <div className="review-question">{question.question}</div>
              <div className="review-answer">
                Answer: <strong>{question.answer}</strong>
              </div>
              {question.hint && <div className="review-hint">How to solve it: {question.hint}</div>}
            </div>

            <div className="accuracy-feedback">
              {aimSteadiness > 0.8 && 'Your math was spot on — your throw was true and steady.'}
              {aimSteadiness > 0.5 && aimSteadiness <= 0.8 && 'Decent math, but a faster answer would have steadied your arm more.'}
              {aimSteadiness > 0.25 && aimSteadiness <= 0.5 && getWrongAnswerFeedback(question, answer)}
              {aimSteadiness <= 0.25 && getWrongAnswerFeedback(question, answer)}
            </div>

            {questCompleted.length > 0 && (
              <div className="quest-complete-banner">
                Quest Complete! Check your rewards at camp.
              </div>
            )}

            <button className="next-btn" onClick={handleNext}>
              {encounterCount >= maxEncounters ? 'Return to Camp' : 'Next Catch'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
