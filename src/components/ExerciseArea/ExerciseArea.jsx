import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/useApp'
import {
  fetchExercise,
  validateAnswers,
  areInputsComplete,
  inputsMatchFailedAttempt,
} from '../../utils/exerciseUtils'
import { DEFAULT_LEVEL_ID, filterExerciseIdsByLevel, resolveTopicLevel } from '../../utils/levels'
import {
  countSolvedInPath,
  getPathTitleKey,
  getRecommendedLaunchSelection,
} from '../../utils/onboarding'
import { getSkillIdForExercise } from '../../utils/mastery'
import ActionBar from './ActionBar'
import HintArea from './HintArea'
import ExerciseDisplay from './ExerciseDisplay'
import AnswerInputs from './AnswerInputs'
import ReasoningTextbox from './ReasoningTextbox'
import ExplanationArea from './ExplanationArea'
import PathBadge from '../onboarding/PathBadge'
import './ExerciseArea.css'

const EMPTY_EX_STATE = {
  status: 'pending',
  attempts: 0,
  failedAnswers: [],
  currentInputs: {},
  hintIndex: 0,
  showExplanation: false,
  reasoning: '',
}

export default function ExerciseArea() {
  const { appState, dispatch, topics, language, shouldShowOnboardingPrompt, t } = useContext(AppContext)
  const { activeExerciseId, activeTopic, exerciseStates, selectedLevel } = appState
  const profile = appState.onboarding.learnerProfile
  const requestKey = activeExerciseId && activeTopic
    ? `${activeTopic}:${activeExerciseId}:${language}`
    : null

  const [loadedExercise, setLoadedExercise] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    if (!activeExerciseId || !activeTopic) return

    let cancelled = false
    fetchExercise(activeTopic, activeExerciseId, language)
      .then(data => {
        if (!cancelled) {
          setLoadedExercise({ key: requestKey, data, error: null })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadedExercise({ key: requestKey, data: null, error: 'exercise-load-error' })
        }
      })
    return () => { cancelled = true }
  }, [activeExerciseId, activeTopic, language, requestKey])

  // Derive loading / error / exercise from async state
  const isCurrentExercise = loadedExercise.key === requestKey
  const loading = !!requestKey && !isCurrentExercise
  const exercise = isCurrentExercise ? loadedExercise.data : null
  const error = isCurrentExercise ? loadedExercise.error : null

  function startRecommendedTopic() {
    const launchSelection = getRecommendedLaunchSelection(profile, topics, exerciseStates)
    if (!launchSelection) return

    const topic = topics.find(entry => entry.id === launchSelection.topicId)
    dispatch({
      type: 'SELECT_TOPIC',
      payload: {
        topicId: launchSelection.topicId,
        exercises: topic?.exercises || [],
        selectedLevel: launchSelection.levelId,
      },
    })
  }

  function openPathOverview() {
    dispatch({
      type: 'OPEN_MASTERY_MAP',
      payload: {
        mastery: {
          selectedSkillId: null,
          filters: {
            ...appState.mastery.filters,
            gradeBand: profile.recommendedGradeBand || 'all',
          },
          expandedTopicIds: profile.recommendedTopics,
        },
      },
    })
  }

  if (!activeExerciseId) {
    if (appState.onboarding.status === 'completed' && profile.recommendedTopics.length > 0) {
      const solvedCount = countSolvedInPath(profile, exerciseStates)
      const nextTopic = profile.recommendedTopics[0]
      const nextTopicName = topics.find(topic => topic.id === nextTopic)?.name || nextTopic

      return (
        <div className="exercise-area exercise-area--empty">
          <div className="exercise-area__placeholder exercise-area__placeholder--path">
            <div className="exercise-area__placeholder-icon">🧭</div>
            <h2>{t('onboarding.home.continuePath', { pathTitle: t(getPathTitleKey(profile.recommendedGradeBand)) })}</h2>
            <p>{t('onboarding.home.nextRecommendedTopic', { topic: nextTopicName })}</p>
            <p>{solvedCount > 0 ? t('onboarding.home.solvedInPath', { count: solvedCount }) : t('onboarding.home.ready')}</p>
            <div className="exercise-area__path-chips">
              {profile.recommendedTopics.map((topicId, index) => (
                <PathBadge
                  key={topicId}
                  index={index}
                  label={topics.find(topic => topic.id === topicId)?.name || topicId}
                  subtle={true}
                />
              ))}
            </div>
            <div className="exercise-area__placeholder-actions">
              <button className="answer-action-btn answer-action-btn--primary" onClick={startRecommendedTopic}>
                {t('onboarding.home.startRecommended')}
              </button>
              <button className="answer-action-btn answer-action-btn--next" onClick={openPathOverview}>
                {t('onboarding.home.seePath')}
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (shouldShowOnboardingPrompt) {
      return (
        <div className="exercise-area exercise-area--empty">
          <div className="exercise-area__placeholder exercise-area__placeholder--path">
            <div className="exercise-area__placeholder-icon">🧩</div>
            <h2>{t('onboarding.setupCard.title')}</h2>
            <p>{t('onboarding.setupCard.description')}</p>
            <div className="exercise-area__placeholder-actions">
              <button className="answer-action-btn answer-action-btn--primary" onClick={() => dispatch({ type: 'RESET_ONBOARDING' })}>
                {t('onboarding.setupCard.primary')}
              </button>
              <button className="answer-action-btn answer-action-btn--next" onClick={() => dispatch({ type: 'SKIP_ONBOARDING' })}>
                {t('onboarding.setupCard.secondary')}
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="exercise-area exercise-area--empty">
        <div className="exercise-area__placeholder">
          <div className="exercise-area__placeholder-icon">✏️</div>
          <h2>{t('emptyState.title')}</h2>
          <p>{t('emptyState.description')}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="exercise-area exercise-area--loading">
        <div className="exercise-area__spinner" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="exercise-area exercise-area--error">
        <p>{error === 'exercise-load-error' ? t('errors.exerciseLoad') : error}</p>
      </div>
    )
  }

  if (!exercise) return null

  const exState = exerciseStates[activeExerciseId] ?? EMPTY_EX_STATE
  const currentInputs = exState.currentInputs ?? {}
  const isCompleted = ['solved', 'failed', 'explanation_shown'].includes(exState.status)

  const allFilled = areInputsComplete(exercise.inputs, currentInputs)
  const matchesFailed = inputsMatchFailedAttempt(exState.failedAnswers, currentInputs)
  const canCheck = !isCompleted && allFilled && !matchesFailed
  const canHint = exState.hintIndex < exercise.hints.length
  const canNext = isCompleted

  const topicData = topics.find(t => t.id === activeTopic)
  const level = resolveTopicLevel(topicData?.exercises ?? [], selectedLevel || DEFAULT_LEVEL_ID)
  const solvedIds = new Set(
    Object.entries(exerciseStates)
      .filter(([, es]) => es.status === 'solved')
      .map(([id]) => id)
  )
  const levelExercises = filterExerciseIdsByLevel(topicData?.exercises ?? [], level)
  const remainingExercises = levelExercises.filter(id => !solvedIds.has(id) && id !== activeExerciseId)
  const hasNextExercise = remainingExercises.length > 0

  const attemptsLeft = 3 - exState.attempts
  const currentSkillId = getSkillIdForExercise(activeExerciseId)

  function handleCheckAnswers() {
    const correct = validateAnswers(exercise.inputs, currentInputs)
    dispatch({
      type: 'ANSWER_RESULT',
      payload: { exerciseId: activeExerciseId, correct, userInputs: { ...currentInputs } },
    })
  }

  function handleHint() {
    dispatch({
      type: 'SHOW_HINT',
      payload: { exerciseId: activeExerciseId, maxHints: exercise.hints.length },
    })
  }

  function handleHowToSolve() {
    dispatch({ type: 'SHOW_EXPLANATION', payload: { exerciseId: activeExerciseId } })
  }

  function handleNext() {
    if (remainingExercises.length === 0) return
    const nextExerciseId = remainingExercises[Math.floor(Math.random() * remainingExercises.length)]
    dispatch({
      type: 'NEXT_EXERCISE',
      payload: { topicId: activeTopic, nextExerciseId },
    })
  }

  function handleInputChange(name, value) {
    dispatch({
      type: 'UPDATE_INPUTS',
      payload: { exerciseId: activeExerciseId, inputs: { ...currentInputs, [name]: value } },
    })
  }

  function handleReasoningChange(value) {
    dispatch({
      type: 'UPDATE_REASONING',
      payload: { exerciseId: activeExerciseId, reasoning: value },
    })
  }

  function handleOpenSkillMap() {
    if (!currentSkillId) return

    dispatch({
      type: 'OPEN_MASTERY_MAP',
      payload: {
        mastery: {
          selectedSkillId: currentSkillId,
          expandedTopicIds: [activeTopic],
        },
      },
    })
  }

  return (
    <div className="exercise-area">
      <ActionBar
        canCheck={canCheck}
        canHint={canHint}
        canNext={canNext}
        hasNextExercise={hasNextExercise}
        onCheck={handleCheckAnswers}
        onHint={handleHint}
        onHowToSolve={handleHowToSolve}
        onNext={handleNext}
      />

      {exState.hintIndex > 0 && (
        <HintArea hints={exercise.hints} hintIndex={exState.hintIndex} />
      )}

      <div className="exercise-area__content">
        <div className="exercise-area__meta">
          <span className={`difficulty-badge difficulty-badge--${exercise.difficulty}`}>
            {t(`levels.${exercise.difficulty}`)}
          </span>
        </div>

        <p className="exercise-area__instructions">{exercise.instructions}</p>

        <ExerciseDisplay question={exercise.question} />

        {exState.attempts > 0 && exState.status === 'pending' && (
          <div className="answer-feedback answer-feedback--wrong">
            {t('feedback.incorrect', { count: attemptsLeft })}
          </div>
        )}
        {exState.status === 'solved' && (
          <div className="answer-feedback answer-feedback--correct">
            {t('feedback.correct')}
          </div>
        )}
        {exState.status === 'failed' && (
          <div className="answer-feedback answer-feedback--failed">
            {t('feedback.failed')}
          </div>
        )}

        {isCompleted && currentSkillId && (
          <div className="exercise-area__mastery-link-wrap">
            <button className="exercise-area__mastery-link" onClick={handleOpenSkillMap}>
              {t('mastery.actions.openSkillMap')}
            </button>
          </div>
        )}

        <AnswerInputs
          inputs={exercise.inputs}
          currentInputs={currentInputs}
          status={exState.status}
          onChange={handleInputChange}
          canCheck={canCheck}
          canNext={canNext}
          hasNextExercise={hasNextExercise}
          onCheck={handleCheckAnswers}
          onNext={handleNext}
        />

        <ReasoningTextbox
          value={exState.reasoning ?? ''}
          onChange={handleReasoningChange}
        />

        {exState.showExplanation && (
          <ExplanationArea steps={exercise.explanation.steps} />
        )}
      </div>
    </div>
  )
}
