import { getExerciseLevelId, LEVELS } from './levels'

export const MASTERY_VIEW_MODES = ['map', 'list']

export const MASTERY_STATES = [
  'not_started',
  'practicing',
  'almost_mastered',
  'mastered',
  'needs_review',
]

const LEVEL_ORDER = Object.fromEntries(LEVELS.map(level => [level.id, level.number]))

const TOPIC_VISUALS = {
  fractions: { icon: '1/2', accent: '#3b82f6', tint: '#dbeafe' },
  decimals: { icon: '0.1', accent: '#0f766e', tint: '#ccfbf1' },
  percentages: { icon: '%', accent: '#f59e0b', tint: '#fef3c7' },
  algebra: { icon: 'x', accent: '#7c3aed', tint: '#ede9fe' },
  'arithmetic-progression': { icon: 'aₙ', accent: '#ef4444', tint: '#fee2e2' },
}

const GRADE_BANDS = [
  {
    id: 'grade6',
    titleKey: 'onboarding.paths.grade6.title',
    subtitleKey: 'mastery.gradeBands.grade6Subtitle',
    topicOrder: ['fractions', 'decimals', 'percentages'],
  },
  {
    id: 'grade7',
    titleKey: 'onboarding.paths.grade7.title',
    subtitleKey: 'mastery.gradeBands.grade7Subtitle',
    topicOrder: ['fractions', 'percentages', 'algebra'],
  },
  {
    id: 'prealgebra',
    titleKey: 'onboarding.paths.prealgebra.title',
    subtitleKey: 'mastery.gradeBands.prealgebraSubtitle',
    topicOrder: ['algebra', 'arithmetic-progression', 'percentages'],
  },
]

function createMatcher(topicId, predicate) {
  return parsed => parsed.topicId === topicId && predicate(parsed)
}

