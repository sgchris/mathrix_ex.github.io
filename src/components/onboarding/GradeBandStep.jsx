import { GRADE_BAND_OPTIONS } from '../../utils/onboarding'

export default function GradeBandStep({ selectedGradeBand, t, onSelect, onContinue, onBack }) {
  return (
    <section className="onboarding-card">
      <span className="onboarding-card__eyebrow">{t('onboarding.stepLabel', { current: 2, total: 5 })}</span>
      <h2>{t('onboarding.gradeBands.title')}</h2>
      <p>{t('onboarding.gradeBands.description')}</p>

      <div className="grade-band-grid" role="list" aria-label={t('onboarding.gradeBands.ariaLabel')}>
        {GRADE_BAND_OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            className={`grade-band-card${selectedGradeBand === option.id ? ' grade-band-card--selected' : ''}`}
            aria-pressed={selectedGradeBand === option.id}
            onClick={() => onSelect(option.id)}
          >
            <span className="grade-band-card__icon" aria-hidden="true">{option.icon}</span>
            <span className="grade-band-card__title">{t(`onboarding.gradeBands.${option.id}.label`)}</span>
            <span className="grade-band-card__preview">{t(`onboarding.gradeBands.${option.id}.preview`)}</span>
          </button>
        ))}
      </div>

      <div className="onboarding-card__actions">
        <button className="onboarding-button onboarding-button--ghost" onClick={onBack}>
          {t('onboarding.common.back')}
        </button>
        <button
          className="onboarding-button onboarding-button--primary"
          onClick={onContinue}
          disabled={!selectedGradeBand}
        >
          {t('onboarding.common.continue')}
        </button>
      </div>
    </section>
  )
}