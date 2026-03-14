import {
  LEVELS,
  filterExerciseIdsByLevel,
  getExerciseLevelId,
  resolveTopicLevel,
} from './levels'
import { getRecommendedLaunchSelection } from './onboarding'
import {
  buildMasteryData,
  getLocalizedSkillLabel,
  getPracticeSelectionForSkill,
  getSkillIdForExercise,
} from './mastery'

const RECOMMENDATION_TYPES = ['continue', 'level_up', 'recovery', 'bridge', 'review']

const RECOMMENDATION_PRIORITY = {
  recovery: 0,
  level_up: 1,
  continue: 2,
  bridge: 3,
  review: 4,
}

const BRIDGE_TOPICS = {
  fractions: 'decimals',
  decimals: 'percentages',
  percentages: 'algebra',
  algebra: 'arithmetic-progression',
}

const LEVEL_ORDER = Object.fromEntries(LEVELS.map(level => [level.id, level.number]))

function createEmptyRecommendation() {
  return {
    id: null,
    type: null,
    topicId: null,
    exerciseId: null,
    levelId: null,
    skillId: null,
    reasonKey: null,
    reasonParams: {},
    generatedAt: 0,
    basedOnExerciseId: null,
    basedOnSkillId: null,
    confidence: null,
  }
}

export function createInitialRecommendationsState() {
  return {
    primary: createEmptyRecommendation(),
    alternatives: [],
    lastAction: {
      acceptedAt: 0,
      dismissedAt: 0,
      type: null,
      recommendationId: null,
    },
    dismissedRecommendationIds: [],
    lastComputedFrom: {
      signature: null,
      activeTopic: null,
      activeExerciseId: null,
      selectedLevel: null,
      learnerProfileVersion: 0,
      exerciseStatesVersion: 0,
    },
  }
}

function normalizeRecommendation(recommendation = {}) {
  const initial = createEmptyRecommendation()

  return {
    ...initial,
    ...recommendation,
    type: RECOMMENDATION_TYPES.includes(recommendation.type) ? recommendation.type : null,
    topicId: typeof recommendation.topicId === 'string' ? recommendation.topicId : null,
    exerciseId: typeof recommendation.exerciseId === 'string' ? recommendation.exerciseId : null,
    levelId: typeof recommendation.levelId === 'string' ? recommendation.levelId : null,
    skillId: typeof recommendation.skillId === 'string' ? recommendation.skillId : null,
    reasonKey: typeof recommendation.reasonKey === 'string' ? recommendation.reasonKey : null,
    reasonParams: recommendation.reasonParams && typeof recommendation.reasonParams === 'object'
      ? recommendation.reasonParams
      : {},
    generatedAt: Number.isFinite(recommendation.generatedAt) ? recommendation.generatedAt : 0,
    basedOnExerciseId: typeof recommendation.basedOnExerciseId === 'string'
      ? recommendation.basedOnExerciseId
      : null,
    basedOnSkillId: typeof recommendation.basedOnSkillId === 'string'
      ? recommendation.basedOnSkillId
      : null,
    confidence: ['high', 'medium', 'low'].includes(recommendation.confidence)
      ? recommendation.confidence
      : null,
  }
}

