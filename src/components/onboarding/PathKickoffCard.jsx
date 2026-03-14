import { getPathSubtitleKey, getPathTitleKey } from '../../utils/onboarding'
import PathBadge from './PathBadge'

function getTopicName(topics, topicId) {
  return topics.find(topic => topic.id === topicId)?.name || topicId
}

export default function PathKickoffCard({ profile, topics, t, onStartExercise, onOpenOverview }) {
  const firstTopic = profile.recommendedTopics[0]

  return (
    <section className="onboarding-card onboarding-card--kickoff">
      <span className="onboarding-card__eyebrow">{t('onboarding.stepLabel', { current: 5, total: 5 })}</span>
      <h2>{t('onboarding.kickoff.title', { pathTitle: t(getPathTitleKey(profile.recommendedGradeBand)) })}</h2>
      <p>{t(getPathSubtitleKey(profile.recommendedGradeBand))}</p>

      <div className="result-path-preview">
        {profile.recommendedTopics.slice(0, 3).map((topicId, index) => (
          <PathBadge key={topicId} index={index} label={getTopicName(topics, topicId)} />
        ))}
      </div>

      <div className="kickoff-meta">
        <div>
          <span>{t('onboarding.kickoff.startingDifficulty')}</span>
          <strong>{t(`levels.${profile.recommendedLevelsByTopic[firstTopic]}`)}</strong>
        </div>
        <div>
          <span>{t('onboarding.kickoff.sessionGoalLabel')}</span>
          <strong>{t('onboarding.kickoff.sessionGoal')}</strong>
        </div>
      </div>

      <div className="onboarding-card__actions onboarding-card__actions--stacked-mobile">
        <button className="onboarding-button onboarding-button--primary" onClick={onStartExercise}>
          {t('onboarding.kickoff.startFirstExercise')}
        </button>
        <button className="onboarding-button onboarding-button--secondary" onClick={onOpenOverview}>
          {t('onboarding.kickoff.openOverview')}
        </button>
      </div>
    </section>
  )
}