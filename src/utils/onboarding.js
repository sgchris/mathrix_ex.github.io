import { filterExerciseIdsByLevel, getAvailableLevels, normalizeLevelId } from './levels'

export const DIAGNOSTIC_TOTAL_QUESTIONS = 6

export const GRADE_BAND_OPTIONS = [
  { id: 'grade6', icon: '△' },
  { id: 'grade7', icon: '◌' },
  { id: 'prealgebra', icon: '⬡' },
  { id: 'unsure', icon: '?' },
]

const PATH_CONFIGS = {
  grade6: {
    topics: ['fractions', 'decimals', 'percentages'],
    levels: {
      fractions: 'level01',
      decimals: 'level01',
      percentages: 'level01',
    },
  },
  grade7: {
    topics: ['fractions', 'percentages', 'algebra'],
    levels: {
      fractions: 'level03',
      percentages: 'level03',
      algebra: 'level02',
    },
    higherLevels: {
      fractions: 'level03',
      percentages: 'level03',
      algebra: 'level03',
    },
  },
  prealgebra: {
    topics: ['algebra', 'arithmetic-progression', 'percentages'],
    levels: {
      algebra: 'level03',
      'arithmetic-progression': 'level03',
      percentages: 'level03',
    },
    higherLevels: {
      algebra: 'level05',
      'arithmetic-progression': 'level03',
      percentages: 'level05',
    },
  },
}

const DIAGNOSTIC_QUESTION_BANK = {
  'fractions-level01-001': {
    topicId: 'fractions',
    levelId: 'level01',
    category: 'foundation',
  },
  'fractions-level03-003': {
    topicId: 'fractions',
    levelId: 'level03',
    category: 'foundation',
  },
  'fractions-level07-026': {
    topicId: 'fractions',
    levelId: 'level07',
    category: 'foundation',
  },
  'decimals-level01-001': {
    topicId: 'decimals',
    levelId: 'level01',
    category: 'foundation',
  },
  'decimals-level01-002': {
    topicId: 'decimals',
    levelId: 'level01',
    category: 'foundation',
  },
  'decimals-level03-011': {
    topicId: 'decimals',
    levelId: 'level03',
    category: 'foundation',
  },
  'percentages-level01-001': {
    topicId: 'percentages',
    levelId: 'level01',
    category: 'transfer',
  },
  'percentages-level01-002': {
    topicId: 'percentages',
    levelId: 'level01',
    category: 'transfer',
  },
  'percentages-level03-003': {
    topicId: 'percentages',
    levelId: 'level03',
    category: 'transfer',
  },
  'percentages-level03-011': {
    topicId: 'percentages',
    levelId: 'level03',
    category: 'transfer',
  },
  'percentages-level05-009': {
    topicId: 'percentages',
    levelId: 'level05',
    category: 'transfer',
  },
  'algebra-level01-026': {
    topicId: 'algebra',
    levelId: 'level01',
    category: 'symbolic',
  },
  'algebra-level02-046': {
    topicId: 'algebra',
    levelId: 'level02',
    category: 'symbolic',
  },
  'algebra-level03-003': {
    topicId: 'algebra',
    levelId: 'level03',
    category: 'symbolic',
  },
  'arithmetic-progression-level01-001': {
    topicId: 'arithmetic-progression',
    levelId: 'level01',
    category: 'symbolic',
  },
  'arithmetic-progression-level03-016': {
    topicId: 'arithmetic-progression',
    levelId: 'level03',
    category: 'symbolic',
  },
  'arithmetic-progression-level03-020': {
    topicId: 'arithmetic-progression',
    levelId: 'level03',
    category: 'symbolic',
  },
}

