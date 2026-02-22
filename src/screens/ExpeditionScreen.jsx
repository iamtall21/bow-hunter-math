import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { ANIMALS, AREAS } from '../data/gameData'
import { generateQuestion, getTimerSeconds } from '../data/mathTemplates'
import './ExpeditionScreen.css'

const ENCOUNTER_STATES = ['scouting', 'encounter', 'answering', 'result']

export default function ExpeditionScreen() {
  const state = useGameStore()
  const area = AREAS.meadow

  const [phase, setPhase] = useState('scouting')
  const [currentAnimal, setCurrentAnimal] = useState(null)
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [result, setResult] = useState(null)
  const [encounterCount, setEncounterCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [questCompleted, setQuestCompleted] = useState([])
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  const maxEncounters = 5

  const startEncounter = useCallback(() => {
    if (state.inventory.arrow <= 0) {
      setPhase('no_arrows')
      return
    }

    // Pick random animal from area
    const animalId = area.animals[Math.floor(Math.random() * area.animals.length)]
    const animal = ANIMALS[animalId]
    setCurrentAnimal({ id: animalId, ...animal })

    // Generate math question based on difficulty tier
    const q = generateQuestion(state.difficultyTier)
    setQuestion(q)
    setAnswer('')
    setShowHint(false)
    setResult(null)

    const seconds = getTimerSeconds(state.difficulty)
    setTimeLeft(seconds)
    setTotalTime(seconds)
    setPhase('encounter')
  }, [state.inventory.arrow, state.difficultyTier, state.difficulty, area.animals])

  // Timer countdown
  useEffect(() => {
    if (phase !== 'answering') return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current)
          handleTimeout()
          return 0
        }
        return Math.max(prev - 0.1, 0)
      })
    }, 100)

    return () => clearInterval(timerRef.current)
  }, [phase])

  // Focus input when answering
  useEffect(() => {
    if (phase === 'answering' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [phase])

  const startAnswering = () => {
    setPhase('answering')
  }

  const handleTimeout = () => {
    clearInterval(timerRef.current)
    // Time ran out — check if they typed a correct answer
    const numAnswer = parseFloat(answer)
    if (!isNaN(numAnswer) && Math.abs(numAnswer - question.answer) < 0.01) {
      finishEncounter('spooked')
    } else {
      finishEncounter('miss')
    }
  }

  const handleSubmit = () => {
    clearInterval(timerRef.current)
    const numAnswer = parseFloat(answer)

    if (isNaN(numAnswer)) {
      finishEncounter('miss')
      return
    }

    if (Math.abs(numAnswer - question.answer) < 0.01) {
      const timePercent = timeLeft / totalTime
      if (timePercent > 0.6) {
        finishEncounter('perfect')
      } else {
        finishEncounter('hit')
      }
    } else {
      finishEncounter('miss')
    }
  }

  const finishEncounter = (outcome) => {
    setResult(outcome)
    setPhase('result')
    state.recordHunt(currentAnimal.id, outcome)

    // Check quests
    const newlyCompleted = state.checkAndCompleteQuests()
    if (newlyCompleted.length > 0) {
      setQuestCompleted(newlyCompleted)
    }

    setEncounterCount((c) => c + 1)
  }

  const handleNext = () => {
    setQuestCompleted([])
    if (encounterCount >= maxEncounters) {
      state.goTo('camp')
    } else {
      setPhase('scouting')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && answer.trim()) {
      handleSubmit()
    }
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
              You reach for your quiver... it's empty. Time to head back to camp and craft more arrows.
            </div>
            <button className="scout-btn" onClick={() => state.goTo('camp')}>
              Return to Camp
            </button>
          </div>
        )}

        {/* ENCOUNTER — animal spotted */}
        {phase === 'encounter' && currentAnimal && (
          <div className="phase-encounter">
            <div className="animal-spotted">
              <span className="animal-icon">{currentAnimal.icon}</span>
              <div className="spotted-text">
                A {currentAnimal.name} appears!
              </div>
            </div>
            <div className="challenge-box">
              <div className="challenge-label">Hunter's Calculation:</div>
              <div className="challenge-question">{question.question}</div>
              <button className="aim-btn" onClick={startAnswering}>
                Take Aim (Start Timer)
              </button>
            </div>
          </div>
        )}

        {/* ANSWERING — timer running */}
        {phase === 'answering' && currentAnimal && (
          <div className="phase-answering">
            <div className="animal-spotted">
              <span className="animal-icon">{currentAnimal.icon}</span>
            </div>

            <div className="timer-bar-container">
              <div
                className="timer-bar"
                style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
              />
            </div>
            <div className="timer-text">{timeLeft.toFixed(1)}s</div>

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
                />
                <button
                  className="shoot-btn"
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                >
                  SHOOT!
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
        )}

        {/* RESULT */}
        {phase === 'result' && (
          <div className={`phase-result result-${result}`}>
            <div className="result-icon">
              {result === 'perfect' && '🎯'}
              {result === 'hit' && '✅'}
              {result === 'spooked' && '💨'}
              {result === 'miss' && '❌'}
            </div>
            <div className="result-title">
              {result === 'perfect' && 'PERFECT SHOT!'}
              {result === 'hit' && 'Hit!'}
              {result === 'spooked' && 'Spooked!'}
              {result === 'miss' && 'Miss!'}
            </div>
            <div className="result-desc">
              {result === 'perfect' &&
                `Clean hit! The ${currentAnimal.name} is yours, plus bonus materials. +${currentAnimal.honor * 3} honor`}
              {result === 'hit' &&
                `You got the ${currentAnimal.name}! +${currentAnimal.honor} honor`}
              {result === 'spooked' &&
                `The ${currentAnimal.name} heard you hesitate and bolted! Correct answer, but too slow.`}
              {result === 'miss' &&
                `Your arrow flies wide. The ${currentAnimal.name} escapes.`}
            </div>

            {(result === 'miss' || result === 'spooked') && (
              <div className="correct-answer">
                The answer was: <strong>{question.answer}</strong>
                {question.hint && <div className="result-hint">{question.hint}</div>}
              </div>
            )}

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
