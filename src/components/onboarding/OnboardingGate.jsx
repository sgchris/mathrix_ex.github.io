import { useContext } from 'react'
import { AppContext } from '../../context/useApp'
import { getSupportedLocales } from '../../utils/localization'
import { getInitialDiagnosticQuestionIds, getRecommendedLaunchSelection } from '../../utils/onboarding'
import GradeBandStep from './GradeBandStep'
import DiagnosticRunner from './DiagnosticRunner'
import OnboardingWelcome from './OnboardingWelcome'
import PathKickoffCard from './PathKickoffCard'
import PlacementResultCard from './PlacementResultCard'
import './OnboardingGate.css'

export default function OnboardingGate() {
  const { appState, dispatch, topics, language, setLanguage, isRTL, t } = useContext(AppContext)
  const { onboarding, exerciseStates } = appState
  const localeOptions = getSupportedLocales()
  const profile = onboarding.learnerProfile

  function launchRecommendedPath() {
    const launchSelection = getRecommendedLaunchSelection(profile, topics, exerciseStates)
    dispatch({ type: 'COMPLETE_ONBOARDING' })

    if (!launchSelection) {
      return
    }

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

  function renderStep() {
    switch (onboarding.currentStep) {
      case 'grade-band':
        return (
          <GradeBandStep
            selectedGradeBand={onboarding.selectedGradeBand}
            t={t}
            onSelect={gradeBand => dispatch({ type: 'SELECT_GRADE_BAND', payload: { gradeBand } })}
            onContinue={() => dispatch({
              type: 'INITIALIZE_DIAGNOSTIC',
              payload: {
                questionIds: getInitialDiagnosticQuestionIds(onboarding.selectedGradeBand),
              },
            })}
            onBack={() => dispatch({ type: 'SET_ONBOARDING_STEP', payload: { step: 'welcome', status: 'in_progress' } })}
          />
        )
      case 'diagnostic':
        return (
          <DiagnosticRunner
            onboarding={onboarding}
            language={language}
            isRTL={isRTL}
            dispatch={dispatch}
            t={t}
          />
        )
      case 'result':
        return (
          <PlacementResultCard
            onboarding={onboarding}
            topics={topics}
            dispatch={dispatch}
            t={t}
          />
        )
      case 'kickoff':
        return (
          <PathKickoffCard
            profile={profile}
            topics={topics}
            t={t}
            onStartExercise={launchRecommendedPath}
            onOpenOverview={() => dispatch({ type: 'COMPLETE_ONBOARDING' })}
          />
        )
      case 'welcome':
      default:
        return (
          <OnboardingWelcome
            t={t}
            onStart={() => dispatch({ type: 'SET_ONBOARDING_STEP', payload: { step: 'grade-band', status: 'in_progress' } })}
            onChooseManually={() => dispatch({ type: 'SKIP_ONBOARDING' })}
          />
        )
    }
  }

  return (
    <div className="onboarding-shell">
      <div className="onboarding-shell__background" aria-hidden="true">
        <span className="onboarding-shell__shape onboarding-shell__shape--one" />
        <span className="onboarding-shell__shape onboarding-shell__shape--two" />
        <span className="onboarding-shell__shape onboarding-shell__shape--three" />
      </div>

      <div className="onboarding-shell__content">
        <div className="onboarding-shell__toolbar">
          <span className="onboarding-shell__brand">Mathrix</span>
          <label className="onboarding-shell__locale-picker">
            <span>{t('languageLabel')}</span>
            <select value={language} onChange={event => setLanguage(event.target.value)}>
              {localeOptions.map(locale => (
                <option key={locale.id} value={locale.id}>{locale.label}</option>
              ))}
            </select>
          </label>
        </div>

        {renderStep()}
      </div>
    </div>
  )
}