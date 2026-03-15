import { useState, useRef, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { MATERIALS } from '../data/gameData'
import { generateQuestion, getTimerSeconds } from '../data/mathTemplates'
import './ForagingScreen.css'

const FORAGE_FINDS = [
  { materials: { stick: 3, flint: 2 }, description: 'You find some sticks and flint chips near the treeline.' },
  { materials: { feather: 4, stick: 1 }, description: 'Fallen feathers and a sturdy stick catch your eye.' },
  { materials: { flint: 3, feather: 2 }, description: 'Sharp flint chips glint in the dirt. A few feathers blow past.' },
  { materials: { stick: 2, feather: 3, flint: 1 }, description: 'A bit of everything scattered around the clearing.' },
  { materials: { willow: 2, cord: 1 }, description: 'Willow branches hang low by the water, and you spot some cord tangled in the reeds.' },
  { materials: { sinew: 1, stick: 2 }, description: 'Old sinew scraps and sticks lie near a past campsite.' },
]

export default function ForagingScreen() {
  const state = useGameStore()
  const [phase, setPhase] = useState('searching') // searching | found | math | bonus | done
  const [find, setFind] = useState(null)
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [result, setResult] = useState(null) // null | 'correct' | 'wrong' | 'timeout'
  const [bonusMaterials, setBonusMaterials] = useState(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const totalSeconds = getTimerSeconds(state.difficulty)

  const startSearch = () => {
    const roll = FORAGE_FINDS[Math.floor(Math.random() * FORAGE_FINDS.length)]
    setFind(roll)
    setPhase('found')
  }

  const collectBase = () => {
    state.forage(find.materials)
    setPhase('done')
    setResult(null)
  }

  const tryBonus = () => {
    const q = generateQuestion(1, state.mathTopic)
    setQuestion(q)
    setAnswer('')
    setTimeLeft(totalSeconds)
    setPhase('math')
  }

  // Timer
  useEffect(() => {
    if (phase !== 'math' || !state.timerEnabled) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setResult('timeout')
          setPhase('bonus')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, state.timerEnabled])

  // Focus input
  useEffect(() => {
    if (phase === 'math' && inputRef.current) inputRef.current.focus()
  }, [phase])

  const submitAnswer = () => {
    clearInterval(timerRef.current)
    const numAnswer = parseFloat(answer)
    if (!isNaN(numAnswer) && Math.abs(numAnswer - question.answer) < 0.01) {
      // Correct — double the find
      const bonus = {}
      Object.entries(find.materials).forEach(([mat, qty]) => {
        bonus[mat] = qty
      })
      setBonusMaterials(bonus)
      state.forage({ ...find.materials, ...bonus })
      setResult('correct')
    } else {
      // Wrong — just get the base
      state.forage(find.materials)
      setResult('wrong')
    }
    setPhase('bonus')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submitAnswer()
  }

  const timerPercent = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0
  const timerColor = timerPercent > 50 ? '#8bc48b' : timerPercent > 25 ? '#e8c97a' : '#e87a7a'

  return (
    <div className="forage-screen">
      <div className="forage-header">
        <button className="back-btn" onClick={() => state.goTo('camp')}>Back to Camp</button>
        <h2>Forage Around Camp</h2>
      </div>

      <div className="forage-content">
        {phase === 'searching' && (
          <div className="forage-section">
            <p className="forage-flavor">
              You scan the area around camp for useful materials...
            </p>
            <button className="forage-btn search-btn" onClick={startSearch}>
              🔍 Search the Area
            </button>
          </div>
        )}

        {phase === 'found' && find && (
          <div className="forage-section">
            <p className="forage-flavor">{find.description}</p>
            <div className="found-materials">
              {Object.entries(find.materials).map(([mat, qty]) => (
                <div key={mat} className="found-item">
                  <span>{MATERIALS[mat]?.icon || '📦'}</span>
                  <span>{MATERIALS[mat]?.name || mat}</span>
                  <span className="found-qty">+{qty}</span>
                </div>
              ))}
            </div>
            <div className="forage-choices">
              <button className="forage-btn collect-btn" onClick={collectBase}>
                Collect and head back
              </button>
              <button className="forage-btn bonus-btn" onClick={tryBonus}>
                ✨ Solve a math challenge for double!
              </button>
            </div>
          </div>
        )}

        {phase === 'math' && question && (
          <div className="forage-section math-section">
            {state.timerEnabled && (
              <div className="forage-timer-bar">
                <div
                  className="forage-timer-fill"
                  style={{ width: `${timerPercent}%`, background: timerColor }}
                />
              </div>
            )}
            <p className="forage-question">{question.question}</p>
            <div className="forage-input-row">
              <input
                ref={inputRef}
                type="number"
                step="any"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                className="forage-input"
                placeholder="Your answer"
              />
              <button className="forage-btn submit-btn" onClick={submitAnswer}>
                Lock In
              </button>
            </div>
            {question.hint && (
              <p className="forage-hint">💡 Hint: {question.hint}</p>
            )}
          </div>
        )}

        {phase === 'bonus' && (
          <div className="forage-section">
            {result === 'correct' && (
              <>
                <p className="forage-result correct">✅ Correct! Double materials collected!</p>
                <div className="found-materials">
                  {Object.entries(find.materials).map(([mat, qty]) => (
                    <div key={mat} className="found-item">
                      <span>{MATERIALS[mat]?.icon || '📦'}</span>
                      <span>{MATERIALS[mat]?.name || mat}</span>
                      <span className="found-qty">+{qty * 2}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {result === 'wrong' && (
              <>
                <p className="forage-result wrong">
                  ❌ Not quite — the answer was {question.answer}. You still collected the base materials.
                </p>
                <div className="found-materials">
                  {Object.entries(find.materials).map(([mat, qty]) => (
                    <div key={mat} className="found-item">
                      <span>{MATERIALS[mat]?.icon || '📦'}</span>
                      <span>{MATERIALS[mat]?.name || mat}</span>
                      <span className="found-qty">+{qty}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {result === 'timeout' && (
              <>
                <p className="forage-result wrong">
                  ⏱️ Time's up — the answer was {question.answer}. You still collected the base materials.
                </p>
                <div className="found-materials">
                  {Object.entries(find.materials).map(([mat, qty]) => (
                    <div key={mat} className="found-item">
                      <span>{MATERIALS[mat]?.icon || '📦'}</span>
                      <span>{MATERIALS[mat]?.name || mat}</span>
                      <span className="found-qty">+{qty}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="forage-choices">
              <button className="forage-btn search-btn" onClick={() => { setPhase('searching'); setFind(null); setQuestion(null); setResult(null); }}>
                🔍 Search Again
              </button>
              <button className="forage-btn collect-btn" onClick={() => state.goTo('camp')}>
                Return to Camp
              </button>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="forage-section">
            <p className="forage-result correct">Materials collected!</p>
            <div className="forage-choices">
              <button className="forage-btn search-btn" onClick={() => { setPhase('searching'); setFind(null); }}>
                🔍 Search Again
              </button>
              <button className="forage-btn collect-btn" onClick={() => state.goTo('camp')}>
                Return to Camp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
