import { useGameStore } from './store/gameStore'
import TitleScreen from './screens/TitleScreen'
import CampScreen from './screens/CampScreen'
import CraftingScreen from './screens/CraftingScreen'
import OverworldCanvas from './engine/OverworldCanvas'
import './App.css'

function App() {
  const screen = useGameStore((s) => s.screen)

  switch (screen) {
    case 'title':
      return <TitleScreen />
    case 'overworld':
      return <OverworldCanvas />
    case 'camp':
      return <CampScreen />
    case 'crafting':
      return <CraftingScreen />
    default:
      return <TitleScreen />
  }
}

export default App
