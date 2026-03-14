export default function SkillNode({ skill, label, selected, t, onClick }) {
  return (
    <button
      className={`skill-node skill-node--${skill.state}${selected ? ' is-selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="skill-node__label">{label}</span>
      <span className="skill-node__meta">
        <span className="skill-node__state">{t(`mastery.states.${skill.state}`)}</span>
        {skill.sampleCount > 0 && <span className="skill-node__percent">{skill.masteryPercent}%</span>}
      </span>
    </button>
  )
}