import { useContext } from 'react'
import { AppContext } from '../../context/useApp'
import './TopicSidebar.css'

const TOPIC_SYMBOLS = {
  algebra: 'x²',
  fractions: '½',
  percentages: '%',
}

export default function TopicSidebar() {
  const { appState, dispatch, topics } = useContext(AppContext)

  function handleSelectTopic(topic) {
    dispatch({
      type: 'SELECT_TOPIC',
      payload: {
        topicId: topic.id,
        exercises: topic.exercises,
        selectedLevel: appState.selectedLevel || 'easy',
      },
    })
  }

  return (
    <aside className="topic-sidebar">
      <div className="topic-sidebar__logo">
        <img src={`${import.meta.env.BASE_URL}mathrix_logo_100.png`} alt="Mathrix logo" className="topic-sidebar__logo-img" />
        <span className="topic-sidebar__logo-text">Mathrix</span>
      </div>
      <nav className="topic-sidebar__nav">
        {topics.map(topic => (
          <button
            key={topic.id}
            className={`topic-item${appState.activeTopic === topic.id ? ' topic-item--active' : ''}`}
            onClick={() => handleSelectTopic(topic)}
          >
            <span className="topic-item__symbol">{TOPIC_SYMBOLS[topic.id] || '#'}</span>
            <span className="topic-item__name">{topic.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
