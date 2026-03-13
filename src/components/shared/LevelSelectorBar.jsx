import { useContext } from 'react'
import { AppContext } from '../../context/useApp'
import { DEFAULT_LEVEL_ID, getAvailableLevels, resolveTopicLevel } from '../../utils/levels'
import './LevelSelectorBar.css'

export default function LevelSelectorBar() {
  const { appState, dispatch, topics, t } = useContext(AppContext)
  const topicData = topics.find(topic => topic.id === appState.activeTopic)
  const availableLevels = getAvailableLevels(topicData?.exercises || [])
  const selectedLevel = resolveTopicLevel(
    topicData?.exercises || [],
    appState.selectedLevel || DEFAULT_LEVEL_ID
  )

  function handleSelect(level) {
    dispatch({
      type: 'SET_LEVEL',
      payload: { level, exercises: topicData?.exercises || [] },
    })
  }

  return (
    <div className="level-selector-bar">
      <span className="level-selector-bar__label">{t('difficulty')}</span>
      <div className="level-selector-bar__pills">
        {availableLevels.map(({ id }) => (
          <button
            key={id}
            className={`level-pill level-pill--${id}${selectedLevel === id ? ' level-pill--active' : ''}`}
            onClick={() => handleSelect(id)}
            disabled={selectedLevel === id}
          >
            {t(`levels.${id}`)}
          </button>
        ))}
      </div>
    </div>
  )
}