export function normalizeRecommendationsState(recommendations = {}) {
  const initial = createInitialRecommendationsState()
  const lastAction = recommendations.lastAction || {}
  const lastComputedFrom = recommendations.lastComputedFrom || {}

  return {
    ...initial,
    ...recommendations,
    primary: normalizeRecommendation(recommendations.primary),
    alternatives: Array.isArray(recommendations.alternatives)
      ? recommendations.alternatives.map(normalizeRecommendation).filter(recommendation => recommendation.id)
      : [],
    lastAction: {
      ...initial.lastAction,
      ...lastAction,
      acceptedAt: Number.isFinite(lastAction.acceptedAt) ? lastAction.acceptedAt : 0,
      dismissedAt: Number.isFinite(lastAction.dismissedAt) ? lastAction.dismissedAt : 0,
      type: RECOMMENDATION_TYPES.includes(lastAction.type) ? lastAction.type : null,
      recommendationId: typeof lastAction.recommendationId === 'string' ? lastAction.recommendationId : null,
    },
    dismissedRecommendationIds: Array.isArray(recommendations.dismissedRecommendationIds)
      ? recommendations.dismissedRecommendationIds.filter(id => typeof id === 'string')
      : [],
    lastComputedFrom: {
      ...initial.lastComputedFrom,
      ...lastComputedFrom,
      signature: typeof lastComputedFrom.signature === 'string' ? lastComputedFrom.signature : null,
      activeTopic: typeof lastComputedFrom.activeTopic === 'string' ? lastComputedFrom.activeTopic : null,
      activeExerciseId: typeof lastComputedFrom.activeExerciseId === 'string' ? lastComputedFrom.activeExerciseId : null,
      selectedLevel: typeof lastComputedFrom.selectedLevel === 'string' ? lastComputedFrom.selectedLevel : null,
      learnerProfileVersion: Number.isFinite(lastComputedFrom.learnerProfileVersion)
        ? lastComputedFrom.learnerProfileVersion
        : 0,
      exerciseStatesVersion: Number.isFinite(lastComputedFrom.exerciseStatesVersion)
        ? lastComputedFrom.exerciseStatesVersion
        : 0,
    },
  }
}

function buildSourceSignature(appState) {
  const learnerProfile = appState.onboarding?.learnerProfile || {}
  const exerciseDigest = Object.entries(appState.exerciseStates || {})
    .map(([exerciseId, state]) => ([
      exerciseId,
      state?.status || 'pending',
      state?.attempts || 0,
      state?.hintIndex || 0,
      state?.showExplanation ? 1 : 0,
      state?.lastPracticedAt || 0,
      state?.lastOutcomeAt || 0,
    ]))
    .sort((left, right) => left[0].localeCompare(right[0]))

  return JSON.stringify({
    activeTopic: appState.activeTopic,
    activeExerciseId: appState.activeExerciseId,
    selectedLevel: appState.selectedLevel,
    onboardingStatus: appState.onboarding?.status,
    learnerProfile: {
      recommendedGradeBand: learnerProfile.recommendedGradeBand || null,
      recommendedTopics: learnerProfile.recommendedTopics || [],
      recommendedLevelsByTopic: learnerProfile.recommendedLevelsByTopic || {},
      strengths: learnerProfile.strengths || [],
      growthAreas: learnerProfile.growthAreas || [],
      confidenceScore: learnerProfile.confidenceScore || 0,
    },
    mastery: {
      selectedSkillId: appState.mastery?.selectedSkillId || null,
      gradeBand: appState.mastery?.filters?.gradeBand || 'all',
      topicId: appState.mastery?.filters?.topicId || 'all',
    },
    exerciseDigest,
  })
}

function getProfileVersion(learnerProfile = {}) {
  return JSON.stringify({
    recommendedGradeBand: learnerProfile.recommendedGradeBand || null,
    recommendedTopics: learnerProfile.recommendedTopics || [],
    recommendedLevelsByTopic: learnerProfile.recommendedLevelsByTopic || {},
    strengths: learnerProfile.strengths || [],
    growthAreas: learnerProfile.growthAreas || [],
    confidenceScore: learnerProfile.confidenceScore || 0,
  }).length
}

function getExerciseStatesVersion(exerciseStates = {}) {
  return Object.values(exerciseStates).reduce((version, state) => {
    return version
      + (state?.attempts || 0)
      + (state?.hintIndex || 0)
      + (state?.lastPracticedAt || 0)
      + (state?.lastOutcomeAt || 0)
  }, Object.keys(exerciseStates).length)
}

function getActivityTimestamp(state = {}) {
  return state.lastOutcomeAt || state.lastPracticedAt || 0
}

