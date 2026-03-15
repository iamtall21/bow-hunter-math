import { useState, useRef, useEffect, useCallback } from 'react'
import { ANIMALS } from '../data/gameData'
import { ANIMAL_SPRITES } from './sprites.js'
import { drawSprite } from './SpriteRenderer.js'
import { useGameStore } from '../store/gameStore'
import './DoomHuntOverlay.css'

// Evasion profiles per species — speed is in normalized units/sec (0-1 = full canvas width)
const EVASION = {
  rabbit:      { speed: 0.45, jitter: 0.15, fakeOut: 1.8 },
  quail:       { speed: 0.40, jitter: 0.12, fakeOut: 1.5 },
  deer:        { speed: 0.28, jitter: 0.06, fakeOut: 2.0 },
  elk:         { speed: 0.20, jitter: 0.04, fakeOut: 2.5 },
  antelope:    { speed: 0.50, jitter: 0.10, fakeOut: 3.0 },
  wild_turkey: { speed: 0.22, jitter: 0.08, fakeOut: 1.0 },
  fox:         { speed: 0.35, jitter: 0.14, fakeOut: 2.5 },
  squirrel:    { speed: 0.42, jitter: 0.18, fakeOut: 1.5 },
  raccoon:     { speed: 0.25, jitter: 0.08, fakeOut: 1.5 },
  pheasant:    { speed: 0.32, jitter: 0.10, fakeOut: 1.5 },
  trout:       { speed: 0.32, jitter: 0.10, fakeOut: 2.0 },
  catfish:     { speed: 0.22, jitter: 0.06, fakeOut: 1.5 },
  bass:        { speed: 0.38, jitter: 0.12, fakeOut: 2.0 },
  pike:        { speed: 0.28, jitter: 0.08, fakeOut: 2.5 },
}

const DEFAULT_EVASION = { speed: 0.28, jitter: 0.08, fakeOut: 1.5 }
const HUNT_TIME = 10 // seconds to shoot

