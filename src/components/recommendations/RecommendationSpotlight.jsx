import RecommendationCard from './RecommendationCard'
import './RecommendationUI.css'

export default function RecommendationSpotlight({
  recommendation,
  alternative,
  topics,
  masteryData,
  language,
  t,
  onStart,
  onDismiss,
  onOpenMap,
}) {
  if (!recommendation?.id) return null

  return (
    <section className="recommendation-spotlight" aria-label={t('recommendations.title')}>
      <p className="recommendation-spotlight__eyebrow">{t('recommendations.title')}</p>
      <RecommendationCard
        recommendation={recommendation}
        alternative={alternative}
        topics={topics}
        masteryData={masteryData}
        language={language}
        t={t}
        variant="spotlight"
        onStart={onStart}
        onDismiss={onDismiss}
        onOpenMap={onOpenMap}
      />
    </section>
  )
}