function getTopicActivities(topic, exerciseStates = {}) {
  return (topic?.exercises || [])
    .map(exerciseId => {
      const state = exerciseStates[exerciseId]
      const timestamp = getActivityTimestamp(state)
      if (!state || !timestamp) return null

      const attempts = state.attempts || 0
      const hintsUsed = state.hintIndex || 0
      const status = state.status || 'pending'
      const solved = status === 'solved'
      const struggling = status === 'failed'
        || status === 'explanation_shown'
        || (!solved && attempts >= 2 && hintsUsed >= 2)

      return {
        topicId: topic.id,
        exerciseId,
        levelId: getExerciseLevelId(exerciseId),
        status,
        attempts,
        hintsUsed,
        timestamp,
        solved,
        cleanSolved: solved && attempts <= 1 && hintsUsed <= 1,
        struggling,
        skillId: getSkillIdForExercise(exerciseId),
      }
    })
    .filter(Boolean)
    .sort((left, right) => right.timestamp - left.timestamp)
}

function getAllActivities(topics = [], exerciseStates = {}) {
  return topics
    .flatMap(topic => getTopicActivities(topic, exerciseStates))
    .sort((left, right) => right.timestamp - left.timestamp)
}

function countTopicRun(activities, topicId, matcher) {
  let count = 0

  for (const activity of activities) {
    if (activity.topicId !== topicId || !matcher(activity)) break
    count += 1
  }

  return count
}

function getHigherLevel(topic, levelId) {
  const levelIds = [...new Set((topic?.exercises || []).map(getExerciseLevelId).filter(Boolean))]
    .sort((left, right) => (LEVEL_ORDER[left] || 0) - (LEVEL_ORDER[right] || 0))
  const currentIndex = levelIds.indexOf(levelId)

  return currentIndex >= 0 ? levelIds[currentIndex + 1] || null : null
}

function getLowerLevel(topic, levelId) {
  const levelIds = [...new Set((topic?.exercises || []).map(getExerciseLevelId).filter(Boolean))]
    .sort((left, right) => (LEVEL_ORDER[left] || 0) - (LEVEL_ORDER[right] || 0))
  const currentIndex = levelIds.indexOf(levelId)

  return currentIndex > 0 ? levelIds[currentIndex - 1] : null
}

function getUnsolvedExercises(topic, exerciseStates = {}, levelId, excludedExerciseIds = []) {
  const pool = levelId
    ? filterExerciseIdsByLevel(topic?.exercises || [], levelId)
    : (topic?.exercises || [])
  const excluded = new Set(excludedExerciseIds.filter(Boolean))

  return pool.filter(exerciseId => {
    if (excluded.has(exerciseId)) return false
    return exerciseStates[exerciseId]?.status !== 'solved'
  })
}

function getFallbackExercise(topic, exerciseStates = {}, preferredLevelId, excludedExerciseIds = []) {
  const resolvedLevel = preferredLevelId
    ? resolveTopicLevel(topic?.exercises || [], preferredLevelId)
    : null
  const preferredExercises = resolvedLevel
    ? getUnsolvedExercises(topic, exerciseStates, resolvedLevel, excludedExerciseIds)
    : []

  if (preferredExercises.length > 0) return preferredExercises[0]

  const unsolvedAcrossTopic = getUnsolvedExercises(topic, exerciseStates, null, excludedExerciseIds)
  if (unsolvedAcrossTopic.length > 0) return unsolvedAcrossTopic[0]

  return (topic?.exercises || []).find(exerciseId => !excludedExerciseIds.includes(exerciseId)) || null
}

function createRecommendation(candidate) {
  const id = [
    candidate.type,
    candidate.topicId,
    candidate.exerciseId,
    candidate.levelId,
    candidate.skillId,
    candidate.reasonKey,
  ].join(':')

  return {
    ...createEmptyRecommendation(),
    ...candidate,
    id,
  }
}

function dedupeRecommendations(candidates) {
  const seen = new Set()

  return candidates.filter(candidate => {
    if (!candidate?.id || seen.has(candidate.id)) return false
    seen.add(candidate.id)
    return true
  })
}

function preserveGeneratedAt(recommendation, currentRecommendations, now) {
  if (!recommendation?.id) return createEmptyRecommendation()

  const pool = [currentRecommendations.primary, ...(currentRecommendations.alternatives || [])]
  const previousMatch = pool.find(entry => entry?.id === recommendation.id)

  return {
    ...recommendation,
    generatedAt: previousMatch?.generatedAt || now,
  }
}

