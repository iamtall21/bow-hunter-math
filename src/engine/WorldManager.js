import { Animal } from './Animal.js'
import { TILE_SIZE, ZONE, ANIMAL_ENCOUNTER_RADIUS, SOLID_TILES } from './constants.js'
import { ANIMALS, AREAS } from '../data/gameData.js'
import { ANIMAL_SPRITES } from './sprites.js'
import { getZoneAt, dist } from './CollisionSystem.js'

const MAX_ANIMALS_PER_ZONE = 2
const RESPAWN_INTERVAL = 15 // seconds

let nextAnimalId = 0

export class WorldManager {
  constructor(zoneMap, groundLayer, objectLayer, storeApi) {
    this.zoneMap = zoneMap
    this.groundLayer = groundLayer
    this.objectLayer = objectLayer
    this.storeApi = storeApi
    this.animals = []
    this.respawnTimer = 0

    // Initial spawn
    this._spawnInitial()
  }

  _getUnlockedAreas() {
    if (this.storeApi) {
      return this.storeApi.getState().unlockedAreas || ['meadow']
    }
    return Object.keys(AREAS)
  }

  _spawnInitial() {
    const unlocked = this._getUnlockedAreas()
    for (const [areaId, area] of Object.entries(AREAS)) {
      if (!unlocked.includes(areaId)) continue
      const animalIds = area.animals || []
      const count = Math.min(MAX_ANIMALS_PER_ZONE, animalIds.length)
      for (let i = 0; i < count; i++) {
        const speciesId = animalIds[i % animalIds.length]
        this._spawnAnimal(speciesId, areaId)
      }
    }
  }

  _spawnAnimal(speciesId, zoneId) {
    const pos = this._findSpawnPos(zoneId)
    if (!pos) return
    const sprite = ANIMAL_SPRITES[speciesId]
    const size = sprite?.size || 12
    const animal = new Animal(nextAnimalId++, speciesId, pos.x, pos.y, size)
    this.animals.push(animal)
  }

  _findSpawnPos(zoneId) {
    for (let attempt = 0; attempt < 50; attempt++) {
      const col = Math.floor(Math.random() * this.zoneMap[0].length)
      const row = Math.floor(Math.random() * this.zoneMap.length)
      if (this.zoneMap[row]?.[col] !== zoneId) continue
      const gt = this.groundLayer[row]?.[col] ?? 0
      const ot = this.objectLayer[row]?.[col] ?? 0
      if (SOLID_TILES.has(gt) || SOLID_TILES.has(ot)) continue
      return { x: col * TILE_SIZE, y: row * TILE_SIZE }
    }
    return null
  }

  update(dt, playerX, playerY) {
    for (const animal of this.animals) {
      animal.update(dt, playerX, playerY, this.groundLayer, this.objectLayer)
    }
    this.animals = this.animals.filter(a => !a.dead)

    this.respawnTimer += dt
    if (this.respawnTimer >= RESPAWN_INTERVAL) {
      this.respawnTimer = 0
      this._tryRespawn()
    }
  }

  _tryRespawn() {
    const unlocked = this._getUnlockedAreas()
    for (const [areaId, area] of Object.entries(AREAS)) {
      if (!unlocked.includes(areaId)) continue
      const inZone = this.animals.filter(a => {
        const zone = getZoneAt(this.zoneMap, a.cx, a.cy)
        return zone === areaId
      })
      if (inZone.length < MAX_ANIMALS_PER_ZONE) {
        const animalIds = area.animals || []
        const pick = animalIds[Math.floor(Math.random() * animalIds.length)]
        if (pick) this._spawnAnimal(pick, areaId)
      }
    }
  }

  getNearestEncounterable(playerX, playerY) {
    let nearest = null
    let nearestDist = Infinity
    for (const animal of this.animals) {
      if (animal.dead || animal.isFleeing) continue
      const d = dist(playerX, playerY, animal.cx, animal.cy)
      if (d < ANIMAL_ENCOUNTER_RADIUS && d < nearestDist) {
        nearest = animal
        nearestDist = d
      }
    }
    return nearest ? { animal: nearest, distance: nearestDist } : null
  }

  instantFleeAnimal(animalId, playerX, playerY) {
    const a = this.animals.find(a => a.id === animalId)
    if (a) a.instantFlee(playerX, playerY)
  }

  removeAnimal(animalId) {
    const a = this.animals.find(a => a.id === animalId)
    if (a) a.dead = true
  }
}
