import { useState, useEffect, useRef, useCallback } from 'react'

const HUNTER_SPEED = 0.35
const AWARENESS_RADIUS = 15
const ALERT_DURATION = 2
const FLEE_SPEED = 0.6
const FIELD_BOUNDS = { minX: 2, maxX: 98, minY: 2, maxY: 98 }

// Shot distance thresholds (percentage of field)
const PERFECT_DIST = 12
const HIT_DIST = 35

export function useStalkingGame({ stalkDuration, onComplete }) {
  // Hunter position — starts at bottom center
  const hunterPos = useRef({ x: 50, y: 88 })
  const [hunterRenderPos, setHunterRenderPos] = useState({ x: 50, y: 88 })
  const [hunterFacing, setHunterFacing] = useState('up')
  const [isMoving, setIsMoving] = useState(false)

  // Animal position — near top, slightly randomized
  const animalStartPos = useRef({
    x: 25 + Math.random() * 50,
    y: 10 + Math.random() * 20,
  })
  const animalPos = useRef({ ...animalStartPos.current })
  const [animalRenderPos, setAnimalRenderPos] = useState({ ...animalStartPos.current })
  const [animalState, setAnimalState] = useState('grazing') // grazing | alert | fleeing
  const alertTimer = useRef(0)

  // Stalk timer
  const [stalkTimeLeft, setStalkTimeLeft] = useState(stalkDuration)
  const stalkTimeRef = useRef(stalkDuration)

  // Shot state
  const [shotFired, setShotFired] = useState(false)
  const [shotResult, setShotResult] = useState(null)
  const [arrowPos, setArrowPos] = useState(null)

  // Keys
  const keysPressed = useRef({})
  const animFrameRef = useRef(null)
  const gameOver = useRef(false)
  const animalStateRef = useRef('grazing')

  // Keep ref in sync
  useEffect(() => {
    animalStateRef.current = animalState
  }, [animalState])

  const endGame = useCallback((outcome) => {
    if (gameOver.current) return
    gameOver.current = true
    cancelAnimationFrame(animFrameRef.current)
    setShotResult(outcome)
    // Small delay so player sees the result
    setTimeout(() => onComplete(outcome), 800)
  }, [onComplete])

  // Shoot action
  const shoot = useCallback(() => {
    if (shotFired || gameOver.current) return

    setShotFired(true)

    const hp = hunterPos.current
    const ap = animalPos.current
    const dx = hp.x - ap.x
    const dy = hp.y - ap.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    // Arrow animation target
    setArrowPos({ fromX: hp.x, fromY: hp.y, toX: ap.x, toY: ap.y })

    let outcome
    if (dist < PERFECT_DIST) {
      outcome = 'perfect'
    } else if (dist < HIT_DIST) {
      outcome = 'hit'
    } else {
      outcome = 'miss'
    }

    setTimeout(() => endGame(outcome), 600)
  }, [shotFired, endGame])

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        e.preventDefault()
      }
      keysPressed.current[e.key] = true
      if (e.key === ' ') shoot()
    }
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      keysPressed.current = {}
    }
  }, [shoot])

  // Main game loop
  useEffect(() => {
    let lastTimestamp = null

    const loop = (timestamp) => {
      if (gameOver.current) return

      if (!lastTimestamp) lastTimestamp = timestamp
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1)
      lastTimestamp = timestamp

      // --- Stalk timer ---
      stalkTimeRef.current -= dt
      if (stalkTimeRef.current <= 0) {
        stalkTimeRef.current = 0
        setStalkTimeLeft(0)
        endGame('miss')
        return
      }
      setStalkTimeLeft(stalkTimeRef.current)

      // --- Hunter movement ---
      const k = keysPressed.current
      let dx = 0, dy = 0
      if (k['ArrowLeft'] || k['a']) dx -= 1
      if (k['ArrowRight'] || k['d']) dx += 1
      if (k['ArrowUp'] || k['w']) dy -= 1
      if (k['ArrowDown'] || k['s']) dy += 1

      // Normalize diagonal
      if (dx !== 0 && dy !== 0) {
        const norm = 1 / Math.sqrt(2)
        dx *= norm
        dy *= norm
      }

      const moving = dx !== 0 || dy !== 0
      setIsMoving(moving)

      if (moving) {
        // Determine facing
        if (Math.abs(dy) > Math.abs(dx)) {
          setHunterFacing(dy < 0 ? 'up' : 'down')
        } else {
          setHunterFacing(dx < 0 ? 'left' : 'right')
        }
      }

      const speed = HUNTER_SPEED * dt * 60
      hunterPos.current.x = Math.max(FIELD_BOUNDS.minX, Math.min(FIELD_BOUNDS.maxX, hunterPos.current.x + dx * speed))
      hunterPos.current.y = Math.max(FIELD_BOUNDS.minY, Math.min(FIELD_BOUNDS.maxY, hunterPos.current.y + dy * speed))
      setHunterRenderPos({ x: hunterPos.current.x, y: hunterPos.current.y })

      // --- Animal awareness ---
      const distToAnimal = Math.sqrt(
        (hunterPos.current.x - animalPos.current.x) ** 2 +
        (hunterPos.current.y - animalPos.current.y) ** 2
      )

      if (animalStateRef.current === 'grazing') {
        if (distToAnimal < AWARENESS_RADIUS) {
          setAnimalState('alert')
          animalStateRef.current = 'alert'
          alertTimer.current = ALERT_DURATION
        }
      } else if (animalStateRef.current === 'alert') {
        if (distToAnimal >= AWARENESS_RADIUS * 1.2) {
          // Hunter backed off
          setAnimalState('grazing')
          animalStateRef.current = 'grazing'
        } else {
          alertTimer.current -= dt
          if (alertTimer.current <= 0) {
            setAnimalState('fleeing')
            animalStateRef.current = 'fleeing'
          }
        }
      } else if (animalStateRef.current === 'fleeing') {
        // Move animal away from hunter
        const fleeAngle = Math.atan2(
          animalPos.current.y - hunterPos.current.y,
          animalPos.current.x - hunterPos.current.x
        )
        const fleeSpeed = FLEE_SPEED * dt * 60
        animalPos.current.x += Math.cos(fleeAngle) * fleeSpeed
        animalPos.current.y += Math.sin(fleeAngle) * fleeSpeed
        setAnimalRenderPos({ x: animalPos.current.x, y: animalPos.current.y })

        // Off screen = miss
        if (animalPos.current.x < -5 || animalPos.current.x > 105 ||
            animalPos.current.y < -5 || animalPos.current.y > 105) {
          endGame('miss')
          return
        }
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [endGame])

  return {
    hunterPos: hunterRenderPos,
    animalPos: animalRenderPos,
    animalState,
    stalkTimeLeft,
    shotFired,
    shotResult,
    isMoving,
    hunterFacing,
    arrowPos,
    alertProgress: animalState === 'alert' ? 1 - (alertTimer.current / ALERT_DURATION) : 0,
    shoot,
    awarenessRadius: AWARENESS_RADIUS,
  }
}