function getBestReviewSkill(masteryData) {
  return [...(masteryData?.skills || [])]
    .filter(skill => skill.selectedExerciseId)
    .sort((left, right) => {
      const leftNeedsReview = left.state === 'needs_review' ? 0 : 1
      const rightNeedsReview = right.state === 'needs_review' ? 0 : 1
      if (leftNeedsReview !== rightNeedsReview) return leftNeedsReview - rightNeedsReview
      if (left.lastPracticedAt !== right.lastPracticedAt) {
        return (left.lastPracticedAt || 0) - (right.lastPracticedAt || 0)
      }
      return left.masteryPercent - right.masteryPercent
    })[0] || null
}

function buildRecoveryCandidate(context) {
  const { anchorActivity, appState, exerciseStates, topicById } = context
  if (!anchorActivity?.struggling) return null

  const topic = topicById[anchorActivity.topicId]
  if (!topic) return null

  const lowerLevelId = getLowerLevel(topic, anchorActivity.levelId || appState.selectedLevel)
  const preferredExerciseId = getFallbackExercise(
    topic,
    exerciseStates,
    lowerLevelId || anchorActivity.levelId || appState.selectedLevel,
    [appState.activeExerciseId, anchorActivity.exerciseId]
  )

  if (!preferredExerciseId) return null

  return createRecommendation({
    type: 'recovery',
    topicId: topic.id,
    exerciseId: preferredExerciseId,
    levelId: getExerciseLevelId(preferredExerciseId),
    skillId: getSkillIdForExercise(preferredExerciseId) || anchorActivity.skillId,
    reasonKey: anchorActivity.status === 'failed' ? 'recentStruggle' : 'heavySupport',
    reasonParams: {
      topicId: topic.id,
      count: context.struggleStreakByTopic[topic.id] || 1,
    },
    confidence: 'high',
    basedOnExerciseId: anchorActivity.exerciseId,
    basedOnSkillId: anchorActivity.skillId,
  })
}

function buildLevelUpCandidate(context) {
  const { anchorActivity, topicById, exerciseStates, cleanSolvedStreakByTopic } = context
  if (!anchorActivity?.solved) return null

  const cleanStreak = cleanSolvedStreakByTopic[anchorActivity.topicId] || 0
  if (cleanStreak < 3) return null

  const topic = topicById[anchorActivity.topicId]
  const nextLevelId = topic ? getHigherLevel(topic, anchorActivity.levelId) : null
  if (!topic || !nextLevelId) return null

  const exerciseId = getFallbackExercise(topic, exerciseStates, nextLevelId, [anchorActivity.exerciseId])
  if (!exerciseId || getExerciseLevelId(exerciseId) !== nextLevelId) return null

  return createRecommendation({
    type: 'level_up',
    topicId: topic.id,
    exerciseId,
    levelId: nextLevelId,
    skillId: getSkillIdForExercise(exerciseId),
    reasonKey: 'cleanStreak',
    reasonParams: {
      topicId: topic.id,
      count: cleanStreak,
    },
    confidence: 'high',
    basedOnExerciseId: anchorActivity.exerciseId,
    basedOnSkillId: anchorActivity.skillId,
  })
}

function buildContinueCandidate(context) {
  const { anchorActivity, appState, topicById, exerciseStates } = context
  const targetTopicId = anchorActivity?.topicId || appState.activeTopic
  if (!targetTopicId) return null

  const topic = topicById[targetTopicId]
  if (!topic) return null

  const preferredLevelId = anchorActivity?.levelId || appState.selectedLevel
  const exerciseId = getFallbackExercise(topic, exerciseStates, preferredLevelId, [appState.activeExerciseId])
  if (!exerciseId) return null

  return createRecommendation({
    type: 'continue',
    topicId: topic.id,
    exerciseId,
    levelId: getExerciseLevelId(exerciseId),
    skillId: getSkillIdForExercise(exerciseId),
    reasonKey: anchorActivity?.solved ? 'sameTopicMomentum' : 'pathSuggestion',
    reasonParams: {
      topicId: topic.id,
    },
    confidence: anchorActivity?.solved ? 'high' : 'medium',
    basedOnExerciseId: anchorActivity?.exerciseId || null,
    basedOnSkillId: anchorActivity?.skillId || null,
  })
}

