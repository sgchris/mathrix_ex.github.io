import { useContext } from 'react'
import { AppContext } from '../../context/useApp'
import {
  buildMasteryData,
  filterMasterySkills,
  getGradeBands,
  getLocalizedSkillLabel,
  getPracticeSelectionForSkill,
  getPreviousSkillId,
  sortMasterySkills,
} from '../../utils/mastery'
import MasteryMapHeader from './MasteryMapHeader'
import MasteryFilters from './MasteryFilters'
import GradeBandSection from './GradeBandSection'
import SkillDetailPanel from './SkillDetailPanel'
import MasteryListView from './MasteryListView'
import './MasteryMap.css'

function getSelectedSkill(filteredSkills, allSkillsById, selectedSkillId, recommendedSkillId) {
  if (filteredSkills.length === 0) return null

  const stored = selectedSkillId ? allSkillsById[selectedSkillId] : null
  const visibleStored = stored && filteredSkills.some(skill => skill.id === stored.id) ? stored : null
  if (visibleStored) return visibleStored

  const recommended = recommendedSkillId ? allSkillsById[recommendedSkillId] : null
  const visibleRecommended = recommended && filteredSkills.some(skill => skill.id === recommended.id)
    ? recommended
    : null
  if (visibleRecommended) return visibleRecommended

  return filteredSkills[0] || stored || recommended || null
}

function getSummarySentence({ masteryData, selectedSkill, profile, topics, t }) {
  const strongestSkill = [...masteryData.skills]
    .sort((left, right) => right.masteryPercent - left.masteryPercent)[0]
  const growthSkill = [...masteryData.skills]
    .filter(skill => ['practicing', 'needs_review', 'not_started'].includes(skill.state))
    .sort((left, right) => left.masteryPercent - right.masteryPercent)[0]

  if (masteryData.practicedCount >= 3 && strongestSkill) {
    return t('mastery.summary.fromEvidence', {
      strongTopic: strongestSkill.topicName,
      growthTopic: growthSkill?.topicName || strongestSkill.topicName,
    })
  }

  if (profile?.recommendedGradeBand && profile?.strengths?.length > 0) {
    const strongTopic = topics.find(topic => topic.id === profile.strengths[0])?.name || strongestSkill?.topicName || selectedSkill?.topicName
    const growthTopic = topics.find(topic => topic.id === profile.growthAreas?.[0])?.name || growthSkill?.topicName || selectedSkill?.topicName || strongTopic

    return t('mastery.summary.fromProfile', {
      strongTopic: strongTopic || t('onboarding.paths.grade6.title'),
      growthTopic: growthTopic || strongTopic || t('onboarding.paths.grade6.title'),
    })
  }

  return t('mastery.summary.generic')
}

function getRecencyLabel(timestamp, t) {
  if (!timestamp) return t('mastery.recency.none')

  const difference = Date.now() - timestamp
  const dayMs = 24 * 60 * 60 * 1000
  const days = Math.floor(difference / dayMs)

  if (days <= 0) return t('mastery.recency.today')
  if (days === 1) return t('mastery.recency.yesterday')
  if (days < 7) return t('mastery.recency.daysAgo', { count: days })
  return t('mastery.recency.older')
}

