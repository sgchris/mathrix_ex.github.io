import { useContext } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { AppContext } from '../../context/useApp'
import './ExerciseHistorySidebar.css'

export default function ExerciseHistorySidebar() {
  const { appState, dispatch, topics } = useContext(AppContext)
  const { activeTopic, activeExerciseId, topicHistory, exerciseStates } = appState

  if (!activeTopic) return null

  const history = topicHistory[activeTopic] || []
  const topicData = topics.find(t => t.id === activeTopic)

  function getLevelFromId(exerciseId) {
    if (exerciseId?.includes('-easy-')) return 'easy'
    if (exerciseId?.includes('-medium-')) return 'medium'
    if (exerciseId?.includes('-hard-')) return 'hard'
    return null
  }

  function handleSelect(exerciseId) {
    dispatch({ type: 'SELECT_EXERCISE', payload: { exerciseId } })
  }

  function getStatusIcon(exerciseId) {
    const exState = exerciseStates[exerciseId]
    if (!exState) return null
    if (exState.status === 'solved') {
      return <CheckIcon className="history-status history-status--success" />
    }
    if (exState.status === 'failed') {
      return <XMarkIcon className="history-status history-status--danger" />
    }
    return null
  }

  return (
    <aside className="history-sidebar">
      <div className="history-sidebar__header">
        <span className="history-sidebar__title">{topicData?.name ?? activeTopic}</span>
        <span className="history-sidebar__count">{history.length} exercise{history.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="history-sidebar__list">
        {history.map((exerciseId, index) => (
          <button
            key={exerciseId}
            className={`history-item${activeExerciseId === exerciseId ? ' history-item--active' : ''}`}
            onClick={() => handleSelect(exerciseId)}
          >
            <span className="history-item__number">#{index + 1}</span>
            {getLevelFromId(exerciseId) && (
              <span
                className={`level-dot level-dot--${getLevelFromId(exerciseId)}`}
                title={getLevelFromId(exerciseId)}
              />
            )}
            <span className="history-item__label">Exercise {index + 1}</span>
            <span className="history-item__status">{getStatusIcon(exerciseId)}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
