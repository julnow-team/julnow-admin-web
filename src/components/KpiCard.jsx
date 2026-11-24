import { TrendingUp } from 'lucide-react'
import Card from './Card'

export default function KpiCard({ label, value, icon: Icon, change, note }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-ink-soft">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-md bg-subtle text-ink-soft">
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1 rounded-full bg-success-subtle px-2 py-0.5 font-medium text-success">
          <TrendingUp size={12} />+{change}%
        </span>
        {note}
      </div>
    </Card>
  )
}