export default function MasteryMapScreen() {
  const { appState, dispatch, topics, t } = useContext(AppContext)
  const profile = appState.onboarding.learnerProfile
  const masteryData = buildMasteryData({
    topics,
    exerciseStates: appState.exerciseStates,
    onboarding: appState.onboarding,
    mastery: appState.mastery,
  })
  const filteredSkills = sortMasterySkills(
    filterMasterySkills(masteryData.skills, appState.mastery.filters),
    appState.mastery.filters.sort,
    masteryData.recommendedSkillId
  )
  const selectedSkill = getSelectedSkill(
    filteredSkills,
    masteryData.skillsById,
    appState.mastery.selectedSkillId,
    masteryData.recommendedSkillId
  )
  const recommendedSkill = masteryData.skillsById[masteryData.recommendedSkillId] || selectedSkill
  const summarySentence = getSummarySentence({
    masteryData,
    selectedSkill,
    profile,
    topics,
    t,
  })
  const expandedTopicIds = appState.mastery.expandedTopicIds.length > 0
    ? appState.mastery.expandedTopicIds
    : (profile?.recommendedTopics?.length > 0
      ? profile.recommendedTopics
      : getGradeBands().flatMap(band => band.topicOrder.slice(0, 1)))

  function handlePracticeSkill(skillId) {
    const selection = getPracticeSelectionForSkill(skillId, topics, appState.exerciseStates)
    if (!selection) {
      dispatch({ type: 'SET_APP_VIEW', payload: { view: 'practice' } })
      return
    }

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
  }

  function handleOpenSkill(skillId) {
    dispatch({ type: 'SET_MASTERY_SELECTED_SKILL', payload: { skillId } })
  }

  function handleReviewPrevious(skillId) {
    const previousSkillId = getPreviousSkillId(skillId)
    if (!previousSkillId) return

    dispatch({ type: 'SET_MASTERY_SELECTED_SKILL', payload: { skillId: previousSkillId } })
  }

  return (
    <section className="mastery-screen">
      <MasteryMapHeader
        masteryData={masteryData}
        recommendedSkill={recommendedSkill}
        summarySentence={summarySentence}
        onPracticeRecommended={() => recommendedSkill && handlePracticeSkill(recommendedSkill.id)}
        onSeeAllTopics={() => dispatch({ type: 'RESET_MASTERY_FILTERS' })}
        onBackToPractice={() => dispatch({ type: 'SET_APP_VIEW', payload: { view: 'practice' } })}
        t={t}
      />

      <MasteryFilters
        filters={appState.mastery.filters}
        viewMode={appState.mastery.lastViewMode}
        topics={topics}
        onChangeFilters={filters => dispatch({ type: 'SET_MASTERY_FILTERS', payload: { filters } })}
        onChangeViewMode={viewMode => dispatch({ type: 'SET_MASTERY_VIEW_MODE', payload: { viewMode } })}
        t={t}
      />

      <div className="mastery-screen__body">
        <div className="mastery-screen__content">
          {appState.mastery.lastViewMode === 'list' ? (
            <MasteryListView
              skills={filteredSkills}
              selectedSkillId={selectedSkill?.id}
              language={appState.language}
              t={t}
              onSelectSkill={handleOpenSkill}
              onPracticeSkill={handlePracticeSkill}
              getRecencyLabel={timestamp => getRecencyLabel(timestamp, t)}
            />
          ) : (
            masteryData.bands.map(band => (
              <GradeBandSection
                key={band.id}
                band={band}
                filters={appState.mastery.filters}
                language={appState.language}
                expandedTopicIds={expandedTopicIds}
                selectedSkillId={selectedSkill?.id}
                t={t}
                onToggleTopic={topicId => dispatch({ type: 'TOGGLE_MASTERY_TOPIC', payload: { topicId } })}
                onSelectSkill={handleOpenSkill}
              />
            ))
          )}

          {filteredSkills.length === 0 && (
            <div className="mastery-empty-state">
              <h3>{t('mastery.empty.title')}</h3>
              <p>{t('mastery.empty.description')}</p>
              <button
                className="mastery-secondary-button"
                onClick={() => dispatch({ type: 'RESET_MASTERY_FILTERS' })}
              >
                {t('mastery.empty.clearFilters')}
              </button>
            </div>
          )}
        </div>

        <SkillDetailPanel
          skill={selectedSkill}
          language={appState.language}
          t={t}
          onClose={() => dispatch({ type: 'SET_MASTERY_SELECTED_SKILL', payload: { skillId: null } })}
          onPractice={() => selectedSkill && handlePracticeSkill(selectedSkill.id)}
          onReviewPrevious={() => selectedSkill && handleReviewPrevious(selectedSkill.id)}
          canReviewPrevious={!!(selectedSkill && getPreviousSkillId(selectedSkill.id))}
          getRecencyLabel={timestamp => getRecencyLabel(timestamp, t)}
          getSkillLabel={skill => getLocalizedSkillLabel(skill, appState.language)}
        />
      </div>
    </section>
  )
}