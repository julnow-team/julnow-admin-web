const TONES = {
  neutral: { box: 'border-line bg-canvas text-ink-soft', value: 'text-ink' },
  success: { box: 'border-success-subtle bg-success-subtle text-success', value: '' },
  warning: { box: 'border-warning-subtle bg-warning-subtle text-warning', value: '' },
}

// A small count inside a card, like Submitted / Auto-published / Flagged
export default function StatTile({ label, value, tone = 'neutral' }) {
  return (
    <div className={`flex min-h-20 flex-1 flex-col gap-1 rounded-md border px-4 pt-4 pb-3.5 ${TONES[tone].box}`}>
      <p className="text-caption">{label}</p>
      <p className={`text-xl font-semibold tracking-[-0.01em] ${TONES[tone].value}`}>{value}</p>
    </div>
  )
}
