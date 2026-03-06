import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/useApp'
import {
  fetchExercise,
  validateAnswers,
  areInputsComplete,
  inputsMatchFailedAttempt,
} from '../../utils/exerciseUtils'
import ActionBar from './ActionBar'
import HintArea from './HintArea'
import ExerciseDisplay from './ExerciseDisplay'
import AnswerInputs from './AnswerInputs'
import ReasoningTextbox from './ReasoningTextbox'
import ExplanationArea from './ExplanationArea'
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
  const { appState, dispatch, topics } = useContext(AppContext)
  const { activeExerciseId, activeTopic, exerciseStates, selectedLevel } = appState

  const [loadedExercise, setLoadedExercise] = useState({ id: null, data: null, error: null })

  useEffect(() => {
    if (!activeExerciseId || !activeTopic) return

    let cancelled = false
    fetchExercise(activeTopic, activeExerciseId)
      .then(data => {
        if (!cancelled) setLoadedExercise({ id: activeExerciseId, data, error: null })
      })
      .catch(() => {
        if (!cancelled)
          setLoadedExercise({ id: activeExerciseId, data: null, error: 'Could not load this exercise.' })
      })
    return () => { cancelled = true }
  }, [activeExerciseId, activeTopic])

  // Derive loading / error / exercise from async state
  const loading = !!activeExerciseId && loadedExercise.id !== activeExerciseId
  const exercise = loadedExercise.id === activeExerciseId ? loadedExercise.data : null
  const error = loadedExercise.id === activeExerciseId ? loadedExercise.error : null

  if (!activeExerciseId) {
    return (
      <div className="exercise-area exercise-area--empty">
        <div className="exercise-area__placeholder">
          <div className="exercise-area__placeholder-icon">✏️</div>
          <h2>Pick a topic to get started</h2>
          <p>Choose a math topic from the left sidebar to begin practising.</p>
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
        <p>{error}</p>
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
  const level = selectedLevel || 'easy'
  const solvedIds = new Set(
    Object.entries(exerciseStates)
      .filter(([, es]) => es.status === 'solved')
      .map(([id]) => id)
  )
  const levelExercises = (topicData?.exercises ?? []).filter(id => id.includes(`-${level}-`))
  const remainingExercises = levelExercises.filter(id => !solvedIds.has(id) && id !== activeExerciseId)
  const hasNextExercise = remainingExercises.length > 0

  const attemptsLeft = 3 - exState.attempts

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
            {exercise.difficulty}
          </span>
        </div>

        <p className="exercise-area__instructions">{exercise.instructions}</p>

        <ExerciseDisplay question={exercise.question} />

        {exState.attempts > 0 && exState.status === 'pending' && (
          <div className="answer-feedback answer-feedback--wrong">
            Incorrect — {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining.
          </div>
        )}
        {exState.status === 'solved' && (
          <div className="answer-feedback answer-feedback--correct">
            Correct! Great work! 🎉
          </div>
        )}
        {exState.status === 'failed' && (
          <div className="answer-feedback answer-feedback--failed">
            No more attempts. Click <strong>How to solve?</strong> to see the solution, or <strong>Next</strong> to continue.
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
