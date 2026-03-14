import RecommendationCard from './RecommendationCard'
import './RecommendationUI.css'

export default function RecommendationStrip({
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

  const stripKey = recommendation.type === 'recovery'
    ? 'recommendations.strip.recovery'
    : recommendation.type === 'level_up'
      ? 'recommendations.strip.levelUp'
      : recommendation.type === 'bridge'
        ? 'recommendations.strip.bridge'
        : 'recommendations.strip.upNext'

  return (
    <section className="recommendation-strip" aria-live="polite">
      <div className="recommendation-strip__intro">
        <p className="recommendation-strip__eyebrow">{t(stripKey)}</p>
      </div>
      <RecommendationCard
        recommendation={recommendation}
        alternative={alternative}
        topics={topics}
        masteryData={masteryData}
        language={language}
        t={t}
        variant="strip"
        showMeta={false}
        onStart={onStart}
        onDismiss={onDismiss}
        onOpenMap={onOpenMap}
      />
    </section>
  )
}