const DIAGNOSTIC_PLANS = {
  grade6: {
    initial: ['fractions-level01-001', 'decimals-level01-002', 'percentages-level01-001'],
    easy: ['percentages-level01-002', 'algebra-level01-026', 'arithmetic-progression-level01-001'],
    hard: ['percentages-level03-003', 'algebra-level02-046', 'arithmetic-progression-level03-016'],
  },
  grade7: {
    initial: ['fractions-level03-003', 'decimals-level03-011', 'percentages-level03-011'],
    easy: ['percentages-level03-003', 'algebra-level01-026', 'arithmetic-progression-level01-001'],
    hard: ['percentages-level05-009', 'algebra-level03-003', 'arithmetic-progression-level03-016'],
  },
  prealgebra: {
    initial: ['fractions-level03-003', 'decimals-level03-011', 'algebra-level03-003'],
    easy: ['percentages-level03-003', 'percentages-level03-011', 'arithmetic-progression-level01-001'],
    hard: ['percentages-level05-009', 'arithmetic-progression-level03-020', 'fractions-level07-026'],
  },
  unsure: {
    initial: ['fractions-level01-001', 'decimals-level01-001', 'percentages-level01-001'],
    easy: ['percentages-level01-002', 'algebra-level01-026', 'arithmetic-progression-level01-001'],
    hard: ['percentages-level03-003', 'algebra-level03-003', 'arithmetic-progression-level03-016'],
  },
}

function createInitialLearnerProfile() {
  return {
    recommendedGradeBand: null,
    recommendedTopics: [],
    recommendedLevelsByTopic: {},
    confidenceScore: 0,
    strengths: [],
    growthAreas: [],
    diagnosticCompletedAt: 0,
    isManuallyAdjusted: false,
  }
}

function createInitialDiagnosticState() {
  return {
    questionIds: [],
    currentIndex: 0,
    answers: [],
    startedAt: 0,
    completedAt: 0,
    confidence: null,
    questionStartedAt: 0,
  }
}

export function createInitialOnboardingState() {
  return {
    status: 'not_started',
    currentStep: 'welcome',
    selectedGradeBand: null,
    diagnostic: createInitialDiagnosticState(),
    learnerProfile: createInitialLearnerProfile(),
  }
}

export function normalizeOnboardingState(onboarding = {}) {
  const initial = createInitialOnboardingState()
  const diagnostic = onboarding.diagnostic || {}
  const learnerProfile = onboarding.learnerProfile || {}

  return {
    ...initial,
    ...onboarding,
    diagnostic: {
      ...initial.diagnostic,
      ...diagnostic,
      questionIds: Array.isArray(diagnostic.questionIds) ? diagnostic.questionIds : [],
      answers: Array.isArray(diagnostic.answers) ? diagnostic.answers : [],
    },
    learnerProfile: {
      ...initial.learnerProfile,
      ...learnerProfile,
      recommendedTopics: Array.isArray(learnerProfile.recommendedTopics)
        ? learnerProfile.recommendedTopics
        : [],
      strengths: Array.isArray(learnerProfile.strengths) ? learnerProfile.strengths : [],
      growthAreas: Array.isArray(learnerProfile.growthAreas) ? learnerProfile.growthAreas : [],
      recommendedLevelsByTopic: learnerProfile.recommendedLevelsByTopic || {},
    },
  }
}

export function hasMeaningfulHistory(appState) {
  const topicHistoryEntries = Object.values(appState.topicHistory || {})
  const hasTopicHistory = topicHistoryEntries.some(history => Array.isArray(history) && history.length > 0)
  if (hasTopicHistory) return true

  return Object.values(appState.exerciseStates || {}).some(exerciseState => (
    exerciseState?.attempts > 0 || ['solved', 'failed', 'explanation_shown'].includes(exerciseState?.status)
  ))
}

export function getDiagnosticQuestion(questionId) {
  return DIAGNOSTIC_QUESTION_BANK[questionId] || null
}

export function getPathConfig(gradeBand) {
  return PATH_CONFIGS[gradeBand] || PATH_CONFIGS.grade6
}

export function getInitialDiagnosticQuestionIds(gradeBand) {
  return [...(DIAGNOSTIC_PLANS[gradeBand] || DIAGNOSTIC_PLANS.unsure).initial]
}

export function expandDiagnosticQuestionIds(gradeBand, questionIds, answers) {
  if (questionIds.length >= DIAGNOSTIC_TOTAL_QUESTIONS || answers.length < 3) {
    return questionIds
  }

  const plan = DIAGNOSTIC_PLANS[gradeBand] || DIAGNOSTIC_PLANS.unsure
  const earlyCorrect = answers.slice(0, 3).filter(answer => answer.correct).length
  const branch = earlyCorrect >= 2 ? plan.hard : plan.easy

  return [...questionIds, ...branch]
}

export function bucketDuration(durationMs) {
  if (durationMs < 20000) return 'fast'
  if (durationMs < 45000) return 'steady'
  return 'slow'
}

