import { useEffect, useReducer, useRef, useState } from 'react'
import { fetchTopics } from '../utils/exerciseUtils'
import {
  ensureFirebaseAuthPersistence,
  getFirebaseConfigError,
  isFirebaseConfigured,
  loadRemoteProgress,
  saveRemoteProgress,
  signInWithGooglePopup,
  signOutFromFirebase,
  subscribeToFirebaseAuth,
} from '../utils/firebase'
import {
  DEFAULT_LEVEL_ID,
  filterExerciseIdsByLevel,
  normalizeLevelId,
  resolveTopicLevel,
} from '../utils/levels'
import { getLocale, translate } from '../utils/localization'
import {
  createInitialOnboardingState,
  expandDiagnosticQuestionIds,
  hasMeaningfulHistory,
  normalizeOnboardingState,
} from '../utils/onboarding'
import { buildMasteryData, createInitialMasteryState, normalizeMasteryState } from '../utils/mastery'
import {
  buildRecommendations,
  createInitialRecommendationsState,
  normalizeRecommendationsState,
} from '../utils/recommendations'
import { AppContext } from './useApp'

const ANONYMOUS_STORAGE_KEY = 'mathrix_state_v3'

function getUserStorageKey(uid) {
  return `${ANONYMOUS_STORAGE_KEY}_user_${uid}`
}

const initialState = {
  appView: 'practice',
  activeTopic: null,
  activeExerciseId: null,
  topicHistory: {},
  exerciseStates: {},
  selectedLevel: DEFAULT_LEVEL_ID,
  language: 'en',
  onboarding: createInitialOnboardingState(),
  mastery: createInitialMasteryState(),
  recommendations: createInitialRecommendationsState(),
  lastModifiedAt: 0,
}

function normalizePersistedState(parsedState = {}) {
  return {
    ...initialState,
    ...parsedState,
    selectedLevel: normalizeLevelId(parsedState.selectedLevel),
    onboarding: normalizeOnboardingState(parsedState.onboarding),
    mastery: normalizeMasteryState(parsedState.mastery),
    recommendations: normalizeRecommendationsState(parsedState.recommendations),
    lastModifiedAt: parsedState.lastModifiedAt || 0,
  }
}

function readStoredState(storageKey) {
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return null

    return normalizePersistedState(JSON.parse(saved))
  } catch {
    return null
  }
}

function writeStoredState(storageKey, state) {
  localStorage.setItem(storageKey, JSON.stringify(state))
}

function statesAreEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function touchState(nextState) {
  return {
    ...nextState,
    lastModifiedAt: Date.now(),
  }
}