function buildBridgeCandidate(context) {
  const { anchorActivity, topicById, exerciseStates, cleanSolvedStreakByTopic, lastAction } = context
  if (!anchorActivity?.solved) return null
  if (cleanSolvedStreakByTopic[anchorActivity.topicId] < 3) return null
  if (lastAction?.type === 'bridge' && lastAction.dismissedAt > lastAction.acceptedAt) return null

  const nextTopicId = BRIDGE_TOPICS[anchorActivity.topicId]
  const nextTopic = nextTopicId ? topicById[nextTopicId] : null
  if (!nextTopic) return null

  const exerciseId = getFallbackExercise(nextTopic, exerciseStates, null, [anchorActivity.exerciseId])
  if (!exerciseId) return null

  return createRecommendation({
    type: 'bridge',
    topicId: nextTopic.id,
    exerciseId,
    levelId: getExerciseLevelId(exerciseId),
    skillId: getSkillIdForExercise(exerciseId),
    reasonKey: 'bridgeReady',
    reasonParams: {
      fromTopicId: anchorActivity.topicId,
      topicId: nextTopic.id,
      count: cleanSolvedStreakByTopic[anchorActivity.topicId],
    },
    confidence: 'medium',
    basedOnExerciseId: anchorActivity.exerciseId,
    basedOnSkillId: anchorActivity.skillId,
  })
}

function buildReviewCandidate(context) {
  const { masteryData, topics, exerciseStates, anchorActivity } = context
  const reviewSkill = getBestReviewSkill(masteryData)
  if (!reviewSkill) return null

  const selection = getPracticeSelectionForSkill(reviewSkill.id, topics, exerciseStates)
  if (!selection) return null

  const daysAgo = reviewSkill.lastPracticedAt
    ? Math.floor((Date.now() - reviewSkill.lastPracticedAt) / (24 * 60 * 60 * 1000))
    : 0

  return createRecommendation({
    type: 'review',
    topicId: selection.topicId,
    exerciseId: selection.exerciseId,
    levelId: selection.levelId,
    skillId: reviewSkill.id,
    reasonKey: daysAgo >= 3 ? 'coldTopic' : 'needsReview',
    reasonParams: {
      topicId: selection.topicId,
      days: Math.max(daysAgo, 1),
    },
    confidence: anchorActivity ? 'medium' : 'high',
    basedOnExerciseId: reviewSkill.selectedExerciseId,
    basedOnSkillId: reviewSkill.id,
  })
}

function buildFallbackCandidate(context) {
  const { appState, topics, exerciseStates, masteryData, topicById } = context
  const profile = appState.onboarding?.learnerProfile || {}
  const onboardingSelection = getRecommendedLaunchSelection(profile, topics, exerciseStates)
  if (onboardingSelection) {
    return createRecommendation({
      type: 'continue',
      topicId: onboardingSelection.topicId,
      exerciseId: onboardingSelection.exerciseId,
      levelId: onboardingSelection.levelId,
      skillId: getSkillIdForExercise(onboardingSelection.exerciseId),
      reasonKey: 'pathSuggestion',
      reasonParams: {
        topicId: onboardingSelection.topicId,
      },
      confidence: 'medium',
    })
  }

  const masterySelection = masteryData?.recommendedSkillId
    ? getPracticeSelectionForSkill(masteryData.recommendedSkillId, topics, exerciseStates)
    : null
  if (masterySelection) {
    return createRecommendation({
      type: 'review',
      topicId: masterySelection.topicId,
      exerciseId: masterySelection.exerciseId,
      levelId: masterySelection.levelId,
      skillId: masteryData.recommendedSkillId,
      reasonKey: 'masterySuggestion',
      reasonParams: {
        topicId: masterySelection.topicId,
      },
      confidence: 'medium',
      basedOnSkillId: masteryData.recommendedSkillId,
    })
  }

  const topic = topicById[appState.activeTopic] || topics[0]
  if (!topic) return null

  const exerciseId = getFallbackExercise(topic, exerciseStates, appState.selectedLevel, [appState.activeExerciseId])
  if (!exerciseId) return null

  return createRecommendation({
    type: 'continue',
    topicId: topic.id,
    exerciseId,
    levelId: getExerciseLevelId(exerciseId),
    skillId: getSkillIdForExercise(exerciseId),
    reasonKey: 'pathSuggestion',
    reasonParams: {
      topicId: topic.id,
    },
    confidence: 'low',
  })
}

