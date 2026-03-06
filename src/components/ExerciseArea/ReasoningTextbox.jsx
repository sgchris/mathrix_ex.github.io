import './ReasoningTextbox.css'

export default function ReasoningTextbox({ value, onChange }) {
  return (
    <div className="reasoning-box">
      <label className="reasoning-box__label" htmlFor="reasoning-textarea">
        Scratch Pad
      </label>
      <p className="reasoning-box__sublabel">Your personal workspace — jot notes or work out your steps. This won&apos;t be checked.</p>
      <textarea
        id="reasoning-textarea"
        className="reasoning-box__textarea"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Write out your working, sketch your approach, or jot down notes here..."
        rows={6}
      />
    </div>
  )
}
