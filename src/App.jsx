import { useContext, useState } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import AppProvider from './context/AppContext'
import { AppContext } from './context/useApp'
import TopicSidebar from './components/TopicSidebar/TopicSidebar'
import ExerciseHistorySidebar from './components/ExerciseHistorySidebar/ExerciseHistorySidebar'
import ExerciseArea from './components/ExerciseArea/ExerciseArea'
import MobileDrawer from './components/shared/MobileDrawer'
import './App.css'

function AppLayout() {
  const { appState } = useContext(AppContext)
  const hasActiveTopic = !!appState.activeTopic
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const toggleDrawer = () => setIsMobileDrawerOpen(!isMobileDrawerOpen)
  const closeDrawer = () => setIsMobileDrawerOpen(false)

  return (
    <>
      <div className={`app-layout${hasActiveTopic ? ' has-history' : ''}`}>       
        <TopicSidebar />
        {hasActiveTopic && <ExerciseHistorySidebar />}
        <main className="main-area">
          <div className="mobile-app-bar">
            <button className="mobile-app-bar__menu" onClick={toggleDrawer} aria-label="Open menu">
              <Bars3Icon style={{ width: '24px', height: '24px' }} />
            </button>
            <span className="mobile-app-bar__title">Mathrix</span>
          </div>
          <ExerciseArea />
        </main>
      </div>
      
      <MobileDrawer isOpen={isMobileDrawerOpen} onClose={closeDrawer}>
        <div onClick={closeDrawer}>
          <TopicSidebar />
        </div>
        {hasActiveTopic && (
          <div onClick={closeDrawer}>
            <ExerciseHistorySidebar />
          </div>
        )}
      </MobileDrawer>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  )
}
