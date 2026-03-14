export default function OnboardingWelcome({ t, onStart, onChooseManually }) {
  return (
    <section className="onboarding-card onboarding-card--hero">
      <span className="onboarding-card__eyebrow">{t('onboarding.stepLabel', { current: 1, total: 5 })}</span>
      <h1>{t('onboarding.welcome.title')}</h1>
      <p>{t('onboarding.welcome.description')}</p>

      <div className="onboarding-card__actions onboarding-card__actions--stacked">
        <button className="onboarding-button onboarding-button--primary" onClick={onStart}>
          {t('onboarding.welcome.start')}
        </button>
        <button className="onboarding-button onboarding-button--secondary" onClick={onChooseManually}>
          {t('onboarding.welcome.chooseManually')}
        </button>
      </div>
    </section>
  )
}