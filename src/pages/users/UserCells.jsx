import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'
import Tag from '../../components/Tag'
import { daysLeft, formatDate } from '../../lib/format'
import { useI18n } from '../../lib/i18n'

const STATUS_TONES = { ACTIVE: 'success', SUSPENDED: 'danger' }
const TRUST_TONES = { VERIFIED: 'success', FLAGGED: 'danger', UNVERIFIED: 'neutral' }
const BILLING_TONES = { PAID: 'success', UNPAID: 'neutral', PAST_DUE: 'warning', FAILED: 'danger' }
const PLAN_STATUS_TONES = { TRIALING: 'info', ACTIVE: 'success', PAST_DUE: 'warning', CANCELLED: 'neutral', EXPIRED: 'danger' }

// Shown when a cell has nothing (a tenant has no plan, an admin has no trust)
function Empty() {
  return <span className="text-muted">—</span>
}

export function UserCell({ user }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={user.fullName} />
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{user.fullName}</p>
        <p className="truncate text-caption text-muted">{user.email}</p>
      </div>
    </div>
  )
}

export function StatusBadge({ status }) {
  const { t } = useI18n()
  return (
    <Badge tone={STATUS_TONES[status]} dot>
      {t(`users.status.${status}`)}
    </Badge>
  )
}

export function TrustBadge({ trust }) {
  const { t } = useI18n()
  if (!trust) return <Empty />
  return (
    <Badge tone={TRUST_TONES[trust]} dot>
      {t(`users.trust.${trust}`)}
    </Badge>
  )
}

// A user with a plan but no invoice yet (a trial) is "not billed"
export function BillingBadge({ billing, hasPlan }) {
  const { t } = useI18n()
  if (!billing) return hasPlan ? <span className="text-muted">{t('users.billing.none')}</span> : <Empty />
  return (
    <Badge tone={BILLING_TONES[billing]} dot>
      {t(`users.billing.${billing}`)}
    </Badge>
  )
}

// The plan name comes from our text for the code. A plan added later falls back to the name from the API.
function planName(plan, t) {
  const key = `users.planName.${plan.code}`
  const text = t(key)
  return text === key ? plan.name : text
}

// The small line under the plan: when it ends, renews, or how long a late owner has left
function planLine(plan, t) {
  if (plan.status === 'PAST_DUE') {
    const days = daysLeft(plan.graceUntil)
    return t(days === 1 ? 'users.planLine.PAST_DUE_ONE' : 'users.planLine.PAST_DUE', { days })
  }
  return t(`users.planLine.${plan.status}`, { date: formatDate(plan.endsAt, t) })
}

export function PlanCell({ plan }) {
  const { t } = useI18n()
  if (!plan) return <Empty />
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-1">
        <Tag>{planName(plan, t)}</Tag>
        <Badge tone={PLAN_STATUS_TONES[plan.status]}>{t(`users.planStatus.${plan.status}`)}</Badge>
      </div>
      <p className="text-caption text-muted">{planLine(plan, t)}</p>
    </div>
  )
}
