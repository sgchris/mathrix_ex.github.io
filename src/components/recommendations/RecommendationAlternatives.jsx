import RecommendationCard from './RecommendationCard'
import './RecommendationUI.css'

export default function RecommendationAlternatives({
  recommendations,
  topics,
  masteryData,
  language,
  t,
  onStart,
  onDismiss,
  onOpenMap,
}) {
  if (!recommendations?.length) return null

  return (
    <section className="recommendation-alternatives" aria-label={t('recommendations.alternativesTitle')}>
      <div className="recommendation-alternatives__header">
        <h3>{t('recommendations.alternativesTitle')}</h3>
        <p>{t('recommendations.alternativesHint')}</p>
      </div>
      <div className="recommendation-alternatives__grid">
        {recommendations.map(recommendation => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            alternative={null}
            topics={topics}
            masteryData={masteryData}
            language={language}
            t={t}
            variant="secondary"
            showMeta={false}
            onStart={onStart}
            onDismiss={onDismiss}
            onOpenMap={onOpenMap}
          />
        ))}
      </div>
    </section>
  )
}
