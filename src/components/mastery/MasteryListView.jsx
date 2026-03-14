import { getLocalizedSkillLabel } from '../../utils/mastery'

export default function MasteryListView({
  skills,
  selectedSkillId,
  language,
  t,
  onSelectSkill,
  onPracticeSkill,
  getRecencyLabel,
}) {
  return (
    <div className="mastery-list-view">
      {skills.map(skill => (
        <article key={skill.id} className={`mastery-list-card${selectedSkillId === skill.id ? ' is-selected' : ''}`}>
          <button className="mastery-list-card__main" onClick={() => onSelectSkill(skill.id)}>
            <div>
              <p className="mastery-list-card__topic">{skill.topicName}</p>
              <h3>{getLocalizedSkillLabel(skill, language)}</h3>
              <p className="mastery-list-card__meta">
                {t(`mastery.states.${skill.state}`)} · {getRecencyLabel(skill.lastPracticedAt)}
              </p>
            </div>
            <strong>{skill.sampleCount > 0 ? `${skill.masteryPercent}%` : t('mastery.states.not_started')}</strong>
          </button>
          <div className="mastery-list-card__actions">
            <button className="mastery-secondary-button" onClick={() => onPracticeSkill(skill.id)}>
              {t('mastery.actions.practiceNow')}
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}