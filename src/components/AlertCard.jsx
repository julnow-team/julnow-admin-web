import Card from './Card'

const TONES = {
  warning: { border: 'border-l-warning', label: 'text-warning' },
  info: { border: 'border-l-ink-soft', label: 'text-ink-soft' },
  danger: { border: 'border-l-danger', label: 'text-danger' },
}

export default function AlertCard({ tone, icon: Icon, label, title, note }) {
  return (
    <Card className={`border-l-4 p-5 ${TONES[tone].border}`}>
      <p className={`flex items-center gap-2 text-sm font-semibold ${TONES[tone].label}`}>
        <Icon size={16} />
        {label}
      </p>
      <p className="mt-2 font-semibold text-ink">{title}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </Card>
  )
}