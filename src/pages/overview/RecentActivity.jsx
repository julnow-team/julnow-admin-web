import { Calendar, CircleAlert, CircleCheck, Flag, Star } from 'lucide-react'
import Card from '../../components/Card'
import CardHeader from '../../components/CardHeader'
import CardStatus from '../../components/CardStatus'
import { timeAgo } from '../../lib/format'
import { useI18n } from '../../lib/i18n'

const TYPES = {
  BOOKING_CREATED: { icon: Calendar, tile: 'bg-subtle text-ink-soft', text: 'text-ink' },
  LISTING_AUTO_PUBLISHED: { icon: CircleCheck, tile: 'bg-success-subtle text-success', text: 'text-ink' },
  PAYMENT_FAILED: { icon: CircleAlert, tile: 'bg-danger-subtle text-danger', text: 'text-danger' },
  PLAN_UPGRADED: { icon: Star, tile: 'bg-info-subtle text-info', text: 'text-ink' },
  SUBSCRIPTION_RENEWED: { icon: CircleCheck, tile: 'bg-success-subtle text-success', text: 'text-ink' },
  LISTING_REPORTED: { icon: Flag, tile: 'bg-warning-subtle text-warning', text: 'text-ink' },
}

// The API sends data, the sentence is written here so it follows the language
function activityText(item, t) {
  const key = item.type === 'PAYMENT_FAILED' && item.daysLeft === 1 ? 'PAYMENT_FAILED_ONE' : item.type
  return t(`overview.activity.${key}`, {
    actor: item.actorName,
    listing: item.listingTitle,
    code: item.bookingCode,
    days: item.daysLeft,
    plan: item.planCode && t(`overview.plan.${item.planCode}`),
    amount: item.amount,
  })
}

export default function RecentActivity({ activity }) {
  const { t } = useI18n()

  if (!activity.data) return <CardStatus title={t('overview.recentActivity')} sources={[activity]} />

  return (
    <Card className="flex flex-col gap-4 p-5">
      <CardHeader title={t('overview.recentActivity')} actionLabel={t('overview.viewAuditLog')} actionTo="/settings" />

      {activity.data.items.map((item) => {
        const { icon: Icon, tile, text } = TYPES[item.type]
        return (
          <div key={`${item.type}-${item.at}`} className="flex min-h-10 gap-3">
            <span className={`flex size-7 shrink-0 items-center justify-center rounded-md ${tile}`}>
              <Icon size={16} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className={`text-sm ${text}`}>{activityText(item, t)}</p>
              <p className="text-caption text-muted">{timeAgo(item.at, t)}</p>
            </div>
          </div>
        )
      })}
    </Card>
  )
}
