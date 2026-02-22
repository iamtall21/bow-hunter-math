import { useGameStore } from './store/gameStore'
import TitleScreen from './screens/TitleScreen'
import CampScreen from './screens/CampScreen'
import ExpeditionScreen from './screens/ExpeditionScreen'
import CraftingScreen from './screens/CraftingScreen'
import './App.css'

function App() {
  const screen = useGameStore((s) => s.screen)

  switch (screen) {
    case 'title':
      return <TitleScreen />
    case 'camp':
      return <CampScreen />
    case 'expedition':
      return <ExpeditionScreen />
    case 'crafting':
      return <CraftingScreen />
    default:
      return <TitleScreen />
  }
}

export default App
