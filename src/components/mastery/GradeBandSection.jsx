import TopicCluster from './TopicCluster'

export default function GradeBandSection({
  band,
  filters,
  language,
  expandedTopicIds,
  selectedSkillId,
  t,
  onToggleTopic,
  onSelectSkill,
}) {
  const visibleTopics = band.topics.filter(topic => {
    if (filters.gradeBand !== 'all' && filters.gradeBand !== band.id) return false
    if (filters.topicId !== 'all' && filters.topicId !== topic.topicId) return false
    if (filters.state !== 'all' && !topic.skills.some(skill => skill.state === filters.state)) return false
    return true
  })

  if (!visibleTopics.length) return null

  return (
    <section className="mastery-band">
      <div className="mastery-band__header">
        <div>
          <p className="mastery-band__eyebrow">{t('mastery.bandLabel')}</p>
          <h2>{t(band.titleKey)}</h2>
          <p>{t(band.subtitleKey)}</p>
        </div>
      </div>

      <div className="mastery-band__topics">
        {visibleTopics.map(topic => (
          <TopicCluster
            key={`${band.id}-${topic.topicId}`}
            topic={topic}
            language={language}
            expanded={expandedTopicIds.includes(topic.topicId)}
            selectedSkillId={selectedSkillId}
            t={t}
            onToggle={() => onToggleTopic(topic.topicId)}
            onSelectSkill={onSelectSkill}
          />
        ))}
      </div>
    </section>
  )
}