export function buildRecommendations({ appState, topics = [], masteryData, previousRecommendations, now = Date.now() }) {
  const currentRecommendations = normalizeRecommendationsState(previousRecommendations)
  if (!topics.length) return currentRecommendations

  const resolvedMasteryData = masteryData || buildMasteryData({
    topics,
    exerciseStates: appState.exerciseStates,
    onboarding: appState.onboarding,
    mastery: appState.mastery,
  })
  const topicById = Object.fromEntries(topics.map(topic => [topic.id, topic]))
  const allActivities = getAllActivities(topics, appState.exerciseStates)
  const anchorActivity = allActivities[0] || null
  const sourceSignature = buildSourceSignature(appState)
  const sourceChanged = currentRecommendations.lastComputedFrom.signature !== sourceSignature
  const dismissedRecommendationIds = sourceChanged ? [] : currentRecommendations.dismissedRecommendationIds

  const cleanSolvedStreakByTopic = topics.reduce((streaks, topic) => {
    streaks[topic.id] = countTopicRun(allActivities, topic.id, activity => activity.cleanSolved)
    return streaks
  }, {})

  const struggleStreakByTopic = topics.reduce((streaks, topic) => {
    streaks[topic.id] = countTopicRun(allActivities, topic.id, activity => activity.struggling)
    return streaks
  }, {})

  const context = {
    appState,
    topics,
    topicById,
    exerciseStates: appState.exerciseStates,
    masteryData: resolvedMasteryData,
    anchorActivity,
    cleanSolvedStreakByTopic,
    struggleStreakByTopic,
    lastAction: currentRecommendations.lastAction,
  }

  const candidates = dedupeRecommendations([
    buildRecoveryCandidate(context),
    buildLevelUpCandidate(context),
    buildContinueCandidate(context),
    buildBridgeCandidate(context),
    buildReviewCandidate(context),
    buildFallbackCandidate(context),
  ].filter(Boolean))
    .sort((left, right) => RECOMMENDATION_PRIORITY[left.type] - RECOMMENDATION_PRIORITY[right.type])
    .filter(candidate => !dismissedRecommendationIds.includes(candidate.id))

  const primaryCandidate = candidates[0] || createEmptyRecommendation()
  const alternativeCandidates = candidates.slice(primaryCandidate.id ? 1 : 0, primaryCandidate.id ? 3 : 2)

  return normalizeRecommendationsState({
    primary: preserveGeneratedAt(primaryCandidate, currentRecommendations, now),
    alternatives: alternativeCandidates.map(candidate => preserveGeneratedAt(candidate, currentRecommendations, now)),
    lastAction: currentRecommendations.lastAction,
    dismissedRecommendationIds,
    lastComputedFrom: {
      signature: sourceSignature,
      activeTopic: appState.activeTopic,
      activeExerciseId: appState.activeExerciseId,
      selectedLevel: appState.selectedLevel,
      learnerProfileVersion: getProfileVersion(appState.onboarding?.learnerProfile),
      exerciseStatesVersion: getExerciseStatesVersion(appState.exerciseStates),
    },
  })
}

export function getRecommendationBadgeKey(type) {
  return type ? `recommendations.types.${type}` : 'recommendations.title'
}

