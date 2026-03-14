import { useEffect, useRef } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { getRecommendationExplanation } from '../../utils/recommendations'
import './RecommendationUI.css'

export default function RecommendationReasonSheet({
  isOpen,
  recommendation,
  alternative,
  topics,
  masteryData,
  language,
  t,
  onClose,
  onOpenMap,
}) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !recommendation?.id) return null

  const explanation = getRecommendationExplanation(recommendation, {
    topics,
    t,
    language,
    masteryData,
    alternative,
  })

  return (
    <div className="recommendation-sheet" role="presentation">
      <button className="recommendation-sheet__backdrop" onClick={onClose} aria-label={t('recommendations.actions.closeWhy')} />
      <div
        className="recommendation-sheet__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recommendation-sheet-title"
      >
        <div className="recommendation-sheet__header">
          <div>
            <p className="recommendation-sheet__eyebrow">{t('recommendations.whyTitle')}</p>
            <h3 id="recommendation-sheet-title">{t('recommendations.explanation.title')}</h3>
          </div>
          <button
            ref={closeButtonRef}
            className="recommendation-sheet__close"
            onClick={onClose}
            aria-label={t('recommendations.actions.closeWhy')}
          >
            <XMarkIcon style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <div className="recommendation-sheet__content">
          <section className="recommendation-sheet__block">
            <h4>{t('recommendations.explanation.whyHeading')}</h4>
            <p>{explanation.why}</p>
          </section>
          <section className="recommendation-sheet__block">
            <h4>{t('recommendations.explanation.skillHeading')}</h4>
            <p>{explanation.helpsWith}</p>
          </section>
          <section className="recommendation-sheet__block">
            <h4>{t('recommendations.explanation.alternativeHeading')}</h4>
            <p>{explanation.alternative}</p>
          </section>
        </div>

        <div className="recommendation-sheet__actions">
          {recommendation.skillId && (
            <button className="answer-action-btn answer-action-btn--next" onClick={onOpenMap}>
              {t('recommendations.actions.seeOnMap')}
            </button>
          )}
          <button className="answer-action-btn answer-action-btn--primary" onClick={onClose}>
            {t('recommendations.actions.gotIt')}
          </button>
        </div>
      </div>
    </div>
  )
}
