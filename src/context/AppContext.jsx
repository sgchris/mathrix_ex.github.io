import { useReducer, useEffect, useState } from 'react'
import { fetchTopics } from '../utils/exerciseUtils'
import { AppContext } from './useApp'

const STORAGE_KEY = 'mathrix_state'

const initialState = {
  activeTopic: null,
  activeExerciseId: null,
  topicHistory: {},
  exerciseStates: {},
  selectedLevel: 'easy',
}

function getExerciseState(state, exerciseId) {
  return (
    state.exerciseStates[exerciseId] || {
      status: 'pending',
      attempts: 0,
      failedAnswers: [],
      currentInputs: {},
      hintIndex: 0,
      showExplanation: false,
      reasoning: '',
    }
  )
}

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_TOPIC': {
      const { topicId, exercises, selectedLevel } = action.payload
      const existingHistory = state.topicHistory[topicId] || []
      let firstExerciseId
      let history

      if (existingHistory.length > 0) {
        history = existingHistory
        firstExerciseId = existingHistory[existingHistory.length - 1]
      } else {
        const level = selectedLevel || 'easy'
        const pool = (exercises || []).filter(id => id.includes(`-${level}-`))
        const candidates = pool.length > 0 ? pool : (exercises || [])
        firstExerciseId = candidates.length > 0
          ? candidates[Math.floor(Math.random() * candidates.length)]
          : null
        history = firstExerciseId ? [firstExerciseId] : []
      }

      return {
        ...state,
        activeTopic: topicId,
        activeExerciseId: firstExerciseId,
        topicHistory: {
          ...state.topicHistory,
          [topicId]: history,
        },
      }
    }

    case 'SELECT_EXERCISE': {
      return {
        ...state,
        activeExerciseId: action.payload.exerciseId,
      }
    }

    case 'NEXT_EXERCISE': {
      const { topicId, nextExerciseId } = action.payload
      const history = state.topicHistory[topicId] || []
      const updatedHistory = history.includes(nextExerciseId)
        ? history
        : [...history, nextExerciseId]
      return {
        ...state,
        activeExerciseId: nextExerciseId,
        topicHistory: {
          ...state.topicHistory,
          [topicId]: updatedHistory,
        },
      }
    }

    case 'ANSWER_RESULT': {
      const { exerciseId, correct, userInputs } = action.payload
      const current = getExerciseState(state, exerciseId)
      const newAttempts = current.attempts + 1
      let newStatus = current.status
      let newFailedAnswers = current.failedAnswers

      if (correct) {
        newStatus = 'solved'
      } else {
        newFailedAnswers = [...current.failedAnswers, { ...userInputs }]
        if (newAttempts >= 3) {
          newStatus = 'failed'
        }
      }

      return {
        ...state,
        exerciseStates: {
          ...state.exerciseStates,
          [exerciseId]: {
            ...current,
            status: newStatus,
            attempts: newAttempts,
            failedAnswers: newFailedAnswers,
          },
        },
      }
    }

    case 'SHOW_HINT': {
      const { exerciseId, maxHints } = action.payload
      const current = getExerciseState(state, exerciseId)
      return {
        ...state,
        exerciseStates: {
          ...state.exerciseStates,
          [exerciseId]: {
            ...current,
            hintIndex: Math.min(current.hintIndex + 1, maxHints),
          },
        },
      }
    }

    case 'SHOW_EXPLANATION': {
      const { exerciseId } = action.payload
      const current = getExerciseState(state, exerciseId)
      const newStatus = ['solved', 'failed'].includes(current.status)
        ? current.status
        : 'explanation_shown'
      return {
        ...state,
        exerciseStates: {
          ...state.exerciseStates,
          [exerciseId]: {
            ...current,
            showExplanation: true,
            status: newStatus,
          },
        },
      }
    }

    case 'UPDATE_INPUTS': {
      const { exerciseId, inputs } = action.payload
      const current = getExerciseState(state, exerciseId)
      return {
        ...state,
        exerciseStates: {
          ...state.exerciseStates,
          [exerciseId]: {
            ...current,
            currentInputs: inputs,
          },
        },
      }
    }

    case 'UPDATE_REASONING': {
      const { exerciseId, reasoning } = action.payload
      const current = getExerciseState(state, exerciseId)
      return {
        ...state,
        exerciseStates: {
          ...state.exerciseStates,
          [exerciseId]: {
            ...current,
            reasoning,
          },
        },
      }
    }

    case 'SET_LEVEL': {
      const { level, exercises } = action.payload
      const baseState = { ...state, selectedLevel: level }

      if (!state.activeTopic || !exercises || exercises.length === 0) return baseState

      const solvedIds = new Set(
        Object.entries(state.exerciseStates)
          .filter(([, es]) => es.status === 'solved')
          .map(([id]) => id)
      )
      const levelPool = exercises.filter(id => id.includes(`-${level}-`))
      // Exclude solved and the current active exercise from candidates
      const available = levelPool.filter(
        id => !solvedIds.has(id) && id !== state.activeExerciseId
      )
      if (available.length === 0) return baseState

      const nextExId = available[Math.floor(Math.random() * available.length)]
      const topicId = state.activeTopic
      const currentExState = state.exerciseStates[state.activeExerciseId]
      const currentIsSolved = currentExState?.status === 'solved'

      let history = state.topicHistory[topicId] || []

      if (currentIsSolved) {
        // Current is solved — keep it in history, append the new exercise
        history = history.includes(nextExId) ? history : [...history, nextExId]
      } else {
        // Current is not solved — remove it from history and replace with new exercise
        history = history.filter(id => id !== state.activeExerciseId)
        history = history.includes(nextExId) ? history : [...history, nextExId]
      }

      return {
        ...baseState,
        activeExerciseId: nextExId,
        topicHistory: {
          ...state.topicHistory,
          [topicId]: history,
        },
      }
    }

    default:
      return state
  }
}

export default function AppProvider({ children }) {
  const [topics, setTopics] = useState([])

  const [appState, dispatch] = useReducer(reducer, null, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...initialState, ...JSON.parse(saved) } : initialState
    } catch {
      return initialState
    }
  })

  useEffect(() => {
    fetchTopics().then(setTopics).catch(console.error)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState))
  }, [appState])

  return (
    <AppContext.Provider value={{ appState, dispatch, topics }}>
      {children}
    </AppContext.Provider>
  )
}


