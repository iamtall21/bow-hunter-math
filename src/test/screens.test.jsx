import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useGameStore } from '../store/gameStore'
import TitleScreen from '../screens/TitleScreen'
import CampScreen from '../screens/CampScreen'
import ExpeditionScreen from '../screens/ExpeditionScreen'
import CraftingScreen from '../screens/CraftingScreen'
import FishingScreen from '../screens/FishingScreen'
import App from '../App'

beforeEach(() => {
  localStorage.clear()
  useGameStore.setState({
    playerName: 'TestHunter',
    honor: 0,
    rankIndex: 0,
    gradeLevel: 5,
    difficultyTier: 3,
    difficulty: 'normal',
    mathTopic: 'all',
    inventory: {
      stick: 6, flint: 10, feather: 20, sinew: 4,
      ash_branch: 1, grip_wrap: 1, arrow: 5, bow: 0,
      meat: 0, pelt: 0, willow: 0, cord: 0, spear: 1,
    },
    craftedItems: {},
    unlockedAreas: ['meadow'],
    completedQuests: [],
    perfectStreak: 0,
    stats: {
      totalHunts: 0, perfectShots: 0, totalCorrect: 0,
      totalAttempted: 0, animalsHarvested: {}, totalCrafted: {},
      totalFishCaught: 0, fishHarvested: {},
    },
    recentAccuracy: [],
    screen: 'title',
    initialized: false,
  })
})

describe('TitleScreen', () => {
  it('renders without crashing', () => {
    render(<TitleScreen />)
    expect(screen.getByText(/bow hunter/i)).toBeInTheDocument()
  })
})

describe('CampScreen', () => {
  it('renders player name and camp elements', () => {
    useGameStore.setState({ screen: 'camp', initialized: true })
    render(<CampScreen />)
    expect(screen.getByText(/TestHunter's Camp/i)).toBeInTheDocument()
    expect(screen.getByText(/Go Hunting/i)).toBeInTheDocument()
    expect(screen.getByText(/Crafting Bench/i)).toBeInTheDocument()
  })

  it('shows arrow count', () => {
    useGameStore.setState({ screen: 'camp', initialized: true })
    render(<CampScreen />)
    expect(screen.getByText(/5 arrows ready/i)).toBeInTheDocument()
  })

  it('shows grade level picker', () => {
    useGameStore.setState({ screen: 'camp', initialized: true })
    render(<CampScreen />)
    expect(screen.getAllByText(/Grade Level/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/3rd Grade/i)).toBeInTheDocument()
    expect(screen.getByText(/6th Grade/i)).toBeInTheDocument()
  })

  it('shows warning when no arrows', () => {
    useGameStore.setState({
      screen: 'camp', initialized: true,
      inventory: { ...useGameStore.getState().inventory, arrow: 0 },
    })
    render(<CampScreen />)
    expect(screen.getByText(/No arrows/i)).toBeInTheDocument()
  })

  it('shows Go Fishing button', () => {
    useGameStore.setState({ screen: 'camp', initialized: true })
    render(<CampScreen />)
    expect(screen.getByText(/Go Fishing/i)).toBeInTheDocument()
  })

  it('shows spear count', () => {
    useGameStore.setState({ screen: 'camp', initialized: true })
    render(<CampScreen />)
    expect(screen.getByText(/1 spear ready/i)).toBeInTheDocument()
  })

  it('shows warning when no spears', () => {
    useGameStore.setState({
      screen: 'camp', initialized: true,
      inventory: { ...useGameStore.getState().inventory, spear: 0 },
    })
    render(<CampScreen />)
    expect(screen.getByText(/No spears/i)).toBeInTheDocument()
  })
})

describe('ExpeditionScreen', () => {
  it('renders without crashing (the blank screen bug fix)', () => {
    useGameStore.setState({ screen: 'expedition', initialized: true })
    const { container } = render(<ExpeditionScreen />)
    expect(container.querySelector('.expedition-screen')).toBeInTheDocument()
  })

  it('shows scouting phase initially', () => {
    useGameStore.setState({ screen: 'expedition', initialized: true })
    render(<ExpeditionScreen />)
    expect(screen.getByText(/scanning for movement/i)).toBeInTheDocument()
    expect(screen.getByText(/Keep Tracking/i)).toBeInTheDocument()
  })

  it('shows Back to Camp button', () => {
    useGameStore.setState({ screen: 'expedition', initialized: true })
    render(<ExpeditionScreen />)
    expect(screen.getByText(/Back to Camp/i)).toBeInTheDocument()
  })

  it('shows arrow count in header', () => {
    useGameStore.setState({ screen: 'expedition', initialized: true })
    render(<ExpeditionScreen />)
    expect(screen.getByText(/Arrows: 5/i)).toBeInTheDocument()
  })
})

describe('FishingScreen', () => {
  it('renders without crashing', () => {
    useGameStore.setState({ screen: 'fishing', initialized: true })
    const { container } = render(<FishingScreen />)
    expect(container.querySelector('.fishing-screen')).toBeInTheDocument()
  })

  it('shows wading phase initially', () => {
    useGameStore.setState({ screen: 'fishing', initialized: true })
    render(<FishingScreen />)
    expect(screen.getByText(/wade into the shallows/i)).toBeInTheDocument()
    expect(screen.getByText(/Search for Fish/i)).toBeInTheDocument()
  })

  it('shows Back to Camp button', () => {
    useGameStore.setState({ screen: 'fishing', initialized: true })
    render(<FishingScreen />)
    expect(screen.getByText(/Back to Camp/i)).toBeInTheDocument()
  })

  it('shows spear count in header', () => {
    useGameStore.setState({ screen: 'fishing', initialized: true })
    render(<FishingScreen />)
    expect(screen.getByText(/Spears: 1/i)).toBeInTheDocument()
  })
})

describe('CraftingScreen', () => {
  it('renders without crashing', () => {
    useGameStore.setState({ screen: 'crafting', initialized: true })
    render(<CraftingScreen />)
    expect(screen.getByText(/Crafting Bench/i)).toBeInTheDocument()
  })
})

describe('App routing', () => {
  it('renders TitleScreen by default', () => {
    render(<App />)
    expect(screen.getByText(/bow hunter/i)).toBeInTheDocument()
  })

  it('renders CampScreen when screen is camp', () => {
    useGameStore.setState({ screen: 'camp', playerName: 'TestHunter', initialized: true })
    render(<App />)
    expect(screen.getByText(/TestHunter's Camp/i)).toBeInTheDocument()
  })

  it('renders ExpeditionScreen when screen is expedition', () => {
    useGameStore.setState({ screen: 'expedition', initialized: true })
    render(<App />)
    expect(screen.getByText(/Back to Camp/i)).toBeInTheDocument()
  })

  it('renders CraftingScreen when screen is crafting', () => {
    useGameStore.setState({ screen: 'crafting', initialized: true })
    render(<App />)
    expect(screen.getByText(/Crafting Bench/i)).toBeInTheDocument()
  })

  it('renders FishingScreen when screen is fishing', () => {
    useGameStore.setState({ screen: 'fishing', initialized: true })
    render(<App />)
    expect(screen.getByText(/Search for Fish/i)).toBeInTheDocument()
  })
})