function getTopicStats(answers) {
  const stats = {}

  for (const answer of answers) {
    const question = getDiagnosticQuestion(answer.questionId)
    if (!question) continue

    if (!stats[question.topicId]) {
      stats[question.topicId] = { answered: 0, correct: 0, skipped: 0 }
    }

    if (answer.skipped) {
      stats[question.topicId].skipped += 1
      continue
    }

    stats[question.topicId].answered += 1
    if (answer.correct) {
      stats[question.topicId].correct += 1
    }
  }

  return stats
}

function getCategoryStats(answers) {
  return answers.reduce((accumulator, answer) => {
    const question = getDiagnosticQuestion(answer.questionId)
    if (!question) return accumulator

    if (!accumulator[question.category]) {
      accumulator[question.category] = { answered: 0, correct: 0, skipped: 0 }
    }

    if (answer.skipped) {
      accumulator[question.category].skipped += 1
      return accumulator
    }

    accumulator[question.category].answered += 1
    if (answer.correct) {
      accumulator[question.category].correct += 1
    }

    return accumulator
  }, {
    foundation: { answered: 0, correct: 0, skipped: 0 },
    transfer: { answered: 0, correct: 0, skipped: 0 },
    symbolic: { answered: 0, correct: 0, skipped: 0 },
  })
}

