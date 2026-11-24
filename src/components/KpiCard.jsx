import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { formatChange } from '../lib/format'
import Card from './Card'

// Green when up, red when down, grey when 0
function Trend({ change }) {
  const tone = change > 0 ? 'bg-success-subtle text-success' : change < 0 ? 'bg-danger-subtle text-danger' : 'bg-subtle text-muted'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tracking-[0.01em] ${tone}`}>
      {change > 0 && <TrendingUp size={14} strokeWidth={2.25} />}
      {change < 0 && <TrendingDown size={14} strokeWidth={2.25} />}
      {change === 0 && <Minus size={14} strokeWidth={2.25} />}
      {formatChange(change)}
    </span>
  )
}

// change is the percent against the period before. null hides the trend.
export default function KpiCard({ label, value, icon: Icon, change, note }) {
  return (
    <Card className="flex min-h-35 flex-col gap-3 px-5 pt-5 pb-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-md bg-subtle text-ink-soft">
          <Icon size={20} />
        </span>
      </div>
      <p className="text-metric font-bold text-ink">{value}</p>
      <div className="flex items-center gap-2 text-caption text-muted">
        {change != null && <Trend change={change} />}
        {note}
      </div>
    </Card>
  )
}
