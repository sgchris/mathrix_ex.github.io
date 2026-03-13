export const LEVELS = [
  { id: 'level01', number: 1, legacyId: 'easy' },
  { id: 'level02', number: 2 },
  { id: 'level03', number: 3, legacyId: 'medium' },
  { id: 'level05', number: 5, legacyId: 'hard' },
  { id: 'level07', number: 7 },
]

export const DEFAULT_LEVEL_ID = LEVELS[0].id

const LEVELS_BY_ID = Object.fromEntries(LEVELS.map(level => [level.id, level]))
const LEVELS_BY_LEGACY_ID = Object.fromEntries(
  LEVELS.filter(level => level.legacyId).map(level => [level.legacyId, level])
)

export function normalizeLevelId(levelId) {
  if (LEVELS_BY_ID[levelId]) return levelId
  return LEVELS_BY_LEGACY_ID[levelId]?.id ?? DEFAULT_LEVEL_ID
}

export function getExerciseLevelId(exerciseId = '') {
  const levelMatch = exerciseId.match(/-(level\d{2})-\d+$/)
  if (levelMatch && LEVELS_BY_ID[levelMatch[1]]) {
    return levelMatch[1]
  }

  const legacyMatch = exerciseId.match(/-(easy|medium|hard)-\d+$/)
  if (legacyMatch) {
    return normalizeLevelId(legacyMatch[1])
  }

  return null
}

export function matchesExerciseLevel(exerciseId, levelId) {
  return getExerciseLevelId(exerciseId) === normalizeLevelId(levelId)
}

export function filterExerciseIdsByLevel(exerciseIds = [], levelId) {
  const normalizedLevelId = normalizeLevelId(levelId)
  return exerciseIds.filter(exerciseId => matchesExerciseLevel(exerciseId, normalizedLevelId))
}

export function getAvailableLevels(exerciseIds = []) {
  const availableLevelIds = new Set(
    exerciseIds
      .map(exerciseId => getExerciseLevelId(exerciseId))
      .filter(Boolean)
  )

  return LEVELS.filter(level => availableLevelIds.has(level.id))
}

export function resolveTopicLevel(exerciseIds = [], levelId) {
  const normalizedLevelId = normalizeLevelId(levelId)
  const availableLevels = getAvailableLevels(exerciseIds)

  if (availableLevels.length === 0) {
    return normalizedLevelId
  }

  return availableLevels.some(level => level.id === normalizedLevelId)
    ? normalizedLevelId
    : availableLevels[0].id
}