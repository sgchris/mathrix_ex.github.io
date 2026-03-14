function getStateExplanation(skill, t) {
  if (!skill) return ''

  if (skill.state === 'mastered') return t('mastery.detail.explanations.mastered')
  if (skill.state === 'almost_mastered') return t('mastery.detail.explanations.almost_mastered')
  if (skill.state === 'needs_review') return t('mastery.detail.explanations.needs_review')
  if (skill.state === 'practicing') return t('mastery.detail.explanations.practicing')
  return t('mastery.detail.explanations.not_started')
}

function getHintRelianceLabel(skill, t) {
  if (!skill || skill.sampleCount === 0) return t('mastery.detail.progress.none')
  if (skill.hintAverage < 0.5) return t('mastery.detail.progress.low')
  if (skill.hintAverage < 1.3) return t('mastery.detail.progress.medium')
  return t('mastery.detail.progress.high')
}

function getAccuracyLabel(skill, t) {
  if (!skill || skill.sampleCount === 0) return t('mastery.detail.progress.none')
  if (skill.masteryPercent >= 75) return t('mastery.detail.progress.strong')
  if (skill.masteryPercent >= 50) return t('mastery.detail.progress.steady')
  return t('mastery.detail.progress.building')
}

function getOutcomeLabel(outcome, t) {
  if (outcome === 'solved') return t('mastery.outcomes.solved')
  if (outcome === 'failed') return t('mastery.outcomes.failed')
  if (outcome === 'explained') return t('mastery.outcomes.explained')
  return t('mastery.outcomes.in_progress')
}

export default function SkillDetailPanel({
  skill,
  t,
  onClose,
  onPractice,
  onReviewPrevious,
  canReviewPrevious,
  getRecencyLabel,
  getSkillLabel,
}) {
  if (!skill) {
    return (
      <aside className="skill-detail-panel skill-detail-panel--empty">
        <h3>{t('mastery.detail.emptyTitle')}</h3>
        <p>{t('mastery.detail.emptyDescription')}</p>
      </aside>
    )
  }

  return (
    <>
      <button className="skill-detail-panel__backdrop" onClick={onClose} aria-label={t('mastery.actions.closeDetails')} />
      <aside className="skill-detail-panel">
        <div className="skill-detail-panel__header">
          <div>
            <p className="skill-detail-panel__topic">{skill.topicName}</p>
            <h3>{getSkillLabel(skill)}</h3>
            <span className={`skill-detail-panel__badge skill-detail-panel__badge--${skill.state}`}>
              {t(`mastery.states.${skill.state}`)}
            </span>
          </div>
          <button className="skill-detail-panel__close" onClick={onClose}>
            {t('mastery.actions.closeDetails')}
          </button>
        </div>

        <p className="skill-detail-panel__summary">{getStateExplanation(skill, t)}</p>

        <div className="skill-detail-panel__metrics">
          <div>
            <span>{t('mastery.detail.metrics.accuracy')}</span>
            <strong>{getAccuracyLabel(skill, t)}</strong>
          </div>
          <div>
            <span>{t('mastery.detail.metrics.hints')}</span>
            <strong>{getHintRelianceLabel(skill, t)}</strong>
          </div>
          <div>
            <span>{t('mastery.detail.metrics.recency')}</span>
            <strong>{getRecencyLabel(skill.lastPracticedAt)}</strong>
          </div>
        </div>

        <div className="skill-detail-panel__actions">
          <button className="mastery-primary-button" onClick={onPractice}>
            {t('mastery.actions.practiceNow')}
          </button>
          {canReviewPrevious && ['needs_review', 'practicing'].includes(skill.state) && (
            <button className="mastery-secondary-button" onClick={onReviewPrevious}>
              {t('mastery.actions.reviewPrevious')}
            </button>
          )}
        </div>

        <div className="skill-detail-panel__activity">
          <h4>{t('mastery.detail.recentActivity')}</h4>
          {skill.recentActivities.length > 0 ? (
            <div className="skill-detail-panel__activity-list">
              {skill.recentActivities.map(activity => (
                <span key={activity.exerciseId} className={`skill-detail-panel__activity-chip skill-detail-panel__activity-chip--${activity.outcome}`}>
                  {t(`levels.${activity.levelId}`)} · {getOutcomeLabel(activity.outcome, t)}
                </span>
              ))}
            </div>
          ) : (
            <p>{t('mastery.detail.noRecentActivity')}</p>
          )}
        </div>
      </aside>
    </>
  )
}