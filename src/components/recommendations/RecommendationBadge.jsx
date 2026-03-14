import { getRecommendationBadgeKey } from '../../utils/recommendations'
import './RecommendationUI.css'

export default function RecommendationBadge({ type, t }) {
  return (
    <span className={`recommendation-badge recommendation-badge--${type || 'default'}`}>
      {t(getRecommendationBadgeKey(type))}
    </span>
  )
}
