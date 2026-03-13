import { useContext } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { AppContext } from '../../context/useApp'
import { getExerciseLevelId } from '../../utils/levels'
import './ExerciseHistorySidebar.css'

export default function ExerciseHistorySidebar() {
  const { appState, dispatch, topics, t } = useContext(AppContext)
  const { activeTopic, activeExerciseId, topicHistory, exerciseStates } = appState

  if (!activeTopic) return null

  const history = topicHistory[activeTopic] || []
  const topicData = topics.find(t => t.id === activeTopic)

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
        <span className="history-sidebar__count">{t('history.count', { count: history.length })}</span>
      </div>
      <div className="history-sidebar__list">
        {history.map((exerciseId, index) => (
          (() => {
            const levelId = getExerciseLevelId(exerciseId)

            return (
              <button
                key={exerciseId}
                className={`history-item${activeExerciseId === exerciseId ? ' history-item--active' : ''}`}
                onClick={() => handleSelect(exerciseId)}
              >
                <span className="history-item__number">#{index + 1}</span>
                {levelId && (
                  <span
                    className={`level-dot level-dot--${levelId}`}
                    title={t(`levels.${levelId}`)}
                  />
                )}
                <span className="history-item__label">{t('history.exercise', { index: index + 1 })}</span>
                <span className="history-item__status">{getStatusIcon(exerciseId)}</span>
              </button>
            )
          })()
        ))}
      </div>
    </aside>
  )
}