function formatFirebaseError(error) {
  const code = error?.code
  const details = code ? ` (${code})` : ''

  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'The sign-in popup was closed before finishing.'
    case 'auth/cancelled-popup-request':
      return 'A sign-in popup is already open.'
    case 'auth/popup-blocked':
      return 'The browser blocked the sign-in popup.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Authentication yet.'
    case 'permission-denied':
      return `Firebase rejected access to the saved progress${details}. Check that Firestore rules allow read/write on userProgress/{uid} for the signed-in user, and that Cloud Firestore is enabled in the same Firebase project.`
    default:
      return error?.message ? `${error.message}${details && !error.message.includes(code) ? details : ''}` : 'Something went wrong while syncing your progress.'
  }
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
      lastPracticedAt: 0,
      lastOutcomeAt: 0,
    }
  )
}

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_TOPIC': {
      const { topicId, exercises, selectedLevel } = action.payload
      const existingHistory = state.topicHistory[topicId] || []
      const resolvedLevel = resolveTopicLevel(exercises || [], selectedLevel)
      let firstExerciseId
      let history

      if (existingHistory.length > 0) {
        history = existingHistory
        firstExerciseId = existingHistory[existingHistory.length - 1]
      } else {
        const pool = filterExerciseIdsByLevel(exercises || [], resolvedLevel)
        const candidates = pool.length > 0 ? pool : (exercises || [])
        firstExerciseId = candidates.length > 0
          ? candidates[Math.floor(Math.random() * candidates.length)]
          : null
        history = firstExerciseId ? [firstExerciseId] : []
      }

      return touchState({
        ...state,
        appView: 'practice',
        activeTopic: topicId,
        activeExerciseId: firstExerciseId,
        selectedLevel: resolvedLevel,
        topicHistory: {
          ...state.topicHistory,
          [topicId]: history,
        },
      })
    }

    case 'SELECT_EXERCISE': {
      return touchState({
        ...state,
        appView: 'practice',
        activeExerciseId: action.payload.exerciseId,
      })
    }

    case 'OPEN_EXERCISE': {
      const { topicId, exercises, exerciseId, selectedLevel } = action.payload
      const resolvedLevel = resolveTopicLevel(exercises || [], selectedLevel)
      const existingHistory = state.topicHistory[topicId] || []
      const history = existingHistory.includes(exerciseId)
        ? existingHistory
        : [...existingHistory, exerciseId]

      return touchState({
        ...state,
        appView: 'practice',
        activeTopic: topicId,
        activeExerciseId: exerciseId,
        selectedLevel: resolvedLevel,
        topicHistory: {
          ...state.topicHistory,
          [topicId]: history,
        },
      })
    }

    case 'NEXT_EXERCISE': {
      const { topicId, nextExerciseId } = action.payload
      const history = state.topicHistory[topicId] || []
      const updatedHistory = history.includes(nextExerciseId)
        ? history
        : [...history, nextExerciseId]
      return touchState({
        ...state,
        appView: 'practice',
        activeExerciseId: nextExerciseId,
        topicHistory: {
          ...state.topicHistory,
          [topicId]: updatedHistory,
        },
      })
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

      return touchState({
        ...state,
        exerciseStates: {
          ...state.exerciseStates,
          [exerciseId]: {
            ...current,
            status: newStatus,
            attempts: newAttempts,
            failedAnswers: newFailedAnswers,
            lastPracticedAt: Date.now(),
            lastOutcomeAt: Date.now(),
          },
        },
      })
    }

    case 'SHOW_HINT': {
      const { exerciseId, maxHints } = action.payload
      const current = getExerciseState(state, exerciseId)
      return touchState({
        ...state,
        exerciseStates: {
          ...state.exerciseStates,
          [exerciseId]: {
            ...current,
            hintIndex: Math.min(current.hintIndex + 1, maxHints),
            lastPracticedAt: Date.now(),
          },
        },
      })
    }

    case 'SHOW_EXPLANATION': {
      const { exerciseId } = action.payload
      const current = getExerciseState(state, exerciseId)
      const newStatus = ['solved', 'failed'].includes(current.status)
        ? current.status
        : 'explanation_shown'
      return touchState({
        ...state,
        exerciseStates: {
          ...state.exerciseStates,
          [exerciseId]: {
            ...current,
            showExplanation: true,
            status: newStatus,
            lastPracticedAt: Date.now(),
            lastOutcomeAt: Date.now(),
          },
        },
      })
    }

    case 'UPDATE_INPUTS': {
      const { exerciseId, inputs } = action.payload
      const current = getExerciseState(state, exerciseId)
      return touchState({
        ...state,
        exerciseStates: {
          ...state.exerciseStates,
          [exerciseId]: {
            ...current,
            currentInputs: inputs,
          },
        },
      })
    }

    case 'UPDATE_REASONING': {
      const { exerciseId, reasoning } = action.payload
      const current = getExerciseState(state, exerciseId)
      return touchState({
        ...state,
        exerciseStates: {
          ...state.exerciseStates,
          [exerciseId]: {
            ...current,
            reasoning,
          },
        },
      })
    }

    case 'SET_LEVEL': {
      const { level, exercises } = action.payload
      const normalizedLevel = resolveTopicLevel(exercises || [], level)
      const baseState = { ...state, selectedLevel: normalizedLevel }

      if (!state.activeTopic || !exercises || exercises.length === 0) return touchState(baseState)

      const solvedIds = new Set(
        Object.entries(state.exerciseStates)
          .filter(([, es]) => es.status === 'solved')
          .map(([id]) => id)
      )
      const levelPool = filterExerciseIdsByLevel(exercises, normalizedLevel)
      // Prefer unsolved; fall back to any exercise in the pool if all are solved
      const unsolved = levelPool.filter(
        id => !solvedIds.has(id) && id !== state.activeExerciseId
      )
      const candidates = unsolved.length > 0
        ? unsolved
        : levelPool.filter(id => id !== state.activeExerciseId)
      if (candidates.length === 0) return touchState(baseState)

      const nextExId = candidates[Math.floor(Math.random() * candidates.length)]
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

      return touchState({
        ...baseState,
        activeExerciseId: nextExId,
        topicHistory: {
          ...state.topicHistory,
          [topicId]: history,
        },
      })
    }

    case 'SET_LANGUAGE': {
      return touchState({
        ...state,
        language: action.payload.language,
      })
    }

    case 'SET_APP_VIEW': {
      return touchState({
        ...state,
        appView: action.payload.view,
      })
    }

    case 'OPEN_MASTERY_MAP': {
      const nextMastery = normalizeMasteryState({
        ...state.mastery,
        ...(action.payload?.mastery || {}),
      })

      return touchState({
        ...state,
        appView: 'masteryMap',
        mastery: nextMastery,
      })
    }

    case 'SET_MASTERY_FILTERS': {
      return touchState({
        ...state,
        mastery: {
          ...state.mastery,
          filters: {
            ...state.mastery.filters,
            ...action.payload.filters,
          },
        },
      })
    }

    case 'SET_MASTERY_VIEW_MODE': {
      return touchState({
        ...state,
        mastery: {
          ...state.mastery,
          lastViewMode: action.payload.viewMode,
        },
      })
    }

    case 'SET_MASTERY_SELECTED_SKILL': {
      return touchState({
        ...state,
        mastery: {
          ...state.mastery,
          selectedSkillId: action.payload.skillId,
        },
      })
    }

    case 'TOGGLE_MASTERY_TOPIC': {
      const expandedTopicIds = state.mastery.expandedTopicIds.includes(action.payload.topicId)
        ? state.mastery.expandedTopicIds.filter(topicId => topicId !== action.payload.topicId)
        : [...state.mastery.expandedTopicIds, action.payload.topicId]

      return touchState({
        ...state,
        mastery: {
          ...state.mastery,
          expandedTopicIds,
        },
      })
    }

    case 'SET_RECOMMENDATIONS': {
      if (statesAreEqual(state.recommendations, action.payload.recommendations)) {
        return state
      }

      return touchState({
        ...state,
        recommendations: normalizeRecommendationsState(action.payload.recommendations),
      })
    }

    case 'ACCEPT_RECOMMENDATION': {
      return touchState({
        ...state,
        recommendations: {
          ...state.recommendations,
          lastAction: {
            acceptedAt: Date.now(),
            dismissedAt: state.recommendations.lastAction.dismissedAt,
            type: action.payload.recommendationType,
            recommendationId: action.payload.recommendationId,
          },
        },
      })
    }

    case 'DISMISS_RECOMMENDATION': {
      const recommendationId = action.payload.recommendationId
      const nextDismissedIds = state.recommendations.dismissedRecommendationIds.includes(recommendationId)
        ? state.recommendations.dismissedRecommendationIds
        : [...state.recommendations.dismissedRecommendationIds, recommendationId]

      return touchState({
        ...state,
        recommendations: {
          ...state.recommendations,
          dismissedRecommendationIds: nextDismissedIds,
          lastAction: {
            acceptedAt: state.recommendations.lastAction.acceptedAt,
            dismissedAt: Date.now(),
            type: action.payload.recommendationType,
            recommendationId,
          },
        },
      })
    }

    case 'RESET_MASTERY_FILTERS': {
      return touchState({
        ...state,
        mastery: {
          ...state.mastery,
          filters: createInitialMasteryState().filters,
        },
      })
    }

    case 'RESET_ONBOARDING': {
      return touchState({
        ...state,
        onboarding: {
          ...createInitialOnboardingState(),
          status: 'in_progress',
        },
      })
    }

    case 'SET_ONBOARDING_STEP': {
      return touchState({
        ...state,
        onboarding: {
          ...state.onboarding,
          currentStep: action.payload.step,
          status: action.payload.status || state.onboarding.status,
        },
      })
    }

    case 'SELECT_GRADE_BAND': {
      return touchState({
        ...state,
        onboarding: {
          ...state.onboarding,
          selectedGradeBand: action.payload.gradeBand,
        },
      })
    }

    case 'INITIALIZE_DIAGNOSTIC': {
      return touchState({
        ...state,
        onboarding: {
          ...state.onboarding,
          status: 'in_progress',
          currentStep: 'diagnostic',
          diagnostic: {
            ...createInitialOnboardingState().diagnostic,
            questionIds: action.payload.questionIds,
            startedAt: Date.now(),
            questionStartedAt: Date.now(),
          },
          learnerProfile: createInitialOnboardingState().learnerProfile,
        },
      })
    }

    case 'SAVE_DIAGNOSTIC_ANSWER': {
      const answers = [...state.onboarding.diagnostic.answers, action.payload.answer]
      const questionIds = expandDiagnosticQuestionIds(
        state.onboarding.selectedGradeBand,
        state.onboarding.diagnostic.questionIds,
        answers
      )

      return touchState({
        ...state,
        onboarding: {
          ...state.onboarding,
          diagnostic: {
            ...state.onboarding.diagnostic,
            answers,
            questionIds,
            currentIndex: Math.min(answers.length, questionIds.length),
            questionStartedAt: Date.now(),
          },
        },
      })
    }

    case 'SET_PLACEMENT_RESULT': {
      return touchState({
        ...state,
        onboarding: {
          ...state.onboarding,
          currentStep: 'result',
          diagnostic: {
            ...state.onboarding.diagnostic,
            completedAt: Date.now(),
            confidence: action.payload.confidence,
          },
          learnerProfile: action.payload.profile,
        },
      })
    }

    case 'APPLY_MANUAL_PATH': {
      return touchState({
        ...state,
        onboarding: {
          ...state.onboarding,
          learnerProfile: {
            ...state.onboarding.learnerProfile,
            ...action.payload.profile,
          },
        },
      })
    }

    case 'COMPLETE_ONBOARDING': {
      return touchState({
        ...state,
        onboarding: {
          ...state.onboarding,
          status: 'completed',
        },
      })
    }

    case 'SKIP_ONBOARDING': {
      return touchState({
        ...state,
        onboarding: {
          ...createInitialOnboardingState(),
          status: 'skipped',
        },
      })
    }

    case 'HYDRATE_STATE': {
      return normalizePersistedState(action.payload.state)
    }

    default:
      return state
  }
}

