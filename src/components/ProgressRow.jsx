const TONES = {
  'series-1': 'bg-series-1',
  'series-2': 'bg-series-2',
  'series-3': 'bg-series-3',
  warning: 'bg-warning',
}

// percent is the number on the right (null shows a dash). fill is how much of the bar is coloured, 0 to 100.
export default function ProgressRow({ label, value, percent, fill, tone }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className={`size-2 shrink-0 rounded-full ${TONES[tone]}`} />
        <span className="flex-1 text-sm text-ink">{label}</span>
        <span className="text-sm font-semibold text-ink">{value}</span>
        <span className="w-9 text-right text-caption text-muted">{percent == null ? '—' : `${Math.round(percent)}%`}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(fill)}
        className="h-1.5 overflow-hidden rounded-full bg-subtle"
      >
        <div className={`h-full rounded-full ${TONES[tone]}`} style={{ width: `${fill}%` }} />
      </div>
    </div>
  )
}
