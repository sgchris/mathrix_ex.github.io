import { useEffect, useMemo, useState } from 'react'
import { areInputsComplete, fetchExercise, validateAnswers } from '../../utils/exerciseUtils'
import {
  DIAGNOSTIC_TOTAL_QUESTIONS,
  bucketDuration,
  buildPlacementProfile,
} from '../../utils/onboarding'
import DiagnosticQuestionCard from './DiagnosticQuestionCard'

export default function DiagnosticRunner({ onboarding, language, isRTL, dispatch, t }) {
  const questionId = onboarding.diagnostic.questionIds[onboarding.diagnostic.currentIndex]
  const [loadedExercise, setLoadedExercise] = useState({ key: null, data: null, error: null })
  const [currentInputs, setCurrentInputs] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    if (!questionId) return

    let cancelled = false
    const topicId = questionId.replace(/-level\d{2}-\d+$/, '')

    fetchExercise(topicId, questionId, language)
      .then(data => {
        if (!cancelled) {
          setLoadedExercise({ key: questionId, data, error: null })
          setCurrentInputs({})
          setFeedback(null)
          setIsSubmitting(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadedExercise({ key: questionId, data: null, error: 'exercise-load-error' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [language, questionId, retryToken])

  useEffect(() => {
    const hasFinished = onboarding.currentStep === 'diagnostic'
      && onboarding.diagnostic.currentIndex >= onboarding.diagnostic.questionIds.length
      && onboarding.diagnostic.answers.length >= 3

    if (!hasFinished) return

    const { confidence, profile } = buildPlacementProfile(
      onboarding.selectedGradeBand,
      onboarding.diagnostic.answers
    )

    dispatch({
      type: 'SET_PLACEMENT_RESULT',
      payload: {
        confidence,
        profile,
      },
    })
  }, [dispatch, onboarding.currentStep, onboarding.diagnostic.answers, onboarding.diagnostic.currentIndex, onboarding.diagnostic.questionIds.length, onboarding.selectedGradeBand])

  const exercise = loadedExercise.key === questionId ? loadedExercise.data : null
  const isLoading = !!questionId && loadedExercise.key !== questionId
  const canContinue = useMemo(() => {
    if (!exercise || isSubmitting) return false
    return areInputsComplete(exercise.inputs, currentInputs)
  }, [currentInputs, exercise, isSubmitting])

  if (isLoading) {
    return (
      <section className="onboarding-card onboarding-card--loading">
        <div className="exercise-area__spinner" />
      </section>
    )
  }

  if (loadedExercise.error) {
    return (
      <section className="onboarding-card onboarding-card--error">
        <span className="onboarding-card__eyebrow">{t('onboarding.stepLabel', { current: 3, total: 5 })}</span>
        <h2>{t('onboarding.diagnostic.loadErrorTitle')}</h2>
        <p>{t('onboarding.diagnostic.loadErrorDescription')}</p>
        <div className="onboarding-card__actions">
          <button
            className="onboarding-button onboarding-button--secondary"
            type="button"
            onClick={() => {
              setLoadedExercise({ key: null, data: null, error: null })
              setRetryToken(current => current + 1)
            }}
          >
            {t('onboarding.common.tryAgain')}
          </button>
          <button
            className="onboarding-button onboarding-button--ghost"
            type="button"
            onClick={() => dispatch({ type: 'SKIP_ONBOARDING' })}
          >
            {t('onboarding.welcome.chooseManually')}
          </button>
        </div>
      </section>
    )
  }

  if (!exercise) {
    return null
  }

  const questionNumber = onboarding.diagnostic.currentIndex + 1
  const progressValue = (questionNumber / DIAGNOSTIC_TOTAL_QUESTIONS) * 100
  const progressLabel = t('onboarding.questionLabel', {
    current: questionNumber,
    total: DIAGNOSTIC_TOTAL_QUESTIONS,
  })

  function commitAnswer(answer) {
    dispatch({
      type: 'SAVE_DIAGNOSTIC_ANSWER',
      payload: { answer },
    })
  }

  function handleContinue() {
    if (!canContinue) return

    const correct = validateAnswers(exercise.inputs, currentInputs)
    const startedAt = onboarding.diagnostic.questionStartedAt || Date.now()
    const durationBucket = bucketDuration(Date.now() - startedAt)
    const answer = {
      questionId,
      topicId: exercise.topicId,
      levelId: exercise.difficulty,
      correct,
      skipped: false,
      durationBucket,
      answeredAt: Date.now(),
    }

    setFeedback({
      type: correct ? 'correct' : 'incorrect',
      tip: correct ? null : exercise.hints?.[0] || t('onboarding.diagnostic.keepGoing'),
    })
    setIsSubmitting(true)

    window.setTimeout(() => {
      commitAnswer(answer)
    }, 550)
  }

  function handleSkip() {
    const startedAt = onboarding.diagnostic.questionStartedAt || Date.now()
    const answer = {
      questionId,
      topicId: exercise.topicId,
      levelId: exercise.difficulty,
      correct: false,
      skipped: true,
      durationBucket: bucketDuration(Date.now() - startedAt),
      answeredAt: Date.now(),
    }

    commitAnswer(answer)
  }

  return (
    <DiagnosticQuestionCard
      exercise={exercise}
      t={t}
      isRTL={isRTL}
      currentInputs={currentInputs}
      onChange={(name, value) => setCurrentInputs(current => ({ ...current, [name]: value }))}
      onContinue={handleContinue}
      onSkip={handleSkip}
      onExit={() => dispatch({ type: 'SKIP_ONBOARDING' })}
      canContinue={canContinue}
      feedback={feedback}
      progressLabel={progressLabel}
      progressValue={progressValue}
      questionNumber={questionNumber}
    />
  )
}