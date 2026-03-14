import ExerciseDisplay from '../ExerciseArea/ExerciseDisplay'
import '../ExerciseArea/AnswerInputs.css'

const HEBREW_LETTER_REGEX = /[\u0590-\u05FF]/

export default function DiagnosticQuestionCard({
  exercise,
  t,
  isRTL,
  currentInputs,
  onChange,
  onContinue,
  onSkip,
  onExit,
  canContinue,
  feedback,
  progressLabel,
  progressValue,
  questionNumber,
}) {
  return (
    <section className="onboarding-card onboarding-card--diagnostic">
      <header className="diagnostic-header">
        <div>
          <span className="onboarding-card__eyebrow">{t('onboarding.stepLabel', { current: 3, total: 5 })}</span>
          <h2>{progressLabel}</h2>
        </div>
        <button className="diagnostic-link" type="button" onClick={onExit}>
          {t('onboarding.diagnostic.exit')}
        </button>
      </header>

      <div className="diagnostic-progress" aria-label={progressLabel}>
        <div className="diagnostic-progress__track">
          <span className="diagnostic-progress__fill" style={{ width: `${progressValue}%` }} />
        </div>
        <div className="diagnostic-progress__dots" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className={`diagnostic-progress__dot${index < questionNumber ? ' diagnostic-progress__dot--active' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="diagnostic-question-card">
        <div className="diagnostic-question-card__meta">
          <span className={`difficulty-badge difficulty-badge--${exercise.difficulty}`}>
            {t(`levels.${exercise.difficulty}`)}
          </span>
        </div>

        <p className="exercise-area__instructions">{exercise.instructions}</p>
        <ExerciseDisplay question={exercise.question} />

        <div className="diagnostic-inputs">
          {exercise.inputs.map(({ name, label, inputType }) => {
            const hasHebrewLabel = isRTL && HEBREW_LETTER_REGEX.test(label)

            return (
              <div
                key={name}
                className={`answer-row${hasHebrewLabel ? ' answer-row--rtl-label' : ''}`}
                dir="ltr"
              >
                <label
                  className={`answer-row__label${hasHebrewLabel ? ' answer-row__label--rtl' : ''}`}
                  htmlFor={`diagnostic-answer-${name}`}
                >
                  <span dir={hasHebrewLabel ? 'rtl' : 'auto'}>{label}</span>
                </label>
                <input
                  id={`diagnostic-answer-${name}`}
                  type={inputType}
                  className="answer-row__input"
                  value={currentInputs[name] ?? ''}
                  onChange={event => onChange(name, event.target.value)}
                  autoComplete="off"
                  dir="ltr"
                />
              </div>
            )
          })}
        </div>

        {feedback ? (
          <div className={`diagnostic-feedback diagnostic-feedback--${feedback.type}`}>
            <strong>{t(`onboarding.diagnostic.feedback.${feedback.type}`)}</strong>
            {feedback.tip ? <p>{feedback.tip}</p> : null}
          </div>
        ) : null}
      </div>

      <footer className="diagnostic-footer">
        <button className="onboarding-button onboarding-button--ghost" type="button" onClick={onSkip}>
          {t('onboarding.diagnostic.skipQuestion')}
        </button>
        <button
          className="onboarding-button onboarding-button--primary"
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
        >
          {t('onboarding.diagnostic.continue')}
        </button>
      </footer>
    </section>
  )
}