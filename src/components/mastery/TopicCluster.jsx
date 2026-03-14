import { getLocalizedSkillLabel } from '../../utils/mastery'
import SkillNode from './SkillNode'

export default function TopicCluster({ topic, language, expanded, selectedSkillId, t, onToggle, onSelectSkill }) {
  return (
    <section className={`topic-cluster${expanded ? ' is-expanded' : ''}`}>
      <button className="topic-cluster__header" onClick={onToggle} aria-expanded={expanded}>
        <div className="topic-cluster__title-wrap">
          <span className="topic-cluster__icon" style={{ backgroundColor: topic.visual.tint, color: topic.visual.accent }}>
            {topic.visual.icon}
          </span>
          <div>
            <h3>{topic.topicName}</h3>
            <p>{t('mastery.topicSummary', { stable: topic.summary.stableCount, total: topic.summary.totalCount })}</p>
          </div>
        </div>
        {topic.recommended && <span className="topic-cluster__recommended">{t('mastery.topicRecommended')}</span>}
      </button>

      {expanded && (
        <div className="topic-cluster__skills">
          {topic.skills.map(skill => (
            <SkillNode
              key={skill.id}
              skill={skill}
              label={getLocalizedSkillLabel(skill, language)}
              selected={selectedSkillId === skill.id}
              t={t}
              onClick={() => onSelectSkill(skill.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}