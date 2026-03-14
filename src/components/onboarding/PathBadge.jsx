import './OnboardingGate.css'

export default function PathBadge({ index, label, subtle = false }) {
  return (
    <span className={`path-badge${subtle ? ' path-badge--subtle' : ''}`}>
      {typeof index === 'number' ? <span className="path-badge__index">{index + 1}</span> : null}
      <span className="path-badge__label">{label}</span>
    </span>
  )
}