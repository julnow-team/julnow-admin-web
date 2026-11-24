import { Link } from 'react-router-dom'
import Card from './Card'

const TONES = {
  warning: { border: 'border-l-warning', label: 'text-warning' },
  info: { border: 'border-l-info', label: 'text-info' },
  danger: { border: 'border-l-danger', label: 'text-danger' },
}

// Pass `to` to make the whole card a link to its queue
export default function AlertCard({ tone, icon: Icon, label, title, note, to }) {
  const card = (
    <Card className={`flex min-h-30 flex-col gap-1.5 border-l-4 p-4 ${TONES[tone].border} ${to ? 'hover:bg-hover' : ''}`}>
      <p className={`flex items-center gap-2 text-sm font-semibold ${TONES[tone].label}`}>
        <Icon size={20} />
        {label}
      </p>
      <p className="text-base font-semibold text-ink">{title}</p>
      <p className="text-caption text-ink-soft">{note}</p>
    </Card>
  )

  return to ? (
    <Link to={to} className="block">
      {card}
    </Link>
  ) : (
    card
  )
}
