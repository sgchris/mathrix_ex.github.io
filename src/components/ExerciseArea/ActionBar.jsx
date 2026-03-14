import {
  CheckCircleIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import { useApp } from '../../context/useApp'
import './ActionBar.css'

export default function ActionBar({
  canCheck,
  canHint,
  canNext,
  hasNextExercise,
  nextLabel,
  nextTitle,
  onCheck,
  onHint,
  onHowToSolve,
  onNext,
}) {
  const { t } = useApp()

  return (
    <div className="action-bar">
      <button
        className="action-btn action-btn--primary"
        disabled={!canCheck}
        onClick={onCheck}
        title={t('actions.checkAnswersTitle')}
      >
        <CheckCircleIcon className="action-btn__icon" />
        {t('actions.checkAnswers')}
      </button>

      <button
        className="action-btn"
        disabled={!canHint}
        onClick={onHint}
        title={t('actions.giveHintTitle')}
      >
        <LightBulbIcon className="action-btn__icon" />
        {t('actions.giveHint')}
      </button>

      <button
        className="action-btn"
        onClick={onHowToSolve}
        title={t('actions.howToSolveTitle')}
      >
        <QuestionMarkCircleIcon className="action-btn__icon" />
        {t('actions.howToSolve')}
      </button>

      <button
        className="action-btn action-btn--next"
        disabled={!canNext || !hasNextExercise}
        onClick={onNext}
        title={nextTitle || t('actions.nextTitle')}
      >
        {nextLabel || t('actions.next')}
        <ArrowRightIcon className="action-btn__icon action-btn__icon--right" />
      </button>
    </div>
  )
}
