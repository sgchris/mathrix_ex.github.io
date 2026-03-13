import { useContext } from 'react'
import { AppContext } from '../../context/useApp'
import { getSupportedLocales } from '../../utils/localization'
import { DEFAULT_LEVEL_ID, resolveTopicLevel } from '../../utils/levels'
import './TopicSidebar.css'

const TOPIC_SYMBOLS = {
  algebra: 'x²',
  'arithmetic-progression': 'aₙ',
  fractions: '½',
  decimals: '0.1',
  percentages: '%',
}

export default function TopicSidebar() {
  const { appState, dispatch, topics, language, setLanguage, t } = useContext(AppContext)
  const localeOptions = getSupportedLocales()

  function handleSelectTopic(topic) {
    dispatch({
      type: 'SELECT_TOPIC',
      payload: {
        topicId: topic.id,
        exercises: topic.exercises,
        selectedLevel: resolveTopicLevel(
          topic.exercises,
          appState.selectedLevel || DEFAULT_LEVEL_ID
        ),
      },
    })
  }

  return (
    <aside className="topic-sidebar">
      <div className="topic-sidebar__logo">
        <img src={`${import.meta.env.BASE_URL}mathrix_logo_100.png`} alt={t('mathrixLogoAlt')} className="topic-sidebar__logo-img" />
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
      <div className="topic-sidebar__footer">
        <label className="topic-sidebar__field-label" htmlFor="language-select">
          {t('languageLabel')}
        </label>
        <select
          id="language-select"
          className="topic-sidebar__select"
          value={language}
          onChange={event => setLanguage(event.target.value)}
        >
          {localeOptions.map(locale => (
            <option key={locale.id} value={locale.id}>
              {locale.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  )
}
