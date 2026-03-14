import { useMemo, useState } from 'react'
import { getAvailableLevels } from '../../utils/levels'
import {
  GRADE_BAND_OPTIONS,
  buildManualLearnerProfile,
  getPathConfig,
  getPathSubtitleKey,
  getPathTitleKey,
} from '../../utils/onboarding'
import PathBadge from './PathBadge'

function getTopicName(topics, topicId) {
  return topics.find(topic => topic.id === topicId)?.name || topicId
}

export default function PlacementResultCard({ onboarding, topics, dispatch, t }) {
  const initialTopic = onboarding.learnerProfile.recommendedTopics[0] || ''
  const initialBand = onboarding.learnerProfile.recommendedGradeBand || 'grade6'
  const [showHowChosen, setShowHowChosen] = useState(false)
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [adjustBand, setAdjustBand] = useState(initialBand)
  const [adjustTopic, setAdjustTopic] = useState(initialTopic)
  const [adjustLevel, setAdjustLevel] = useState(onboarding.learnerProfile.recommendedLevelsByTopic?.[initialTopic] || 'level01')

  const adjustmentTopics = useMemo(() => {
    const config = getPathConfig(adjustBand)
    return config.topics
  }, [adjustBand])

  const levelOptions = useMemo(() => {
    const topic = topics.find(entry => entry.id === adjustTopic)
    return getAvailableLevels(topic?.exercises || [])
  }, [adjustTopic, topics])

  const confidence = onboarding.diagnostic.confidence || 'medium'
  const profile = onboarding.learnerProfile
  const pathTitle = t(getPathTitleKey(profile.recommendedGradeBand))

  function handleApplyAdjustment() {
    dispatch({
      type: 'APPLY_MANUAL_PATH',
      payload: {
        profile: buildManualLearnerProfile(adjustBand, adjustTopic, adjustLevel),
      },
    })
    setIsAdjusting(false)
  }

  return (
    <section className="onboarding-card onboarding-card--result">
      <span className="onboarding-card__eyebrow">{t('onboarding.stepLabel', { current: 4, total: 5 })}</span>
      <h2>{t('onboarding.result.readyFor', { pathTitle })}</h2>
      <p>{t(getPathSubtitleKey(profile.recommendedGradeBand))}</p>

      <div className="placement-confidence">
        <div className="placement-confidence__bar">
          <span style={{ width: `${profile.confidenceScore}%` }} />
        </div>
        <strong>{t(`onboarding.confidence.${confidence}`)}</strong>
      </div>

      <div className="placement-chip-group">
        <div>
          <h3>{t('onboarding.result.strengths')}</h3>
          <div className="placement-chip-row">
            {profile.strengths.map(topicId => (
              <span key={topicId} className="placement-chip placement-chip--strength">
                {getTopicName(topics, topicId)}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3>{t('onboarding.result.growthAreas')}</h3>
          <div className="placement-chip-row">
            {profile.growthAreas.map(topicId => (
              <span key={topicId} className="placement-chip placement-chip--growth">
                {getTopicName(topics, topicId)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="result-path-preview">
        {profile.recommendedTopics.map((topicId, index) => (
          <PathBadge
            key={topicId}
            index={index}
            label={`${getTopicName(topics, topicId)} • ${t(`levels.${profile.recommendedLevelsByTopic[topicId]}`)}`}
          />
        ))}
      </div>

      <div className="onboarding-card__actions onboarding-card__actions--stacked-mobile">
        <button className="onboarding-button onboarding-button--primary" onClick={() => dispatch({ type: 'SET_ONBOARDING_STEP', payload: { step: 'kickoff', status: 'in_progress' } })}>
          {t('onboarding.result.startPath')}
        </button>
        <button className="onboarding-button onboarding-button--secondary" onClick={() => setIsAdjusting(current => !current)}>
          {t('onboarding.result.adjustStartingPoint')}
        </button>
        <button className="diagnostic-link" type="button" onClick={() => setShowHowChosen(current => !current)}>
          {t('onboarding.result.seeHowChosen')}
        </button>
      </div>

      {showHowChosen ? (
        <div className="result-explanation">
          <p>{t('onboarding.result.howChosenSummary')}</p>
          <ul>
            <li>{t('onboarding.result.howChosenGradeBand', { gradeBand: t(`onboarding.gradeBands.${onboarding.selectedGradeBand}.label`) })}</li>
            <li>{t('onboarding.result.howChosenAnswered', { count: onboarding.diagnostic.answers.filter(answer => !answer.skipped).length })}</li>
            <li>{t('onboarding.result.howChosenSkips', { count: onboarding.diagnostic.answers.filter(answer => answer.skipped).length })}</li>
          </ul>
        </div>
      ) : null}

      {isAdjusting ? (
        <aside className="adjustment-panel" aria-label={t('onboarding.result.adjustStartingPoint')}>
          <div className="adjustment-panel__header">
            <h3>{t('onboarding.result.adjustTitle')}</h3>
            <button className="diagnostic-link" type="button" onClick={() => setIsAdjusting(false)}>
              {t('onboarding.common.cancel')}
            </button>
          </div>

          <label className="adjustment-panel__field">
            <span>{t('onboarding.result.adjustGradeBand')}</span>
            <select
              value={adjustBand}
              onChange={event => {
                const nextBand = event.target.value
                const nextTopic = getPathConfig(nextBand).topics[0]
                setAdjustBand(nextBand)
                setAdjustTopic(nextTopic)
                setAdjustLevel(getPathConfig(nextBand).levels[nextTopic])
              }}
            >
              {GRADE_BAND_OPTIONS.filter(option => option.id !== 'unsure').map(option => (
                <option key={option.id} value={option.id}>{t(`onboarding.gradeBands.${option.id}.label`)}</option>
              ))}
            </select>
          </label>

          <label className="adjustment-panel__field">
            <span>{t('onboarding.result.adjustTopic')}</span>
            <select
              value={adjustTopic}
              onChange={event => {
                const nextTopic = event.target.value
                setAdjustTopic(nextTopic)
                setAdjustLevel(getPathConfig(adjustBand).levels[nextTopic])
              }}
            >
              {adjustmentTopics.map(topicId => (
                <option key={topicId} value={topicId}>{getTopicName(topics, topicId)}</option>
              ))}
            </select>
          </label>

          <label className="adjustment-panel__field">
            <span>{t('onboarding.result.adjustLevel')}</span>
            <select value={adjustLevel} onChange={event => setAdjustLevel(event.target.value)}>
              {levelOptions.map(level => (
                <option key={level.id} value={level.id}>{t(`levels.${level.id}`)}</option>
              ))}
            </select>
          </label>

          <button className="onboarding-button onboarding-button--primary" type="button" onClick={handleApplyAdjustment}>
            {t('onboarding.result.applyAdjustment')}
          </button>
        </aside>
      ) : null}
    </section>
  )
}