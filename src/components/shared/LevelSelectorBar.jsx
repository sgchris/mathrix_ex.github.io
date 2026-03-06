import { useContext } from 'react'
import { AppContext } from '../../context/useApp'
import './LevelSelectorBar.css'

const LEVELS = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

export default function LevelSelectorBar() {
  const { appState, dispatch, topics } = useContext(AppContext)
  const selectedLevel = appState.selectedLevel || 'easy'

  function handleSelect(level) {
    const topicData = topics.find(t => t.id === appState.activeTopic)
    dispatch({
      type: 'SET_LEVEL',
      payload: { level, exercises: topicData?.exercises || [] },
    })
  }

  return (
    <div className="level-selector-bar">
      <span className="level-selector-bar__label">Difficulty:</span>
      <div className="level-selector-bar__pills">
        {LEVELS.map(({ id, label }) => (
          <button
            key={id}
            className={`level-pill level-pill--${id}${selectedLevel === id ? ' level-pill--active' : ''}`}
            onClick={() => handleSelect(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
