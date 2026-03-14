export default function MasteryMapHeader({
  masteryData,
  recommendedSkill,
  summarySentence,
  onPracticeRecommended,
  onSeeAllTopics,
  onBackToPractice,
  t,
}) {
  const reviewCount = masteryData.stateCounts.needs_review || 0

  return (
    <header className="mastery-header">
      <div className="mastery-header__copy">
        <div>
          <p className="mastery-header__eyebrow">{t('mastery.eyebrow')}</p>
          <h1>{t('mastery.title')}</h1>
          <p>{summarySentence}</p>
        </div>
        <div className="mastery-header__actions">
          <button className="mastery-primary-button" onClick={onPracticeRecommended} disabled={!recommendedSkill}>
            {t('mastery.actions.practiceRecommended')}
          </button>
          <button className="mastery-secondary-button" onClick={onSeeAllTopics}>
            {t('mastery.actions.seeAllTopics')}
          </button>
          <button className="mastery-ghost-button" onClick={onBackToPractice}>
            {t('mastery.actions.backToPractice')}
          </button>
        </div>
      </div>

      <div className="mastery-header__stats">
        <div className="mastery-ring-card">
          <div className="mastery-ring-card__value">{masteryData.masteryCoverage}%</div>
          <div className="mastery-ring-card__label">{t('mastery.summary.coverage')}</div>
        </div>

        <div className="mastery-progress-card">
          <div className="mastery-progress-card__legend">
            <span>{t('mastery.summary.progress', { stable: masteryData.stableCount, total: masteryData.totalSkills })}</span>
            {reviewCount > 0 && <strong>{t('mastery.summary.reviewChip', { count: reviewCount })}</strong>}
          </div>
          <div className="mastery-progress-card__segments" aria-hidden="true">
            <span className="mastery-progress-card__segment mastery-progress-card__segment--mastered" style={{ width: `${(masteryData.stateCounts.mastered / Math.max(masteryData.totalSkills, 1)) * 100}%` }} />
            <span className="mastery-progress-card__segment mastery-progress-card__segment--almost" style={{ width: `${(masteryData.stateCounts.almost_mastered / Math.max(masteryData.totalSkills, 1)) * 100}%` }} />
            <span className="mastery-progress-card__segment mastery-progress-card__segment--practicing" style={{ width: `${(masteryData.stateCounts.practicing / Math.max(masteryData.totalSkills, 1)) * 100}%` }} />
            <span className="mastery-progress-card__segment mastery-progress-card__segment--review" style={{ width: `${(masteryData.stateCounts.needs_review / Math.max(masteryData.totalSkills, 1)) * 100}%` }} />
            <span className="mastery-progress-card__segment mastery-progress-card__segment--empty" style={{ width: `${(masteryData.stateCounts.not_started / Math.max(masteryData.totalSkills, 1)) * 100}%` }} />
          </div>
        </div>
      </div>
    </header>
  )
}