export function getRecommendationPrimaryActionKey(type) {
  switch (type) {
    case 'recovery':
      return 'recommendations.actions.tryWarmup'
    case 'level_up':
      return 'recommendations.actions.moveUp'
    case 'bridge':
      return 'recommendations.actions.tryNextTopic'
    case 'review':
      return 'recommendations.actions.startReview'
    case 'continue':
    default:
      return 'recommendations.actions.keepGoing'
  }
}

export function getRecommendationNextTitleKey(type) {
  switch (type) {
    case 'recovery':
      return 'recommendations.actions.nextRecoveryTitle'
    case 'level_up':
      return 'recommendations.actions.nextLevelUpTitle'
    case 'bridge':
      return 'recommendations.actions.nextBridgeTitle'
    case 'review':
      return 'recommendations.actions.nextReviewTitle'
    case 'continue':
    default:
      return 'recommendations.actions.nextContinueTitle'
  }
}

export function getRecommendationEffortKey(type) {
  switch (type) {
    case 'level_up':
    case 'bridge':
      return 'recommendations.effort.medium'
    default:
      return 'recommendations.effort.short'
  }
}

export function getRecommendationFitKey(confidence) {
  switch (confidence) {
    case 'high':
      return 'recommendations.fit.high'
    case 'medium':
      return 'recommendations.fit.medium'
    default:
      return 'recommendations.fit.low'
  }
}

export function getRecommendationTitle(recommendation, { topics = [], t, language = 'en', masteryData }) {
  const topicName = topics.find(topic => topic.id === recommendation.topicId)?.name || recommendation.topicId
  const skill = recommendation.skillId ? masteryData?.skillsById?.[recommendation.skillId] : null
  const skillLabel = skill ? getLocalizedSkillLabel(skill, language) : null

  switch (recommendation.type) {
    case 'recovery':
      return t('recommendations.titles.recovery', { topic: topicName })
    case 'level_up':
      return t('recommendations.titles.level_up', { topic: topicName })
    case 'bridge':
      return t('recommendations.titles.bridge', { topic: topicName })
    case 'review':
      return t('recommendations.titles.review', { topic: topicName, skill: skillLabel || topicName })
    case 'continue':
    default:
      return t('recommendations.titles.continue', { topic: topicName })
  }
}

export function getRecommendationReason(recommendation, { topics = [], t, language = 'en', masteryData }) {
  const resolveTopicName = topicId => topics.find(topic => topic.id === topicId)?.name || topicId
  const skill = recommendation.skillId ? masteryData?.skillsById?.[recommendation.skillId] : null
  const skillLabel = skill ? getLocalizedSkillLabel(skill, language) : null
  const params = {
    ...recommendation.reasonParams,
    topic: resolveTopicName(recommendation.reasonParams?.topicId || recommendation.topicId),
    fromTopic: resolveTopicName(recommendation.reasonParams?.fromTopicId),
    skill: skillLabel || resolveTopicName(recommendation.topicId),
  }

  return recommendation.reasonKey
    ? t(`recommendations.reasons.${recommendation.reasonKey}`, params)
    : t('recommendations.reasons.pathSuggestion', params)
}

export function getRecommendationExplanation(recommendation, { topics = [], t, language = 'en', masteryData, alternative }) {
  const skill = recommendation.skillId ? masteryData?.skillsById?.[recommendation.skillId] : null
  const skillLabel = skill ? getLocalizedSkillLabel(skill, language) : null
  const alternativeTopic = alternative?.topicId
    ? topics.find(topic => topic.id === alternative.topicId)?.name || alternative.topicId
    : null

  return {
    why: getRecommendationReason(recommendation, { topics, t, language, masteryData }),
    helpsWith: skillLabel
      ? t('recommendations.explanation.skill', { skill: skillLabel })
      : t('recommendations.explanation.topic', {
        topic: topics.find(topic => topic.id === recommendation.topicId)?.name || recommendation.topicId,
      }),
    alternative: alternativeTopic
      ? t('recommendations.explanation.alternative', { topic: alternativeTopic })
      : t('recommendations.explanation.manual'),
  }
}
