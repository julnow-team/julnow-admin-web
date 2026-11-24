import Badge from './Badge'
import Button from './Button'

// Top of a dashboard card: title, optional subtitle, a badge and a link on the right
export default function CardHeader({ title, subtitle, badge, badgeTone = 'neutral', actionLabel, actionTo }) {
  return (
    <div className="flex min-h-[46px] items-center gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {subtitle && <p className="text-caption text-muted">{subtitle}</p>}
      </div>
      {badge && <Badge tone={badgeTone}>{badge}</Badge>}
      {actionLabel && (
        <Button variant="link" size="sm" to={actionTo}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
