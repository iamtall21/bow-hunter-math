import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { ANIMALS, AREAS, MATERIALS } from '../data/gameData'
import { generateQuestion, getTimerSeconds } from '../data/mathTemplates'
import './ExpeditionScreen.css'

// Animal movement patterns
function getAnimalPath(time, speed) {
  // Animals wander in a natural-looking pattern using combined sine waves
  const x = 35 + Math.sin(time * speed * 0.7) * 25 + Math.sin(time * speed * 1.3) * 8
  const y = 30 + Math.sin(time * speed * 0.5 + 1) * 18 + Math.cos(time * speed * 0.9) * 6
  return { x, y } // percentages of the hunting ground
}

export default function ExpeditionScreen() {
  const state = useGameStore()
  const area = AREAS.meadow

  // Game flow
  const [phase, setPhase] = useState('scouting')
  const [currentAnimal, setCurrentAnimal] = useState(null)
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
  const [aimSteadiness, setAimSteadiness] = useState(0) // 0 = shaky, 1 = rock steady
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [animalPos, setAnimalPos] = useState({ x: 50, y: 40 })
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 })
  const [shotFired, setShotFired] = useState(false)
  const [shotResult, setShotResult] = useState(null)
  const [aimTime, setAimTime] = useState(0)
  const [animalSpeed, setAnimalSpeed] = useState(0.5)
  const [animalFacing, setAnimalFacing] = useState('right')

  // Foraging system
  const [forageItems, setForageItems] = useState([])
  const [forageQuestion, setForageQuestion] = useState(null)
  const [forageAnswer, setForageAnswer] = useState('')
  const [forageResult, setForageResult] = useState(null)
  const forageInputRef = useRef(null)

  const huntingGroundRef = useRef(null)
  const animFrameRef = useRef(null)
  const aimStartTime = useRef(0)
  const inputRef = useRef(null)

  const maxEncounters = 5

  // ---- START ENCOUNTER ----
  const startEncounter = useCallback(() => {
    if (state.inventory.arrow <= 0) {
      setPhase('no_arrows')
      return
    }

    const animalId = area.animals[Math.floor(Math.random() * area.animals.length)]
    const animal = ANIMALS[animalId]
    setCurrentAnimal({ id: animalId, ...animal })

    const q = generateQuestion(state.difficultyTier, state.mathTopic)
    setQuestion(q)
    setAnswer('')
    setShowHint(false)
    setShotFired(false)
    setShotResult(null)
    setAimSteadiness(0)

    // Animal speed varies by difficulty
    setAnimalSpeed(0.3 + animal.difficulty * 0.2 + Math.random() * 0.2)

    const seconds = getTimerSeconds(state.difficulty)
    setTimeLeft(seconds)
    setTotalTime(seconds)
    setPhase('math')
  }, [state.inventory.arrow, state.difficultyTier, state.difficulty, state.mathTopic, area.animals])

  // ---- MATH TIMER ----
  useEffect(() => {
    if (phase !== 'math') return

    if (inputRef.current) inputRef.current.focus()

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current)
          // Time's up — shaky aim
          setAimSteadiness(0.15)
          setPhase('aiming')
          return 0
        }
        return Math.max(prev - 0.1, 0)
      })
    }, 100)

    return () => clearInterval(timerRef.current)
  }, [phase])

  // ---- ANIMAL MOVEMENT (runs during math + aiming) ----
  useEffect(() => {
    if (phase !== 'math' && phase !== 'aiming') {
      cancelAnimationFrame(animFrameRef.current)
      return
    }

    let startTime = null
    let lastX = animalPos.x

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000

      const pos = getAnimalPath(elapsed, animalSpeed)
      setAnimalPos(pos)

      // Track facing direction
      if (pos.x > lastX + 0.1) setAnimalFacing('right')
      else if (pos.x < lastX - 0.1) setAnimalFacing('left')
      lastX = pos.x

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [phase, animalSpeed])

  // ---- CROSSHAIR with sway (during aiming) ----
  useEffect(() => {
    if (phase !== 'aiming' || shotFired) return

    aimStartTime.current = Date.now()

    const updateCrosshair = () => {
      const elapsed = (Date.now() - aimStartTime.current) / 1000
      // Sway amount inversely proportional to steadiness
      const sway = (1 - aimSteadiness) * 12
      const swayX = Math.sin(elapsed * 3.5) * sway + Math.sin(elapsed * 7) * (sway * 0.3)
      const swayY = Math.cos(elapsed * 2.8) * sway + Math.cos(elapsed * 5.5) * (sway * 0.3)

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
    const rect = huntingGroundRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({
      x: Math.max(2, Math.min(98, x)),
      y: Math.max(2, Math.min(98, y)),
    })
  }, [phase, shotFired])

  // ---- KEYBOARD CONTROLS (arrow keys + spacebar) ----
  const keysPressed = useRef({})

  useEffect(() => {
    if (phase !== 'aiming' || shotFired) return

    const MOVE_SPEED = 1.2 // % per frame

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

    // Continuous movement via animation frame
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
      // Wrong — very shaky aim
      setAimSteadiness(0.1)
    } else {
      // Correct! Steadiness based on speed
      const timePercent = timeLeft / totalTime
      if (timePercent > 0.6) {
        setAimSteadiness(0.95) // Rock steady
      } else if (timePercent > 0.3) {
        setAimSteadiness(0.7) // Pretty steady
      } else {
        setAimSteadiness(0.45) // A bit shaky
      }
    }

    setPhase('aiming')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && answer.trim()) {
      handleSubmitAnswer()
    }
  }

  // ---- SHOOT ----
  const handleShoot = useCallback(() => {
    if (phase !== 'aiming' || shotFired) return

    setShotFired(true)
    cancelAnimationFrame(animFrameRef.current)

    // Calculate distance from crosshair to animal center
    const dx = crosshairPos.x - animalPos.x
    const dy = crosshairPos.y - animalPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Hit thresholds (in % of hunting ground)
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

    // Record after a brief delay for the shot animation
    setTimeout(() => {
      // Map graze to spooked for the game store
      const storeResult = outcome === 'graze' ? 'spooked' : outcome
      state.recordHunt(currentAnimal.id, storeResult)
      const newlyCompleted = state.checkAndCompleteQuests()
      if (newlyCompleted.length > 0) {
        setQuestCompleted(newlyCompleted)
      }
      setEncounterCount((c) => c + 1)
      setPhase('result')
    }, 1200)
  }, [phase, shotFired, crosshairPos, animalPos, currentAnimal, state])

  // Click to shoot during aiming
  const handleGroundClick = useCallback(() => {
    if (phase === 'aiming' && !shotFired) {
      handleShoot()
    }
  }, [phase, shotFired, handleShoot])

  const handleNext = () => {
    setQuestCompleted([])
    if (encounterCount >= maxEncounters) {
      state.goTo('camp')
    } else {
      // Start foraging phase between hunts
      startForaging()
    }
  }

  // ---- FORAGING ----
  const startForaging = () => {
    const areaMaterials = area.materialsFound
    // Pick 2-3 random materials spotted on the trail
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

    // Generate a simpler/quicker foraging math question
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

    // Add materials to inventory
    const inv = { ...state.inventory }
    forageItems.forEach((item) => {
      const qty = correct ? item.bonusQty : item.baseQty
      inv[item.id] = (inv[item.id] || 0) + qty
    })

    // Directly update inventory via the store
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
    setPhase('scouting')
  }

  const handleSkipForage = () => {
    // Collect base amounts without answering
    const inv = { ...state.inventory }
    forageItems.forEach((item) => {
      inv[item.id] = (inv[item.id] || 0) + item.baseQty
    })
    useGameStore.setState({ inventory: inv })
    state.saveGame()
    setPhase('scouting')
  }

  const timerPercent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100
  const timerColor = timerPercent > 60 ? '#8bc48b' : timerPercent > 30 ? '#e8c97a' : '#e87a7a'

  const steadinessLabel = aimSteadiness > 0.8 ? 'Steady' :
    aimSteadiness > 0.5 ? 'Slightly Shaky' :
    aimSteadiness > 0.25 ? 'Shaky' : 'Very Shaky'

  const steadinessColor = aimSteadiness > 0.8 ? '#8bc48b' :
    aimSteadiness > 0.5 ? '#e8c97a' :
    aimSteadiness > 0.25 ? '#e8a07a' : '#e87a7a'

  return (
    <div className="expedition-screen">
      <header className="expedition-header">
        <button className="back-btn" onClick={() => state.goTo('camp')}>
          Back to Camp
        </button>
        <div className="expedition-info">
          <span className="area-name">{area.name}</span>
          <span className="arrow-count">Arrows: {state.inventory.arrow}</span>
          <span className="encounter-progress">
            Hunt {Math.min(encounterCount + 1, maxEncounters)}/{maxEncounters}
          </span>
        </div>
      </header>

      <main className="expedition-main">
        {/* SCOUTING */}
        {phase === 'scouting' && (
          <div className="phase-scouting">
            <div className="hunting-ground scouting-ground">
              <div className="ground-trees" />
              <div className="ground-grass" />
            </div>
            <div className="scene-text">
              You creep through the tall grass, eyes scanning for movement...
            </div>
            <button className="scout-btn" onClick={startEncounter}>
              Keep Tracking
            </button>
          </div>
        )}

        {/* NO ARROWS */}
        {phase === 'no_arrows' && (
          <div className="phase-no-arrows">
            <div className="scene-text">
              You reach for your quiver... it's empty. Head back to camp and craft more arrows.
            </div>
            <button className="scout-btn" onClick={() => state.goTo('camp')}>
              Return to Camp
            </button>
          </div>
        )}

        {/* MATH PHASE — answer before you aim */}
        {phase === 'math' && currentAnimal && (
          <div className="phase-math">
            <div className="hunting-ground">
              <div className="ground-trees" />
              <div className="ground-grass" />
              <div
                className={`animal-target ${animalFacing}`}
                style={{ left: `${animalPos.x}%`, top: `${animalPos.y}%` }}
              >
                {currentAnimal.icon}
              </div>
            </div>

            <div className="math-overlay">
              <div className="timer-bar-container">
                <div
                  className="timer-bar"
                  style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
                />
              </div>
              <div className="timer-text">{timeLeft.toFixed(1)}s</div>

              <div className="challenge-box">
                <div className="challenge-label">Quick — solve this to steady your aim!</div>
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

        {/* AIMING PHASE — first person view, click to shoot */}
        {phase === 'aiming' && currentAnimal && (
          <div className="phase-aiming">
            <div className="aim-hud">
              <span className="steadiness-label" style={{ color: steadinessColor }}>
                Aim: {steadinessLabel}
              </span>
              <span className="aim-instruction">
                {shotFired ? '' : 'Arrow keys or mouse to aim — SPACE or CLICK to shoot!'}
              </span>
            </div>

            <div
              ref={huntingGroundRef}
              className={`hunting-ground aiming-ground ${shotFired ? 'shot-fired' : ''}`}
              onMouseMove={handleMouseMove}
              onClick={handleGroundClick}
            >
              <div className="ground-trees" />
              <div className="ground-grass" />

              {/* Animal */}
              <div
                className={`animal-target ${animalFacing} ${shotFired ? 'animal-shot' : ''} ${shotFired && shotResult === 'miss' ? 'animal-flee' : ''}`}
                style={{ left: `${animalPos.x}%`, top: `${animalPos.y}%` }}
              >
                {currentAnimal.icon}
              </div>

              {/* Crosshair */}
              {!shotFired && (
                <div
                  className="crosshair"
                  style={{ left: `${crosshairPos.x}%`, top: `${crosshairPos.y}%` }}
                >
                  <div className="crosshair-line crosshair-h" />
                  <div className="crosshair-line crosshair-v" />
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

              {/* Bow frame at bottom */}
              <div className="bow-frame">
                <div className="bow-string" />
                <div className="bow-limb bow-limb-left" />
                <div className="bow-limb bow-limb-right" />
                {!shotFired && <div className="arrow-nocked" />}
              </div>
            </div>
          </div>
        )}

        {/* FORAGING */}
        {phase === 'forage' && forageQuestion && (
          <div className="phase-forage">
            <div className="forage-scene">
              <div className="forage-header">
                <span className="forage-icon">🌿</span>
                <span>You spot some useful materials on the trail!</span>
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
                      Nice! You knew exactly where to look — gathered the full haul!
                    </div>
                  ) : (
                    <div className="forage-result-text forage-basic">
                      <div>You grabbed what you could find.</div>
                      <div className="forage-correct">
                        The answer was: <strong>{forageQuestion.answer}</strong>
                        {forageQuestion.hint && <div className="forage-hint">{forageQuestion.hint}</div>}
                      </div>
                    </div>
                  )}
                  <button className="next-btn" onClick={handleForageContinue}>
                    Keep Moving
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
              {shotResult === 'hit' && '✅'}
              {shotResult === 'graze' && '💨'}
              {shotResult === 'miss' && '❌'}
            </div>
            <div className="result-title">
              {shotResult === 'perfect' && 'PERFECT SHOT!'}
              {shotResult === 'hit' && 'Hit!'}
              {shotResult === 'graze' && 'Grazed!'}
              {shotResult === 'miss' && 'Miss!'}
            </div>
            <div className="result-desc">
              {shotResult === 'perfect' &&
                `Dead center! The ${currentAnimal.name} is yours, plus bonus materials. +${currentAnimal.honor * 3} honor`}
              {shotResult === 'hit' &&
                `Good shot! You got the ${currentAnimal.name}! +${currentAnimal.honor} honor`}
              {shotResult === 'graze' &&
                `Your arrow grazed the ${currentAnimal.name} and it bolted!`}
              {shotResult === 'miss' &&
                `Your arrow thuds into the dirt. The ${currentAnimal.name} escapes into the brush.`}
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
              {aimSteadiness > 0.8 && 'Your math was spot on — your aim was rock steady.'}
              {aimSteadiness > 0.5 && aimSteadiness <= 0.8 && 'Decent math, but a faster answer would have steadied your aim more.'}
              {aimSteadiness > 0.25 && aimSteadiness <= 0.5 && 'Your shaky math made for a shaky shot. Practice those calculations!'}
              {aimSteadiness <= 0.25 && 'Wrong answer — your hands were trembling. Nail the math next time for a clean shot!'}
            </div>

            {questCompleted.length > 0 && (
              <div className="quest-complete-banner">
                Quest Complete! Check your rewards at camp.
              </div>
            )}

            <button className="next-btn" onClick={handleNext}>
              {encounterCount >= maxEncounters ? 'Return to Camp' : 'Next Encounter'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