const SKILL_DEFINITIONS = [
  {
    id: 'fractions-simplify',
    topicId: 'fractions',
    gradeBandId: 'grade6',
    order: 1,
    labels: { en: 'Equivalent Fractions', he: 'שברים שקולים' },
    matches: createMatcher('fractions', ({ levelId, serial }) => levelId === 'level01' && serial <= 2),
  },
  {
    id: 'fractions-compare',
    topicId: 'fractions',
    gradeBandId: 'grade6',
    order: 2,
    labels: { en: 'Compare Fractions', he: 'השוואת שברים' },
    matches: createMatcher('fractions', ({ levelId, serial }) => levelId === 'level03' && serial >= 3 && serial <= 10),
  },
  {
    id: 'fractions-add-subtract',
    topicId: 'fractions',
    gradeBandId: 'grade6',
    order: 3,
    labels: { en: 'Add and Subtract Fractions', he: 'חיבור וחיסור שברים' },
    matches: createMatcher('fractions', ({ levelId, serial }) => levelId === 'level05' && serial >= 11 && serial <= 15),
  },
  {
    id: 'fractions-multiply',
    topicId: 'fractions',
    gradeBandId: 'grade7',
    order: 4,
    labels: { en: 'Multiply Fractions', he: 'כפל שברים' },
    matches: createMatcher('fractions', ({ levelId, serial }) => levelId === 'level03' && serial >= 21 && serial <= 25),
  },
  {
    id: 'fractions-divide',
    topicId: 'fractions',
    gradeBandId: 'grade7',
    order: 5,
    labels: { en: 'Divide and Extend Fractions', he: 'חילוק שברים והרחבה' },
    matches: createMatcher('fractions', ({ levelId }) => levelId === 'level07'),
  },
  {
    id: 'decimals-foundations',
    topicId: 'decimals',
    gradeBandId: 'grade6',
    order: 1,
    labels: { en: 'Decimal Place Value', he: 'ערך מקום בעשרוניים' },
    matches: createMatcher('decimals', ({ levelId, serial }) => levelId === 'level01' && serial >= 1 && serial <= 5),
  },
  {
    id: 'decimals-compare',
    topicId: 'decimals',
    gradeBandId: 'grade6',
    order: 2,
    labels: { en: 'Comparing Decimals', he: 'השוואת מספרים עשרוניים' },
    matches: createMatcher('decimals', ({ levelId, serial }) => levelId === 'level01' && serial >= 6 && serial <= 10),
  },
  {
    id: 'decimals-add-subtract',
    topicId: 'decimals',
    gradeBandId: 'grade6',
    order: 3,
    labels: { en: 'Add and Subtract Decimals', he: 'חיבור וחיסור עשרוניים' },
    matches: createMatcher('decimals', ({ levelId }) => levelId === 'level03'),
  },
  {
    id: 'decimals-multiply-divide',
    topicId: 'decimals',
    gradeBandId: 'grade6',
    order: 4,
    labels: { en: 'Multiply and Divide Decimals', he: 'כפל וחילוק עשרוניים' },
    matches: createMatcher('decimals', ({ levelId }) => levelId === 'level05'),
  },
  {
    id: 'percentages-foundations',
    topicId: 'percentages',
    gradeBandId: 'grade6',
    order: 1,
    labels: { en: 'Percent Foundations', he: 'יסודות האחוזים' },
    matches: createMatcher('percentages', ({ levelId, serial }) => (
      (levelId === 'level01' && serial >= 1 && serial <= 2)
      || (levelId === 'level03' && serial >= 21 && serial <= 25)
    )),
  },
  {
    id: 'percentages-of-quantity',
    topicId: 'percentages',
    gradeBandId: 'grade6',
    order: 2,
    labels: { en: 'Percent of a Quantity', he: 'אחוז מתוך כמות' },
    matches: createMatcher('percentages', ({ levelId, serial }) => (
      levelId === 'level03' && serial >= 3 && serial <= 15
    )),
  },
  {
    id: 'percentages-reverse',
    topicId: 'percentages',
    gradeBandId: 'grade7',
    order: 3,
    labels: { en: 'Reverse Percentages', he: 'אחוזים לאחור' },
    matches: createMatcher('percentages', ({ levelId, serial }) => levelId === 'level05' && serial >= 9 && serial <= 10),
  },
  {
    id: 'percentages-change',
    topicId: 'percentages',
    gradeBandId: 'prealgebra',
    order: 4,
    labels: { en: 'Percent Change', he: 'שינוי באחוזים' },
    matches: createMatcher('percentages', ({ levelId, serial }) => levelId === 'level05' && serial >= 16 && serial <= 25),
  },
  {
    id: 'algebra-foundations',
    topicId: 'algebra',
    gradeBandId: 'grade7',
    order: 1,
    labels: { en: 'Equation Foundations', he: 'יסודות המשוואות' },
    matches: createMatcher('algebra', ({ levelId }) => levelId === 'level01'),
  },
  {
    id: 'algebra-inverse-operations',
    topicId: 'algebra',
    gradeBandId: 'grade7',
    order: 2,
    labels: { en: 'Inverse Operations', he: 'פעולות הפוכות' },
    matches: createMatcher('algebra', ({ levelId }) => levelId === 'level02'),
  },
  {
    id: 'algebra-two-step',
    topicId: 'algebra',
    gradeBandId: 'prealgebra',
    order: 3,
    labels: { en: 'Two-Step Equations', he: 'משוואות דו-שלביות' },
    matches: createMatcher('algebra', ({ levelId }) => levelId === 'level03'),
  },
  {
    id: 'algebra-challenge',
    topicId: 'algebra',
    gradeBandId: 'prealgebra',
    order: 4,
    labels: { en: 'Challenge Equations', he: 'משוואות מאתגרות' },
    matches: createMatcher('algebra', ({ levelId }) => levelId === 'level05'),
  },
  {
    id: 'progressions-next-term',
    topicId: 'arithmetic-progression',
    gradeBandId: 'prealgebra',
    order: 1,
    labels: { en: 'Find the Next Term', he: 'מציאת האיבר הבא' },
    matches: createMatcher('arithmetic-progression', ({ levelId, serial }) => levelId === 'level01' && serial >= 1 && serial <= 15),
  },
  {
    id: 'progressions-later-terms',
    topicId: 'arithmetic-progression',
    gradeBandId: 'prealgebra',
    order: 2,
    labels: { en: 'Find Later Terms', he: 'מציאת איברים מאוחרים' },
    matches: createMatcher('arithmetic-progression', ({ levelId, serial }) => levelId === 'level03' && serial >= 16 && serial <= 20),
  },
  {
    id: 'progressions-difference',
    topicId: 'arithmetic-progression',
    gradeBandId: 'prealgebra',
    order: 3,
    labels: { en: 'Common Difference', he: 'ההפרש הקבוע' },
    matches: createMatcher('arithmetic-progression', ({ levelId, serial }) => levelId === 'level03' && serial >= 21 && serial <= 25),
  },
  {
    id: 'progressions-rules',
    topicId: 'arithmetic-progression',
    gradeBandId: 'prealgebra',
    order: 4,
    labels: { en: 'Rules and Patterns', he: 'חוקים ותבניות' },
    matches: createMatcher('arithmetic-progression', ({ levelId, serial }) => levelId === 'level03' && serial >= 26 && serial <= 30),
  },
]