function getSortedTopics(topicStats, selector) {
  return Object.entries(topicStats)
    .map(([topicId, stats]) => ({ topicId, stats, score: selector(stats) }))
    .filter(entry => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map(entry => entry.topicId)
}

function getConfidence(totalAnswered, totalCorrect, skipped, recommendation) {
  if (totalAnswered < 4 || skipped > 2) {
    return { confidence: 'low', confidenceScore: 56 }
  }

  if (totalAnswered >= 5 && (totalCorrect >= 5 || (recommendation === 'grade6' && totalCorrect <= 2))) {
    return { confidence: 'high', confidenceScore: 89 }
  }

  return { confidence: 'medium', confidenceScore: 73 }
}

function resolveRecommendedGradeBand(selectedGradeBand, categoryStats, totalAnswered, totalCorrect) {
  const foundationCorrect = categoryStats.foundation.correct
  const symbolicCorrect = categoryStats.symbolic.correct
  const transferCorrect = categoryStats.transfer.correct

  if (totalAnswered < 3) {
    return selectedGradeBand === 'unsure' ? 'grade6' : selectedGradeBand
  }

  if (foundationCorrect <= 1) {
    return 'grade6'
  }

  if (symbolicCorrect >= 2 && totalCorrect >= 4) {
    return 'prealgebra'
  }

  if (totalCorrect >= 3 && foundationCorrect >= 2) {
    if (selectedGradeBand === 'prealgebra' && symbolicCorrect >= 1) {
      return 'prealgebra'
    }

    return 'grade7'
  }

  if (selectedGradeBand === 'grade7' && foundationCorrect >= 2 && transferCorrect >= 1) {
    return 'grade7'
  }

  return 'grade6'
}

function getRecommendedLevels(gradeBand, totalCorrect, confidence) {
  const config = getPathConfig(gradeBand)

  if (gradeBand === 'grade7' && (confidence === 'high' || totalCorrect >= 5)) {
    return config.higherLevels
  }

  if (gradeBand === 'prealgebra' && (confidence === 'high' || totalCorrect >= 5)) {
    return config.higherLevels
  }

  return config.levels
}

export function buildPlacementProfile(selectedGradeBand, answers) {
  const topicStats = getTopicStats(answers)
  const categoryStats = getCategoryStats(answers)
  const answered = answers.filter(answer => !answer.skipped)
  const totalAnswered = answered.length
  const totalCorrect = answered.filter(answer => answer.correct).length
  const skipped = answers.length - totalAnswered
  const recommendedGradeBand = resolveRecommendedGradeBand(
    selectedGradeBand,
    categoryStats,
    totalAnswered,
    totalCorrect
  )
  const { confidence, confidenceScore } = getConfidence(
    totalAnswered,
    totalCorrect,
    skipped,
    recommendedGradeBand
  )
  const pathConfig = getPathConfig(recommendedGradeBand)
  const strengths = getSortedTopics(topicStats, stats => (stats.correct * 3) - stats.skipped).slice(0, 3)
  const growthAreas = getSortedTopics(
    topicStats,
    stats => ((stats.answered - stats.correct) * 2) + stats.skipped
  ).slice(0, 2)

  return {
    confidence,
    profile: {
      recommendedGradeBand,
      recommendedTopics: pathConfig.topics,
      recommendedLevelsByTopic: getRecommendedLevels(recommendedGradeBand, totalCorrect, confidence),
      confidenceScore,
      strengths: strengths.length > 0 ? strengths : pathConfig.topics.slice(0, 2),
      growthAreas: growthAreas.length > 0 ? growthAreas : pathConfig.topics.slice(-2),
      diagnosticCompletedAt: Date.now(),
      isManuallyAdjusted: false,
    },
  }
}

export function buildManualLearnerProfile(gradeBand, startingTopicId, startingLevelId) {
  const config = getPathConfig(gradeBand)
  const orderedTopics = [
    startingTopicId,
    ...config.topics.filter(topicId => topicId !== startingTopicId),
  ].slice(0, 3)
  const recommendedLevelsByTopic = {
    ...config.levels,
    [startingTopicId]: normalizeLevelId(startingLevelId),
  }

  return {
    recommendedGradeBand: gradeBand,
    recommendedTopics: orderedTopics,
    recommendedLevelsByTopic,
    confidenceScore: 68,
    strengths: [],
    growthAreas: [],
    diagnosticCompletedAt: Date.now(),
    isManuallyAdjusted: true,
  }
}

export function getPathTitleKey(gradeBand) {
  return `onboarding.paths.${gradeBand}.title`
}

export function getPathSubtitleKey(gradeBand) {
  return `onboarding.paths.${gradeBand}.subtitle`
}

export function countSolvedInPath(profile, exerciseStates = {}) {
  const recommendedTopics = new Set(profile?.recommendedTopics || [])

  return Object.entries(exerciseStates).filter(([exerciseId, exerciseState]) => {
    const topicId = getExerciseTopicId(exerciseId)
    return recommendedTopics.has(topicId) && exerciseState?.status === 'solved'
  }).length
}

export function getExerciseTopicId(exerciseId = '') {
  const match = exerciseId.match(/^(.*)-level\d{2}-\d+$/)
  return match ? match[1] : ''
}

export function resolveNearestRecommendedLevel(exercises = [], requestedLevelId) {
  const normalizedLevelId = normalizeLevelId(requestedLevelId)
  const availableLevels = getAvailableLevels(exercises)

  if (availableLevels.length === 0) {
    return normalizedLevelId
  }

  const targetLevelNumber = Number(normalizedLevelId.replace('level', ''))
  const nearestLevel = availableLevels.reduce((bestMatch, candidate) => {
    const candidateNumber = candidate.number
    const bestDistance = Math.abs(bestMatch.number - targetLevelNumber)
    const candidateDistance = Math.abs(candidateNumber - targetLevelNumber)

    return candidateDistance < bestDistance ? candidate : bestMatch
  })

  return nearestLevel.id
}

export function getRecommendedLaunchSelection(profile, topics = [], exerciseStates = {}) {
  if (!profile?.recommendedTopics?.length) {
    return null
  }

  for (const topicId of profile.recommendedTopics) {
    const topic = topics.find(entry => entry.id === topicId)
    if (!topic) continue

    const requestedLevel = profile.recommendedLevelsByTopic?.[topicId]
    const resolvedLevel = resolveNearestRecommendedLevel(topic.exercises || [], requestedLevel)
    const levelExerciseIds = filterExerciseIdsByLevel(topic.exercises || [], resolvedLevel)
    const hasUnsolvedExercise = levelExerciseIds.some(exerciseId => exerciseStates[exerciseId]?.status !== 'solved')

    if (hasUnsolvedExercise || levelExerciseIds.length > 0) {
      return {
        topicId,
        levelId: resolvedLevel,
      }
    }
  }

  const fallbackTopic = topics.find(entry => entry.id === profile.recommendedTopics[0])
  if (!fallbackTopic) return null

  return {
    topicId: fallbackTopic.id,
    levelId: resolveNearestRecommendedLevel(
      fallbackTopic.exercises || [],
      profile.recommendedLevelsByTopic?.[fallbackTopic.id]
    ),
  }
}