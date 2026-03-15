import { useState, useRef, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { ANIMALS } from '../data/gameData'
import { generateQuestion, getTimerSeconds, getWrongAnswerFeedback } from '../data/mathTemplates'
import './SpeechBubbleMath.css'

export default function SpeechBubbleMath({ animal, screenX, screenY, onCorrect, onWrong }) {
  const state = useGameStore()
  const animalData = ANIMALS[animal.speciesId]
  const [question] = useState(() => generateQuestion(state.difficultyTier, state.mathTopic))
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null) // null | 'correct' | 'wrong'
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const totalSeconds = getTimerSeconds(state.difficulty)
  const [timeLeft, setTimeLeft] = useState(totalSeconds)

  // Focus input
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150)
  }, [])

  // Timer
  useEffect(() => {
    if (result || !state.timerEnabled) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleWrong()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [result, state.timerEnabled])

  const [wrongFeedback, setWrongFeedback] = useState(null)

  const handleWrong = () => {
    clearInterval(timerRef.current)
    setResult('wrong')
    setWrongFeedback(getWrongAnswerFeedback(question, answer))
    setTimeout(() => onWrong(), 3500)
  }

  const handleCorrect = () => {
    clearInterval(timerRef.current)
    setResult('correct')
    setTimeout(() => onCorrect(), 800)
  }

  const submit = () => {
    if (result) return
    const num = parseFloat(answer)
    const correct = !isNaN(num) && Math.abs(num - question.answer) < 0.01
    if (correct) {
      handleCorrect()
    } else {
      handleWrong()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submit()
    // Prevent space from propagating to game
    if (e.key === ' ') e.stopPropagation()
  }

  const timerPercent = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0
  const timerColor = timerPercent > 50 ? '#8bc48b' : timerPercent > 25 ? '#e8c97a' : '#e87a7a'

  // Clamp bubble position to viewport
  const bubbleStyle = {
    left: Math.max(20, Math.min(screenX - 150, window.innerWidth - 320)),
    top: Math.max(10, screenY - 200),
  }

  return (
    <div className="speech-bubble-anchor" style={bubbleStyle}>
      <div className="speech-bubble">
        {!result ? (
          <>
            <div className="bubble-animal-name">
              {animalData?.name || animal.speciesId}
            </div>
            {state.timerEnabled && (
              <div className="bubble-timer">
                <div
                  className="bubble-timer-fill"
                  style={{ width: `${timerPercent}%`, background: timerColor }}
                />
              </div>
            )}
            <div className="bubble-question">{question.question}</div>
            <div className="bubble-input-row">
              <input
                ref={inputRef}
                type="number"
                step="any"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bubble-input"
                placeholder="?"
                autoComplete="off"
              />
              <button className="bubble-submit" onClick={submit}>
                ANSWER
              </button>
            </div>
            {question.hint && (
              <div className="bubble-hint">{question.hint}</div>
            )}
          </>
        ) : (
          <div className="bubble-result">
            {result === 'correct' ? (
              <div className="bubble-result-text correct">CORRECT! Prepare to hunt...</div>
            ) : (
              <>
                <div className="bubble-result-text wrong">
                  {timeLeft <= 0 ? 'TOO SLOW!' : 'NOT QUITE!'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#c4a882', marginTop: '0.3rem', lineHeight: 1.4 }}>
                  {wrongFeedback}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#8bc48b', marginTop: '0.2rem' }}>
                  The answer was {question.answer}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