const STATE_ORDER = {
  needs_review: 0,
  practicing: 1,
  almost_mastered: 2,
  not_started: 3,
  mastered: 4,
}

function createInitialFilters() {
  return {
    gradeBand: 'all',
    topicId: 'all',
    state: 'all',
    sort: 'recommended',
  }
}

export function createInitialMasteryState() {
  return {
    selectedSkillId: null,
    lastViewMode: 'map',
    filters: createInitialFilters(),
    expandedTopicIds: [],
  }
}

export function normalizeMasteryState(mastery = {}) {
  const initial = createInitialMasteryState()
  const filters = mastery.filters || {}

  return {
    ...initial,
    ...mastery,
    lastViewMode: MASTERY_VIEW_MODES.includes(mastery.lastViewMode) ? mastery.lastViewMode : initial.lastViewMode,
    selectedSkillId: typeof mastery.selectedSkillId === 'string' ? mastery.selectedSkillId : null,
    filters: {
      ...initial.filters,
      ...filters,
    },
    expandedTopicIds: Array.isArray(mastery.expandedTopicIds) ? mastery.expandedTopicIds : [],
  }
}

function parseExerciseId(exerciseId = '') {
  const match = exerciseId.match(/^(.*)-(level\d{2})-(\d+)$/)
  if (!match) {
    return {
      id: exerciseId,
      topicId: '',
      levelId: getExerciseLevelId(exerciseId),
      serial: 0,
    }
  }

  return {
    id: exerciseId,
    topicId: match[1],
    levelId: match[2],
    serial: Number(match[3]),
  }
}

function getExerciseScore(exerciseState) {
  if (!exerciseState) return null

  const attempts = exerciseState.attempts || 0
  const hintsUsed = exerciseState.hintIndex || 0
  const baseTimestamp = exerciseState.lastPracticedAt || exerciseState.lastOutcomeAt || 0

  if (exerciseState.status === 'solved') {
    const score = Math.max(0.45, 0.92 - (Math.max(attempts - 1, 0) * 0.11) - (hintsUsed * 0.08))

    return {
      outcome: 'solved',
      score,
      attempts,
      hintsUsed,
      lastPracticedAt: baseTimestamp,
    }
  }

  if (exerciseState.status === 'failed') {
    return {
      outcome: 'failed',
      score: 0.18,
      attempts,
      hintsUsed,
      lastPracticedAt: baseTimestamp,
    }
  }

  if (exerciseState.status === 'explanation_shown') {
    return {
      outcome: 'explained',
      score: 0.28,
      attempts,
      hintsUsed,
      lastPracticedAt: baseTimestamp,
    }
  }

  if (attempts > 0 || hintsUsed > 0) {
    return {
      outcome: 'in_progress',
      score: Math.max(0.24, 0.42 - (hintsUsed * 0.05)),
      attempts,
      hintsUsed,
      lastPracticedAt: baseTimestamp,
    }
  }

  return null
}

