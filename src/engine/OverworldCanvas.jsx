import { useRef, useEffect, useState, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { GameLoop } from './GameLoop.js'
import { VIEW_W, VIEW_H, TILE_SIZE } from './constants.js'
import { ANIMALS, AREAS } from '../data/gameData.js'
import OverworldHUD from './OverworldHUD.jsx'
import SpeechBubbleMath from './SpeechBubbleMath.jsx'
import DoomHuntOverlay from './DoomHuntOverlay.jsx'
import ForageMathBubble from './ForageMathBubble.jsx'
import './OverworldCanvas.css'

export default function OverworldCanvas() {
  const canvasRef = useRef(null)
  const gameLoopRef = useRef(null)
  const [currentZone, setCurrentZone] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)
  const [levelUpMsg, setLevelUpMsg] = useState(null)

  // Two-phase encounter state
  const [encounterPhase, setEncounterPhase] = useState(null) // null | 'math' | 'hunt'
  const [encounterData, setEncounterData] = useState(null)   // { animal, distance, screenX, screenY }

  // Forage math state
  const [forageData, setForageData] = useState(null) // { spot, screenX, screenY }

  const store = useGameStore

  const showToast = useCallback((msg, duration = 2000) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), duration)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = VIEW_W
    canvas.height = VIEW_H

    const loop = new GameLoop(canvas, store, {
      onZoneChange: (zone) => setCurrentZone(zone),
      onCampEnter: () => store.getState().goTo('camp'),

      onEncounter: (animal, distance) => {
        // Calculate screen position for speech bubble
        const screenPos = loop.getScreenPos(animal.x, animal.y)
        const scale = canvas.clientWidth / VIEW_W
        setEncounterData({
          animal,
          distance,
          screenX: screenPos.x * scale,
          screenY: screenPos.y * scale,
        })
        setEncounterPhase('math')
      },

      onForage: (spot) => {
        // Show math bubble instead of giving materials immediately
        const sx = spot.col * TILE_SIZE + TILE_SIZE / 2
        const sy = spot.row * TILE_SIZE + TILE_SIZE / 2
        const screenPos = loop.getScreenPos(sx, sy)
        const scale = canvas.clientWidth / VIEW_W
        setForageData({
          spot,
          screenX: screenPos.x * scale,
          screenY: screenPos.y * scale,
        })
      },
    })

    gameLoopRef.current = loop
    loop.start()

    return () => loop.stop()
  }, [])

  // Phase 1 → correct → Phase 2 (Doom hunt)
  const handleMathCorrect = useCallback(() => {
    // Track the correct answer for leveling
    const levelResult = store.getState().checkLevelUp?.()
    if (levelResult?.leveledUp) {
      const unlockMsgs = (levelResult.unlocks || []).map(u =>
        u.type === 'area' ? `${AREAS[u.id]?.name || u.id} unlocked!` :
        u.type === 'recipe' ? `New recipe unlocked!` : ''
      ).filter(Boolean)
      const msg = `LEVEL ${levelResult.newLevel}!` +
        (unlockMsgs.length ? ' ' + unlockMsgs.join(' ') : '')
      setLevelUpMsg(msg)
      setTimeout(() => setLevelUpMsg(null), 4000)
    }
    setEncounterPhase('hunt')
  }, [])

  // Phase 1 → wrong → animal bolts
  const handleMathWrong = useCallback(() => {
    if (encounterData) {
      const playerState = store.getState()
      gameLoopRef.current?.world.instantFleeAnimal(
        encounterData.animal.id,
        playerState.playerWorldX ?? 0,
        playerState.playerWorldY ?? 0
      )
    }
    setEncounterPhase(null)
    setEncounterData(null)
    gameLoopRef.current?.resumeInput()
    showToast('The animal bolted!')
  }, [encounterData, showToast])

  // Phase 2 → hunt complete
  const handleHuntComplete = useCallback((outcome) => {
    if (encounterData) {
      const animalData = ANIMALS[encounterData.animal.speciesId]
      const isRiver = animalData?.area === 'river'

      if (outcome !== 'miss') {
        gameLoopRef.current?.world.removeAnimal(encounterData.animal.id)
      }

      if (isRiver) {
        store.getState().recordFishing(encounterData.animal.speciesId, outcome)
      } else {
        store.getState().recordHunt(encounterData.animal.speciesId, outcome)
      }
      store.getState().checkAndCompleteQuests()

      // Check level up again after hunt
      const levelResult = store.getState().checkLevelUp?.()
      if (levelResult?.leveledUp) {
        const unlockMsgs = (levelResult.unlocks || []).map(u =>
          u.type === 'area' ? `${AREAS[u.id]?.name || u.id} unlocked!` :
          u.type === 'recipe' ? `New recipe unlocked!` : ''
        ).filter(Boolean)
        setLevelUpMsg(`LEVEL ${levelResult.newLevel}!` +
          (unlockMsgs.length ? ' ' + unlockMsgs.join(' ') : ''))
        setTimeout(() => setLevelUpMsg(null), 4000)
      }
    }

    setEncounterPhase(null)
    setEncounterData(null)
    gameLoopRef.current?.resumeInput()
  }, [encounterData])

  // Forage math correct → give materials
  const handleForageCorrect = useCallback(() => {
    if (forageData) {
      const zoneId = forageData.spot.zone
      const area = AREAS[zoneId]
      const materials = {}
      const options = area?.materialsFound || ['stick', 'flint']
      for (const mat of options) {
        materials[mat] = 1 + Math.floor(Math.random() * 2)
      }
      store.getState().forage(materials)
      showToast('Materials gathered!')

      // Check level up
      const levelResult = store.getState().checkLevelUp?.()
      if (levelResult?.leveledUp) {
        setLevelUpMsg(`LEVEL ${levelResult.newLevel}!`)
        setTimeout(() => setLevelUpMsg(null), 4000)
      }
    }
    setForageData(null)
    gameLoopRef.current?.resumeInput()
  }, [forageData, showToast])

  // Forage math wrong → no materials
  const handleForageWrong = useCallback(() => {
    showToast('You fumbled the materials!')
    setForageData(null)
    gameLoopRef.current?.resumeInput()
  }, [showToast])

  return (
    <div className="overworld-container">
      <canvas
        ref={canvasRef}
        className="overworld-canvas"
      />
      <OverworldHUD currentZone={currentZone} />

      {toastMsg && (
        <div className="forage-toast">{toastMsg}</div>
      )}

      {levelUpMsg && (
        <div className="level-up-toast">{levelUpMsg}</div>
      )}

      {/* Phase 1: Speech bubble math */}
      {encounterPhase === 'math' && encounterData && (
        <SpeechBubbleMath
          animal={encounterData.animal}
          screenX={encounterData.screenX}
          screenY={encounterData.screenY}
          onCorrect={handleMathCorrect}
          onWrong={handleMathWrong}
        />
      )}

      {/* Phase 2: Doom hunt */}
      {encounterPhase === 'hunt' && encounterData && (
        <DoomHuntOverlay
          animal={encounterData.animal}
          onComplete={handleHuntComplete}
        />
      )}

      {/* Forage math bubble */}
      {forageData && (
        <ForageMathBubble
          screenX={forageData.screenX}
          screenY={forageData.screenY}
          onCorrect={handleForageCorrect}
          onWrong={handleForageWrong}
        />
      )}
    </div>
  )
}