export default function AppProvider({ children }) {
  const [topics, setTopics] = useState([])
  const [authState, setAuthState] = useState(() => ({
    status: isFirebaseConfigured ? 'loading' : 'disabled',
    user: null,
    error: getFirebaseConfigError(),
    action: 'idle',
  }))
  const [syncState, setSyncState] = useState(() => ({
    status: isFirebaseConfigured ? 'signed-out' : 'disabled',
    error: getFirebaseConfigError(),
    lastSyncedAt: null,
  }))
  const appStateRef = useRef(initialState)
  const hydratedUserIdRef = useRef(null)
  const previousUserIdRef = useRef(null)
  const skipNextRemoteSaveRef = useRef(false)

  const [appState, dispatch] = useReducer(reducer, null, () => {
    return readStoredState(ANONYMOUS_STORAGE_KEY) || initialState
  })

  const locale = getLocale(appState.language)
  const hasSavedWork = hasMeaningfulHistory(appState)
  const isOnboardingBlocking = appState.onboarding.status === 'in_progress'
    || (appState.onboarding.status === 'not_started' && !hasSavedWork)
  const shouldShowOnboardingPrompt = hasSavedWork && appState.onboarding.status === 'not_started'
  const masteryData = buildMasteryData({
    topics,
    exerciseStates: appState.exerciseStates,
    onboarding: appState.onboarding,
    mastery: appState.mastery,
  })

  appStateRef.current = appState

  function setLanguage(language) {
    dispatch({ type: 'SET_LANGUAGE', payload: { language } })
  }

  async function signInWithGoogle() {
    setAuthState(current => ({ ...current, action: 'signing-in', error: null }))

    try {
      await signInWithGooglePopup()
      setAuthState(current => ({ ...current, action: 'idle', error: null }))
    } catch (error) {
      setAuthState(current => ({
        ...current,
        action: 'idle',
        error: formatFirebaseError(error),
      }))
    }
  }

  async function signOutUser() {
    setAuthState(current => ({ ...current, action: 'signing-out', error: null }))

    try {
      await signOutFromFirebase()
      setAuthState(current => ({ ...current, action: 'idle', error: null }))
    } catch (error) {
      setAuthState(current => ({
        ...current,
        action: 'idle',
        error: formatFirebaseError(error),
      }))
    }
  }

  function t(key, params) {
    return translate(appState.language, key, params)
  }

  function openPracticeSelection(selection) {
    if (!selection?.topicId || !selection?.exerciseId) return false

    const topic = topics.find(entry => entry.id === selection.topicId)
    dispatch({
      type: 'OPEN_EXERCISE',
      payload: {
        topicId: selection.topicId,
        exercises: topic?.exercises || [],
        exerciseId: selection.exerciseId,
        selectedLevel: selection.levelId,
      },
    })

    return true
  }

  function startRecommendation(recommendation) {
    if (!recommendation?.id) return false

    dispatch({
      type: 'ACCEPT_RECOMMENDATION',
      payload: {
        recommendationId: recommendation.id,
        recommendationType: recommendation.type,
      },
    })

    return openPracticeSelection(recommendation)
  }

  function dismissRecommendation(recommendation) {
    if (!recommendation?.id) return

    dispatch({
      type: 'DISMISS_RECOMMENDATION',
      payload: {
        recommendationId: recommendation.id,
        recommendationType: recommendation.type,
      },
    })
  }

  function openMasteryMapSelection({ skillId = null, topicId = null, expandedTopicIds = null } = {}) {
    dispatch({
      type: 'OPEN_MASTERY_MAP',
      payload: {
        mastery: {
          selectedSkillId: skillId,
          expandedTopicIds: Array.isArray(expandedTopicIds)
            ? expandedTopicIds
            : (topicId ? [topicId] : appState.mastery.expandedTopicIds),
          filters: {
            ...appState.mastery.filters,
            gradeBand: appState.onboarding.learnerProfile.recommendedGradeBand || appState.mastery.filters.gradeBand,
          },
        },
      },
    })
  }

  useEffect(() => {
    fetchTopics(appState.language).then(setTopics).catch(console.error)
  }, [appState.language])

  useEffect(() => {
    if (!topics.length) return

    const nextRecommendations = buildRecommendations({
      appState,
      topics,
      masteryData,
      previousRecommendations: appState.recommendations,
    })

    if (!statesAreEqual(nextRecommendations, appState.recommendations)) {
      dispatch({
        type: 'SET_RECOMMENDATIONS',
        payload: {
          recommendations: nextRecommendations,
        },
      })
    }
  }, [appState, topics, masteryData])

  useEffect(() => {
    document.documentElement.lang = locale.lang
    document.documentElement.dir = locale.dir
  }, [locale.dir, locale.lang])

  useEffect(() => {
    const storageKey = authState.status === 'ready' && authState.user
      ? getUserStorageKey(authState.user.uid)
      : ANONYMOUS_STORAGE_KEY

    writeStoredState(storageKey, appState)
  }, [appState, authState.status, authState.user])

  useEffect(() => {
    if (!isFirebaseConfigured) return

    let isCancelled = false
    let unsubscribe = () => {}

    async function initializeAuth() {
      try {
        await ensureFirebaseAuthPersistence()
        if (isCancelled) return

        unsubscribe = await subscribeToFirebaseAuth(user => {
          if (isCancelled) return

          setAuthState(current => ({
            ...current,
            status: 'ready',
            user,
            error: null,
            action: 'idle',
          }))
        })
      } catch (error) {
        if (isCancelled) return

        const message = formatFirebaseError(error)
        setAuthState({
          status: 'error',
          user: null,
          error: message,
          action: 'idle',
        })
        setSyncState({
          status: 'error',
          error: message,
          lastSyncedAt: null,
        })
      }
    }

    initializeAuth()

    return () => {
      isCancelled = true
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isFirebaseConfigured || authState.status !== 'ready') return

    let isCancelled = false

    async function syncSignedInUser(user) {
      setSyncState({
        status: 'loading',
        error: null,
        lastSyncedAt: null,
      })

      try {
        const localState = appStateRef.current
        const userCachedState = readStoredState(getUserStorageKey(user.uid))
        const preferredLocalState = userCachedState && userCachedState.lastModifiedAt > localState.lastModifiedAt
          ? userCachedState
          : localState
        const remoteProgress = await loadRemoteProgress(user.uid)

        if (isCancelled) return

        if (!remoteProgress?.state) {
          if (!statesAreEqual(preferredLocalState, appStateRef.current)) {
            skipNextRemoteSaveRef.current = true
            dispatch({ type: 'HYDRATE_STATE', payload: { state: preferredLocalState } })
          }

          await saveRemoteProgress(user.uid, preferredLocalState)
          if (isCancelled) return

          hydratedUserIdRef.current = user.uid
          previousUserIdRef.current = user.uid
          setSyncState({
            status: 'ready',
            error: null,
            lastSyncedAt: Date.now(),
          })
          return
        }

        const remoteState = normalizePersistedState(remoteProgress.state)
        const remoteIsNewer = (remoteProgress.clientUpdatedAt || remoteState.lastModifiedAt) > preferredLocalState.lastModifiedAt

        if (remoteIsNewer) {
          if (!statesAreEqual(remoteState, appStateRef.current)) {
            skipNextRemoteSaveRef.current = true
            dispatch({ type: 'HYDRATE_STATE', payload: { state: remoteState } })
          }
        } else {
          if (!statesAreEqual(preferredLocalState, appStateRef.current)) {
            skipNextRemoteSaveRef.current = true
            dispatch({ type: 'HYDRATE_STATE', payload: { state: preferredLocalState } })
          }

          if (!statesAreEqual(remoteState, preferredLocalState)) {
            await saveRemoteProgress(user.uid, preferredLocalState)
            if (isCancelled) return
          }
        }

        hydratedUserIdRef.current = user.uid
        previousUserIdRef.current = user.uid
        setSyncState({
          status: 'ready',
          error: null,
          lastSyncedAt: remoteProgress.lastSyncedAt || Date.now(),
        })
      } catch (error) {
        if (isCancelled) return

        setSyncState({
          status: 'error',
          error: formatFirebaseError(error),
          lastSyncedAt: null,
        })
      }
    }

    if (!authState.user) {
      const previousUserId = previousUserIdRef.current
      hydratedUserIdRef.current = null
      previousUserIdRef.current = null
      skipNextRemoteSaveRef.current = false

      if (previousUserId) {
        const anonymousState = readStoredState(ANONYMOUS_STORAGE_KEY) || initialState
        if (!statesAreEqual(anonymousState, appStateRef.current)) {
          dispatch({ type: 'HYDRATE_STATE', payload: { state: anonymousState } })
        }
      }

      setSyncState({
        status: 'signed-out',
        error: null,
        lastSyncedAt: null,
      })
      return () => {
        isCancelled = true
      }
    }

    syncSignedInUser(authState.user)

    return () => {
      isCancelled = true
    }
  }, [authState.status, authState.user])

  useEffect(() => {
    if (!isFirebaseConfigured) return
    if (authState.status !== 'ready' || !authState.user) return
    if (hydratedUserIdRef.current !== authState.user.uid) return

    if (skipNextRemoteSaveRef.current) {
      skipNextRemoteSaveRef.current = false
      return
    }

    let isCancelled = false
    const saveTimer = window.setTimeout(async () => {
      setSyncState(current => ({
        ...current,
        status: 'saving',
        error: null,
      }))

      try {
        await saveRemoteProgress(authState.user.uid, appState)
        if (isCancelled) return

        setSyncState({
          status: 'ready',
          error: null,
          lastSyncedAt: Date.now(),
        })
      } catch (error) {
        if (isCancelled) return

        setSyncState(current => ({
          ...current,
          status: 'error',
          error: formatFirebaseError(error),
        }))
      }
    }, 700)

    return () => {
      isCancelled = true
      window.clearTimeout(saveTimer)
    }
  }, [appState, authState.status, authState.user])

  return (
    <AppContext.Provider
      value={{
        appState,
        dispatch,
        topics,
        locale,
        language: appState.language,
        isRTL: locale.dir === 'rtl',
        authState,
        syncState,
        isCloudSyncEnabled: isFirebaseConfigured,
        hasSavedWork,
        isOnboardingBlocking,
        shouldShowOnboardingPrompt,
        masteryData,
        setLanguage,
        signInWithGoogle,
        signOutUser,
        openPracticeSelection,
        startRecommendation,
        dismissRecommendation,
        openMasteryMapSelection,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}