function average(values = []) {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function resolveMasteryState({ masteryPercent, sampleCount, successfulCount, recentAverage, bestScore }) {
  if (sampleCount === 0) return 'not_started'
  if (sampleCount < 2 && successfulCount === 0) return 'practicing'

  if (successfulCount > 0 && sampleCount >= 2 && recentAverage < 45 && bestScore >= 75) {
    return 'needs_review'
  }

  if (masteryPercent >= 75 && successfulCount >= 2) return 'mastered'
  if (masteryPercent >= 50) return 'almost_mastered'
  return 'practicing'
}

function sortExerciseIds(exerciseIds = []) {
  return [...exerciseIds].sort((left, right) => {
    const leftParsed = parseExerciseId(left)
    const rightParsed = parseExerciseId(right)
    const levelDelta = (LEVEL_ORDER[leftParsed.levelId] || 0) - (LEVEL_ORDER[rightParsed.levelId] || 0)
    if (levelDelta !== 0) return levelDelta
    return leftParsed.serial - rightParsed.serial
  })
}

function getRecentActivities(exerciseIds, exerciseStates) {
  return exerciseIds
    .map(exerciseId => {
      const score = getExerciseScore(exerciseStates[exerciseId])
      if (!score) return null

      return {
        exerciseId,
        levelId: getExerciseLevelId(exerciseId),
        ...score,
      }
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (right.lastPracticedAt !== left.lastPracticedAt) {
        return (right.lastPracticedAt || 0) - (left.lastPracticedAt || 0)
      }

      return right.score - left.score
    })
}

function getSelectedExerciseId(skillExerciseIds, exerciseStates, state) {
  const sorted = sortExerciseIds(skillExerciseIds)

  if (!sorted.length) return null

  if (state === 'almost_mastered') {
    const highestUnsolved = [...sorted]
      .reverse()
      .find(exerciseId => exerciseStates[exerciseId]?.status !== 'solved')

    return highestUnsolved || sorted[sorted.length - 1]
  }

  if (state === 'needs_review') {
    const firstIncomplete = sorted.find(exerciseId => exerciseStates[exerciseId]?.status !== 'solved')
    return firstIncomplete || sorted[0]
  }

  const firstIncomplete = sorted.find(exerciseId => exerciseStates[exerciseId]?.status !== 'solved')
  return firstIncomplete || sorted[0]
}

function getRecommendedSkillId(skills, learnerProfile) {
  const recommendedTopics = learnerProfile?.recommendedTopics || []

  const orderedCandidates = [
    skill => recommendedTopics.includes(skill.topicId) && skill.state === 'needs_review',
    skill => recommendedTopics.includes(skill.topicId) && skill.state === 'practicing',
    skill => recommendedTopics.includes(skill.topicId) && skill.state === 'almost_mastered',
    skill => recommendedTopics.includes(skill.topicId) && skill.state === 'not_started',
    skill => skill.state === 'needs_review',
    skill => skill.state === 'practicing',
    skill => skill.state === 'almost_mastered',
    skill => skill.state === 'not_started',
  ]

  for (const matcher of orderedCandidates) {
    const match = skills.find(matcher)
    if (match) return match.id
  }

  return skills[0]?.id || null
}

function getTopicSummary(skills) {
  const stableCount = skills.filter(skill => ['almost_mastered', 'mastered'].includes(skill.state)).length
  const reviewCount = skills.filter(skill => skill.state === 'needs_review').length

  return {
    stableCount,
    totalCount: skills.length,
    reviewCount,
  }
}

export function getGradeBands() {
  return GRADE_BANDS
}

export function getSkillDefinitions() {
  return SKILL_DEFINITIONS
}

export function getTopicVisual(topicId) {
  return TOPIC_VISUALS[topicId] || { icon: '#', accent: '#4a6cf7', tint: '#eef1fe' }
}

export function getSkillIdForExercise(exerciseId) {
  const parsed = parseExerciseId(exerciseId)
  const skill = SKILL_DEFINITIONS.find(entry => entry.matches(parsed))
  return skill?.id || null
}

export function getLocalizedSkillLabel(skill, language = 'en') {
  return skill?.labels?.[language] || skill?.labels?.en || skill?.id || ''
}

export function buildMasteryData({ topics = [], exerciseStates = {}, onboarding, mastery }) {
  const topicExercises = Object.fromEntries(topics.map(topic => [topic.id, topic.exercises || []]))
  const topicNames = Object.fromEntries(topics.map(topic => [topic.id, topic.name]))

  const skills = SKILL_DEFINITIONS.map(definition => {
    const exerciseIds = sortExerciseIds(
      (topicExercises[definition.topicId] || []).filter(exerciseId => definition.matches(parseExerciseId(exerciseId)))
    )
    const activities = getRecentActivities(exerciseIds, exerciseStates)
    const sampleCount = activities.length
    const successfulCount = activities.filter(activity => activity.outcome === 'solved').length
    const masteryPercent = sampleCount > 0 ? Math.round(average(activities.map(activity => activity.score)) * 100) : 0
    const recentAverage = activities.length > 0
      ? Math.round(average(activities.slice(0, 2).map(activity => activity.score)) * 100)
      : 0
    const bestScore = activities.length > 0
      ? Math.max(...activities.map(activity => Math.round(activity.score * 100)))
      : 0
    const state = resolveMasteryState({
      masteryPercent,
      sampleCount,
      successfulCount,
      recentAverage,
      bestScore,
    })
    const selectedExerciseId = getSelectedExerciseId(exerciseIds, exerciseStates, state)
    const selectedExerciseLevelId = selectedExerciseId ? getExerciseLevelId(selectedExerciseId) : null
    const lastPracticedAt = activities[0]?.lastPracticedAt || 0

    return {
      ...definition,
      exerciseIds,
      topicName: topicNames[definition.topicId] || definition.topicId,
      state,
      masteryPercent,
      sampleCount,
      successfulCount,
      hintAverage: sampleCount > 0 ? average(activities.map(activity => activity.hintsUsed || 0)) : 0,
      attemptsAverage: sampleCount > 0 ? average(activities.map(activity => activity.attempts || 0)) : 0,
      lastPracticedAt,
      recentActivities: activities.slice(0, 3),
      selectedExerciseId,
      selectedExerciseLevelId,
    }
  })

  const skillsById = Object.fromEntries(skills.map(skill => [skill.id, skill]))

  const bands = GRADE_BANDS.map(band => {
    const topicsInBand = band.topicOrder
      .map(topicId => {
        const topicSkills = skills
          .filter(skill => skill.gradeBandId === band.id && skill.topicId === topicId)
          .sort((left, right) => left.order - right.order)

        if (!topicSkills.length) return null

        return {
          topicId,
          topicName: topicNames[topicId] || topicId,
          visual: getTopicVisual(topicId),
          recommended: (onboarding?.learnerProfile?.recommendedTopics || []).includes(topicId),
          summary: getTopicSummary(topicSkills),
          skills: topicSkills,
        }
      })
      .filter(Boolean)

    return {
      ...band,
      topics: topicsInBand,
    }
  })

  const totalSkills = skills.length
  const stateCounts = MASTERY_STATES.reduce((counts, state) => {
    counts[state] = skills.filter(skill => skill.state === state).length
    return counts
  }, {})
  const practicedCount = skills.filter(skill => skill.sampleCount > 0).length
  const stableCount = skills.filter(skill => ['almost_mastered', 'mastered'].includes(skill.state)).length
  const masteryCoverage = totalSkills > 0 ? Math.round((stableCount / totalSkills) * 100) : 0
  const recommendedSkillId = getRecommendedSkillId(skills, onboarding?.learnerProfile)

  const selectedSkillId = skillsById[mastery?.selectedSkillId]
    ? mastery.selectedSkillId
    : recommendedSkillId

  return {
    bands,
    skills,
    skillsById,
    selectedSkillId,
    recommendedSkillId,
    stateCounts,
    totalSkills,
    practicedCount,
    stableCount,
    masteryCoverage,
  }
}

export function filterMasterySkills(skills, filters = {}) {
  return skills.filter(skill => {
    if (filters.gradeBand && filters.gradeBand !== 'all' && skill.gradeBandId !== filters.gradeBand) {
      return false
    }

    if (filters.topicId && filters.topicId !== 'all' && skill.topicId !== filters.topicId) {
      return false
    }

    if (filters.state && filters.state !== 'all' && skill.state !== filters.state) {
      return false
    }

    return true
  })
}

export function sortMasterySkills(skills, sortMode, recommendedSkillId) {
  const sorted = [...skills]

  sorted.sort((left, right) => {
    if (sortMode === 'weakest') {
      if (left.masteryPercent !== right.masteryPercent) {
        return left.masteryPercent - right.masteryPercent
      }
    } else if (sortMode === 'recent') {
      if (left.lastPracticedAt !== right.lastPracticedAt) {
        return (right.lastPracticedAt || 0) - (left.lastPracticedAt || 0)
      }
    } else if (sortMode === 'near_mastery') {
      const leftDistance = Math.abs(75 - left.masteryPercent)
      const rightDistance = Math.abs(75 - right.masteryPercent)
      if (leftDistance !== rightDistance) {
        return leftDistance - rightDistance
      }
    } else if (sortMode === 'recommended') {
      if (left.id === recommendedSkillId) return -1
      if (right.id === recommendedSkillId) return 1
    }

    if (STATE_ORDER[left.state] !== STATE_ORDER[right.state]) {
      return STATE_ORDER[left.state] - STATE_ORDER[right.state]
    }

    if (left.gradeBandId !== right.gradeBandId) {
      return GRADE_BANDS.findIndex(band => band.id === left.gradeBandId)
        - GRADE_BANDS.findIndex(band => band.id === right.gradeBandId)
    }

    if (left.topicId !== right.topicId) {
      return left.topicId.localeCompare(right.topicId)
    }

    return left.order - right.order
  })

  return sorted
}

export function getPracticeSelectionForSkill(skillId, topics = [], exerciseStates = {}) {
  const topicExercises = Object.fromEntries(topics.map(topic => [topic.id, topic.exercises || []]))
  const skillDefinition = SKILL_DEFINITIONS.find(skill => skill.id === skillId)
  if (!skillDefinition) return null

  const exerciseIds = sortExerciseIds(
    (topicExercises[skillDefinition.topicId] || []).filter(exerciseId => skillDefinition.matches(parseExerciseId(exerciseId)))
  )

  if (!exerciseIds.length) return null

  const chosenExerciseId = exerciseIds.find(exerciseId => exerciseStates[exerciseId]?.status !== 'solved') || exerciseIds[0]

  return {
    topicId: skillDefinition.topicId,
    exerciseId: chosenExerciseId,
    levelId: getExerciseLevelId(chosenExerciseId),
  }
}

export function getPreviousSkillId(skillId) {
  const currentSkill = SKILL_DEFINITIONS.find(skill => skill.id === skillId)
  if (!currentSkill) return null

  const previousSkill = SKILL_DEFINITIONS
    .filter(skill => skill.topicId === currentSkill.topicId && skill.order < currentSkill.order)
    .sort((left, right) => right.order - left.order)[0]

  return previousSkill?.id || null
}