export default function DoomHuntOverlay({ animal, onComplete }) {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const animRef = useRef(null)
  const mousePosRef = useRef({ x: 0.5, y: 0.5 })
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const shotFiredRef = useRef(false)
  const outcomeRef = useRef(null)
  const [outcome, setOutcome] = useState(null) // for rendering
  const [shaking, setShaking] = useState(false)
  const startTimeRef = useRef(Date.now())

  const state = useGameStore()
  const animalData = ANIMALS[animal.speciesId]
  const isRiver = animalData?.area === 'river'
  const ammoType = isRiver ? 'spear' : 'arrow'
  const ammoCount = state.inventory[ammoType] || 0

  // Animal movement state
  const animalState = useRef({
    x: 0.5,
    dir: Math.random() > 0.5 ? 1 : -1,
    elapsed: 0,
    fakeOutTimer: 0,
    bbox: null,
  })

  // Single animation loop — no React state dependencies
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const container = overlayRef.current || canvas.parentElement
      const cw = container?.clientWidth || window.innerWidth
      const ch = container?.clientHeight || window.innerHeight
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw
        canvas.height = ch
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const profile = EVASION[animal.speciesId] || DEFAULT_EVASION
    const spriteData = ANIMAL_SPRITES[animal.speciesId]

    let running = true
    let lastTime = performance.now()

    const loop = (now) => {
      if (!running) return
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const ctx = canvas.getContext('2d')
      const w = canvas.width
      const h = canvas.height

      if (w > 0 && h > 0) {
        // --- UPDATE ---
        if (!shotFiredRef.current) {
          const st = animalState.current
          st.elapsed += dt

          // Speed ramps up over time
          const speedMult = 1 + st.elapsed * 0.15
          const moveAmt = profile.speed * speedMult * dt

          // Fake-out direction changes (timer-based, not per-frame random)
          st.fakeOutTimer += dt
          if (st.fakeOutTimer >= (1 / profile.fakeOut)) {
            st.fakeOutTimer = 0
            if (Math.random() < 0.6) {
              st.dir *= -1
            }
          }

          // Jitter
          const jitterAmt = (Math.random() - 0.5) * profile.jitter * dt

          st.x += (moveAmt * st.dir) + jitterAmt

          // Bounce off edges
          if (st.x < 0.05) { st.x = 0.05; st.dir = 1 }
          if (st.x > 0.85) { st.x = 0.85; st.dir = -1 }

          // Check time limit (only if timer enabled)
          const elapsed = (Date.now() - startTimeRef.current) / 1000
          if (state.timerEnabled && elapsed >= HUNT_TIME) {
            shotFiredRef.current = true
            outcomeRef.current = 'miss'
            setOutcome('miss')
            setShaking(true)
            setTimeout(() => setShaking(false), 300)
          }
        }

        // --- RENDER ---
        ctx.imageSmoothingEnabled = false

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 0, h)
        grad.addColorStop(0, '#0a1a08')
        grad.addColorStop(0.2, '#122210')
        grad.addColorStop(0.4, '#1a3315')
        grad.addColorStop(0.55, '#1f3d1a')
        grad.addColorStop(1, '#0d1f0b')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)

        // Ground
        const groundY = h * 0.65
        ctx.fillStyle = '#2a4a22'
        ctx.fillRect(0, groundY, w, h - groundY)
        ctx.fillStyle = '#3a5a32'
        ctx.fillRect(0, groundY, w, 3)

        // Tree silhouettes
        ctx.fillStyle = '#061008'
        for (let i = 0; i < 7; i++) {
          const tx = (w / 7) * i + 20
          const th = 80 + Math.sin(i * 2.3) * 30
          ctx.beginPath()
          ctx.moveTo(tx, groundY)
          ctx.lineTo(tx - 25, groundY)
          ctx.lineTo(tx - 12, groundY - th)
          ctx.closePath()
          ctx.fill()
        }

        // Animal sprite
        const st = animalState.current
        const spriteSize = spriteData ? (spriteData.size || 12) : 12
        const scale = Math.max(8, Math.floor(Math.min(w * 0.28, 220) / spriteSize))
        const animalW = spriteSize * scale
        const animalH = spriteSize * scale
        const ax = st.x * (w - animalW)
        const ay = groundY - animalH - 10

        // Draw a subtle glow behind the animal so it's always visible
        ctx.save()
        ctx.shadowColor = 'rgba(255, 255, 200, 0.6)'
        ctx.shadowBlur = 15
        ctx.fillStyle = 'rgba(255, 255, 200, 0.15)'
        ctx.fillRect(Math.floor(ax) - 4, Math.floor(ay) - 4, animalW + 8, animalH + 8)
        ctx.restore()

        if (spriteData) {
          const frame = spriteData.frames[Math.floor(st.elapsed * 4) % spriteData.frames.length]
          drawSprite(ctx, frame, Math.floor(ax), Math.floor(ay), scale)
        } else {
          ctx.fillStyle = '#c4a060'
          ctx.fillRect(Math.floor(ax), Math.floor(ay), animalW, animalH)
        }

        st.bbox = { x: ax / w, y: ay / h, w: animalW / w, h: animalH / h }
      }

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)

    return () => {
      running = false
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [animal.speciesId])

  // Mouse tracking
  const handleMouseMove = useCallback((e) => {
    const rect = overlayRef.current?.getBoundingClientRect()
    if (!rect) return
    const pos = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
    mousePosRef.current = pos
    setMousePos(pos)
  }, [])

  // Click to fire
  const handleClick = useCallback(() => {
    if (shotFiredRef.current) return

    shotFiredRef.current = true
    setShaking(true)
    setTimeout(() => setShaking(false), 300)

    // Consume ammo
    const storeState = useGameStore.getState()
    if (storeState.inventory[ammoType] > 0) {
      storeState.forage({ [ammoType]: -1 })
    }

    // Hit detection
    const bbox = animalState.current.bbox
    if (!bbox) {
      outcomeRef.current = 'miss'
      setOutcome('miss')
      return
    }

    const mx = mousePosRef.current.x
    const my = mousePosRef.current.y

    const inBox = mx >= bbox.x && mx <= bbox.x + bbox.w &&
                  my >= bbox.y && my <= bbox.y + bbox.h

    if (!inBox) {
      outcomeRef.current = 'miss'
      setOutcome('miss')
      return
    }

    // Center 50% = perfect
    const centerX = bbox.x + bbox.w / 2
    const centerY = bbox.y + bbox.h / 2
    const innerW = bbox.w * 0.25
    const innerH = bbox.h * 0.25
    const inCenter = Math.abs(mx - centerX) < innerW && Math.abs(my - centerY) < innerH

    const result = inCenter ? 'perfect' : 'hit'
    outcomeRef.current = result
    setOutcome(result)
  }, [ammoType])

  const handleComplete = () => {
    onComplete(outcomeRef.current)
  }

  const elapsed = (Date.now() - startTimeRef.current) / 1000
  const timerPercent = Math.max(0, (1 - elapsed / HUNT_TIME) * 100)
  const timerColor = timerPercent > 50 ? '#66ff66' : timerPercent > 25 ? '#ffaa00' : '#ff4444'

  return (
    <div
      className={`doom-hunt-overlay ${shaking ? 'doom-shake' : ''}`}
      ref={overlayRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="doom-hunt-canvas" />

      {/* Timer */}
      {!outcome && state.timerEnabled && (
        <div className="doom-timer">
          <div
            className="doom-timer-fill"
            style={{ width: `${timerPercent}%`, background: timerColor }}
          />
        </div>
      )}

      {/* HUD */}
      <div className="doom-hud-target">
        {animalData?.name || animal.speciesId}
      </div>

      <div className="doom-hud-ammo">
        <div className="doom-ammo-count">{ammoCount}</div>
        <div>{isRiver ? '🔱 spears' : '🏹 arrows'}</div>
      </div>

      {!outcome && (
        <div className="doom-hud-instruction">CLICK TO SHOOT</div>
      )}

      {/* Crosshair (follows mouse) */}
      {!outcome && (
        <div
          className="doom-crosshair"
          style={{
            left: `${mousePos.x * 100}%`,
            top: `${mousePos.y * 100}%`,
          }}
        >
          <div className="doom-cross-h" />
          <div className="doom-cross-v" />
          <div className="doom-cross-dot" />
          <div className="doom-bracket tl" />
          <div className="doom-bracket tr" />
          <div className="doom-bracket bl" />
          <div className="doom-bracket br" />
        </div>
      )}

      {/* Result */}
      {outcome && (
        <div className="doom-result">
          <div className={`doom-result-flash ${outcome}`} />
          <div className={`doom-result-text ${outcome}`}>
            {outcome === 'perfect' ? 'PERFECT KILL' :
             outcome === 'hit' ? 'TARGET DOWN' : 'MISSED'}
          </div>

          {outcome !== 'miss' && animalData && (
            <div className="doom-result-loot">
              +{animalData.honor * (outcome === 'perfect' ? 3 : 1)} HONOR
              {animalData.drops && Object.entries(animalData.drops).map(([item, qty]) => (
                <span key={item}> | +{outcome === 'perfect' ? qty + 1 : qty} {item}</span>
              ))}
            </div>
          )}

          <button className="doom-result-continue" onClick={handleComplete}>
            [ CONTINUE ]
          </button>
        </div>
      )}
    </div>
  )
}
