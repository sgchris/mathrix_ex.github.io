import { useContext } from 'react'
import { AppContext } from '../../context/useApp'
import { getSupportedLocales } from '../../utils/localization'
import { getPathTitleKey } from '../../utils/onboarding'
import { DEFAULT_LEVEL_ID, resolveTopicLevel } from '../../utils/levels'
import AuthPanel from '../shared/AuthPanel'
import PathBadge from '../onboarding/PathBadge'
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
  const pathTopics = appState.onboarding.learnerProfile.recommendedTopics || []
  const hasPath = appState.onboarding.status === 'completed' && pathTopics.length > 0

  function openMasteryMap() {
    dispatch({
      type: 'OPEN_MASTERY_MAP',
      payload: {
        mastery: {
          selectedSkillId: null,
          filters: {
            ...appState.mastery.filters,
            gradeBand: appState.onboarding.learnerProfile.recommendedGradeBand || 'all',
          },
          expandedTopicIds: pathTopics,
        },
      },
    })
  }

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
      {appState.onboarding.status !== 'completed' && (
        <div className="topic-sidebar__quick-checkup">
          <button
            className="topic-sidebar__quick-checkup-btn"
            onClick={() => dispatch({ type: 'RESET_ONBOARDING' })}
          >
            {t('onboarding.sidebar.quickCheckup')}
          </button>
        </div>
      )}
      <div className="topic-sidebar__mastery-map">
        <button
          className={`topic-sidebar__mastery-map-btn${appState.appView === 'masteryMap' ? ' topic-sidebar__mastery-map-btn--active' : ''}`}
          onClick={openMasteryMap}
        >
          {t('mastery.title')}
        </button>
      </div>
      <nav className="topic-sidebar__nav">
        {hasPath && (
          <button className="topic-sidebar__path-section" onClick={openMasteryMap}>
            <span className="topic-sidebar__path-title">{t('onboarding.sidebar.yourPath')}</span>
            <strong className="topic-sidebar__path-name">{t(getPathTitleKey(appState.onboarding.learnerProfile.recommendedGradeBand))}</strong>
            <div className="topic-sidebar__path-badges">
              {pathTopics.map((topicId, index) => (
                <PathBadge
                  key={topicId}
                  index={index}
                  label={topics.find(topic => topic.id === topicId)?.name || topicId}
                  subtle={true}
                />
              ))}
            </div>
          </button>
        )}
        {topics.map(topic => (
          <button
            key={topic.id}
            className={`topic-item${appState.activeTopic === topic.id ? ' topic-item--active' : ''}`}
            onClick={() => handleSelectTopic(topic)}
          >
            <span className="topic-item__symbol">{TOPIC_SYMBOLS[topic.id] || '#'}</span>
            <span className="topic-item__name">{topic.name}</span>
            {pathTopics.includes(topic.id) && (
              <span className="topic-item__badge-wrap">
                <PathBadge index={pathTopics.indexOf(topic.id)} label="" subtle={true} />
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="topic-sidebar__footer">
        <AuthPanel />
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
