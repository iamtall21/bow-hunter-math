import { describe, it, expect } from 'vitest'
import { generateQuestion, getTimerSeconds, TOPICS, GRADE_LEVELS } from '../data/mathTemplates'

describe('TOPICS', () => {
  it('has all expected topic keys', () => {
    expect(Object.keys(TOPICS)).toEqual(
      expect.arrayContaining(['all', 'multiplication', 'division', 'addition', 'fractions', 'ratios', 'percentages', 'multi_step'])
    )
  })
})

describe('GRADE_LEVELS', () => {
  it('has grades 3 through 6', () => {
    expect(GRADE_LEVELS[3]).toBeDefined()
    expect(GRADE_LEVELS[4]).toBeDefined()
    expect(GRADE_LEVELS[5]).toBeDefined()
    expect(GRADE_LEVELS[6]).toBeDefined()
  })

  it('each grade has a label and baseTier', () => {
    Object.entries(GRADE_LEVELS).forEach(([grade, info]) => {
      expect(info.label, `Grade ${grade} missing label`).toBeTruthy()
      expect(info.baseTier, `Grade ${grade} missing baseTier`).toBeGreaterThanOrEqual(1)
      expect(info.baseTier).toBeLessThanOrEqual(3)
    })
  })
})

describe('generateQuestion', () => {
  it('returns an object with question, answer, hint, tier, topic', () => {
    const q = generateQuestion(1)
    expect(q).toHaveProperty('question')
    expect(q).toHaveProperty('answer')
    expect(q).toHaveProperty('hint')
    expect(q).toHaveProperty('tier')
    expect(q).toHaveProperty('topic')
  })

  it('generates finite positive answers for tier 1', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion(1)
      expect(Number.isFinite(q.answer)).toBe(true)
      expect(q.answer).toBeGreaterThan(0)
    }
  })

  it('respects tier filtering — tier 1 only returns tier 1', () => {
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion(1)
      expect(q.tier).toBe(1)
    }
  })

  it('tier 2 returns tier 1 or 2', () => {
    for (let i = 0; i < 50; i++) {
      const q = generateQuestion(2)
      expect(q.tier).toBeLessThanOrEqual(2)
    }
  })

  it('tier 3 returns tier 1, 2, or 3', () => {
    for (let i = 0; i < 50; i++) {
      const q = generateQuestion(3)
      expect(q.tier).toBeLessThanOrEqual(3)
    }
  })

  it('filters by topic when specified', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion(3, 'multiplication')
      expect(q.topic).toBe('multiplication')
    }
  })

  // Every topic should have templates at every tier (no silent fallback)
  const realTopics = Object.keys(TOPICS).filter((t) => t !== 'all')
  for (const topic of realTopics) {
    for (const tier of [1, 2, 3]) {
      it(`topic "${topic}" returns matching questions at tier ${tier}`, () => {
        for (let i = 0; i < 10; i++) {
          const q = generateQuestion(tier, topic)
          expect(q.topic).toBe(topic)
        }
      })
    }
  }

  it('generates questions that never crash (stress test)', () => {
    for (let i = 0; i < 200; i++) {
      const tier = 1 + Math.floor(Math.random() * 3)
      const topics = Object.keys(TOPICS)
      const topic = topics[Math.floor(Math.random() * topics.length)]
      const q = generateQuestion(tier, topic)
      expect(typeof q.question).toBe('string')
      expect(q.question.length).toBeGreaterThan(10)
      expect(Number.isFinite(q.answer)).toBe(true)
    }
  })
})

describe('getTimerSeconds', () => {
  it('returns 30 for easy', () => {
    expect(getTimerSeconds('easy')).toBe(30)
  })

  it('returns 20 for normal', () => {
    expect(getTimerSeconds('normal')).toBe(20)
  })

  it('returns 12 for hunter', () => {
    expect(getTimerSeconds('hunter')).toBe(12)
  })

  it('returns 20 for unknown difficulty', () => {
    expect(getTimerSeconds('unknown')).toBe(20)
  })
})
