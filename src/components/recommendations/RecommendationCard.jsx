import { useState } from 'react'
import RecommendationBadge from './RecommendationBadge'
import RecommendationReasonSheet from './RecommendationReasonSheet'
import {
  getRecommendationEffortKey,
  getRecommendationFitKey,
  getRecommendationPrimaryActionKey,
  getRecommendationReason,
  getRecommendationTitle,
} from '../../utils/recommendations'
import './RecommendationUI.css'

export default function RecommendationCard({
  recommendation,
  alternative,
  topics,
  masteryData,
  language,
  t,
  variant = 'default',
  onStart,
  onDismiss,
  onOpenMap,
  showDismiss = true,
  showMeta = true,
}) {
  const [isReasonOpen, setIsReasonOpen] = useState(false)

  if (!recommendation?.id) return null

  const title = getRecommendationTitle(recommendation, {
    topics,
    t,
    language,
    masteryData,
  })
  const reason = getRecommendationReason(recommendation, {
    topics,
    t,
    language,
    masteryData,
  })

  return (
    <>
      <article className={`recommendation-card recommendation-card--${variant} recommendation-card--${recommendation.type}`}>
        <div className="recommendation-card__header">
          <RecommendationBadge type={recommendation.type} t={t} />
          {showMeta && (
            <div className="recommendation-card__meta-pills">
              <span>{t(getRecommendationEffortKey(recommendation.type))}</span>
              <span>{t(getRecommendationFitKey(recommendation.confidence))}</span>
            </div>
          )}
        </div>

        <div className="recommendation-card__body">
          <h3>{title}</h3>
          <p>{reason}</p>
        </div>

        <div className="recommendation-card__actions">
          <button className="answer-action-btn answer-action-btn--primary" onClick={() => onStart(recommendation)}>
            {t(getRecommendationPrimaryActionKey(recommendation.type))}
          </button>
          <button className="recommendation-card__link" onClick={() => setIsReasonOpen(true)}>
            {t('recommendations.actions.whyThis')}
          </button>
          {recommendation.skillId && (
            <button className="recommendation-card__link" onClick={() => onOpenMap(recommendation)}>
              {t('recommendations.actions.seeOnMap')}
            </button>
          )}
          {showDismiss && (
            <button className="recommendation-card__link recommendation-card__link--muted" onClick={() => onDismiss(recommendation)}>
              {t('recommendations.actions.dismiss')}
            </button>
          )}
        </div>
      </article>

      <RecommendationReasonSheet
        isOpen={isReasonOpen}
        recommendation={recommendation}
        alternative={alternative}
        topics={topics}
        masteryData={masteryData}
        language={language}
        t={t}
        onClose={() => setIsReasonOpen(false)}
        onOpenMap={() => {
          setIsReasonOpen(false)
          onOpenMap(recommendation)
        }}
      />
    </>
  )
}
