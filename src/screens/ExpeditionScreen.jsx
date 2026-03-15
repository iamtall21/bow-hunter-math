import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { ANIMALS, AREAS, MATERIALS } from '../data/gameData'
import { generateQuestion, getTimerSeconds, getWrongAnswerFeedback } from '../data/mathTemplates'
import StalkingField from './StalkingField'
import './ExpeditionScreen.css'

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
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  // Stalking
  const [stalkTime, setStalkTime] = useState(20)
  const [shotResult, setShotResult] = useState(null)
  const [mathCorrect, setMathCorrect] = useState(false)

  // Foraging system
  const [forageItems, setForageItems] = useState([])
  const [forageQuestion, setForageQuestion] = useState(null)
  const [forageAnswer, setForageAnswer] = useState('')
  const [forageResult, setForageResult] = useState(null)
  const forageInputRef = useRef(null)

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
    setShotResult(null)
    setStalkTime(20)
    setMathCorrect(false)
    setIsPaused(false)

    const seconds = getTimerSeconds(state.difficulty)
    setTimeLeft(seconds)
    setTotalTime(seconds)
    setPhase('math')
  }, [state.inventory.arrow, state.difficultyTier, state.difficulty, state.mathTopic, area.animals])

  // ---- MATH TIMER ----
  useEffect(() => {
    if (phase !== 'math' || isPaused || !state.timerEnabled) return

    if (inputRef.current) inputRef.current.focus()

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current)
          setStalkTime(8)
          setMathCorrect(false)
          setPhase('stalking')
          return 0
        }
        return Math.max(prev - 0.1, 0)
      })
    }, 100)

    return () => clearInterval(timerRef.current)
  }, [phase, isPaused, state.timerEnabled])

  // ---- SUBMIT MATH ANSWER ----
  const handleSubmitAnswer = () => {
    clearInterval(timerRef.current)
    const numAnswer = parseFloat(answer)

    const correct = !isNaN(numAnswer) && Math.abs(numAnswer - question.answer) < 0.01
    setMathCorrect(correct)
    setStalkTime(correct ? 20 : 8)
    setPhase('stalking')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && answer.trim()) {
      handleSubmitAnswer()
    }
  }

  // ---- STALKING COMPLETE ----
  const handleStalkComplete = useCallback((outcome) => {
    state.recordHunt(currentAnimal.id, outcome)
    const newlyCompleted = state.checkAndCompleteQuests()
    if (newlyCompleted.length > 0) {
      setQuestCompleted(newlyCompleted)
    }
    setEncounterCount((c) => c + 1)
    setShotResult(outcome)
    setPhase('result')
  }, [currentAnimal, state])

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
    setPhase('scouting')
  }

  const handleSkipForage = () => {
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

        {/* MATH PHASE */}
        {phase === 'math' && currentAnimal && (
          <div className="phase-math">
            <div className="hunting-ground">
              <div className="ground-trees" />
              <div className="ground-grass" />
              <div
                className="animal-target animal-grazing"
                style={{ left: '50%', top: '35%' }}
              >
                {currentAnimal.icon}
              </div>

              {/* Pause button overlays the hunting ground */}
              {state.timerEnabled && (
                <button
                  className="pause-btn-overlay"
                  onClick={() => setIsPaused(p => !p)}
                >
                  {isPaused ? '▶ Resume' : '⏸ Pause'}
                </button>
              )}

              {isPaused && (
                <div className="pause-overlay">
                  <div className="pause-text">PAUSED</div>
                </div>
              )}
            </div>

            <div className="math-overlay">
              {state.timerEnabled && (
                <>
                  <div className="timer-bar-container">
                    <div
                      className="timer-bar"
                      style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
                    />
                  </div>
                  <div className="timer-row">
                    <div className="timer-text">{timeLeft.toFixed(1)}s</div>
                  </div>
                </>
              )}

              <div className="challenge-box">
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
                    disabled={isPaused}
                  />
                  <button
                    className="submit-answer-btn"
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() || isPaused}
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

        {/* STALKING PHASE */}
        {phase === 'stalking' && currentAnimal && (
          <StalkingField
            animal={currentAnimal}
            stalkTime={stalkTime}
            onComplete={handleStalkComplete}
          />
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
              {shotResult === 'miss' && '❌'}
            </div>
            <div className="result-title">
              {shotResult === 'perfect' && 'PERFECT SHOT!'}
              {shotResult === 'hit' && 'Hit!'}
              {shotResult === 'miss' && 'Miss!'}
            </div>
            <div className="result-desc">
              {shotResult === 'perfect' &&
                `You crept in close — dead center! The ${currentAnimal.name} is yours, plus bonus materials. +${currentAnimal.honor * 3} honor`}
              {shotResult === 'hit' &&
                `Good stalk! You got the ${currentAnimal.name}! +${currentAnimal.honor} honor`}
              {shotResult === 'miss' &&
                `The ${currentAnimal.name} escaped into the brush. ${!mathCorrect ? 'A wrong answer left you with barely any stalking time.' : 'Get closer next time!'}`}
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
              {mathCorrect
                ? `Correct answer — you earned ${stalkTime} seconds to stalk the ${currentAnimal.name}.`
                : getWrongAnswerFeedback(question, answer)
              }
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
