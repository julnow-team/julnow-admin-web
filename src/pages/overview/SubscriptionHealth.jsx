import Card from '../../components/Card'
import CardHeader from '../../components/CardHeader'
import CardStatus from '../../components/CardStatus'
import ProgressRow from '../../components/ProgressRow'
import StatTile from '../../components/StatTile'
import { useI18n } from '../../lib/i18n'
import { formatMoney, formatMonth, formatNumber } from '../../lib/format'

const PLAN_TONES = { PRO: 'series-1', STARTER: 'series-2', TRIAL: 'series-3' }

export default function SubscriptionHealth({ auth, listings }) {
  const { t } = useI18n()

  if (!auth.data) return <CardStatus title={t('overview.subscriptionHealth')} sources={[auth]} />

  const { asOf, paidSubscriptions, subscriptionHealth: health } = auth.data
  const totalSubscriptions = health.plans.reduce((sum, plan) => sum + plan.count, 0)
  // Show at least a small bar, so a few late owners can still be seen
  const lateFill = Math.max(4, (health.lateOwners / paidSubscriptions.value) * 100)
  const pausedListings = listings.data ? formatNumber(listings.data.pausedListings) : '—'

  function planLabel(plan) {
    if (plan.code === 'TRIAL') return t('overview.plan.trial')
    return t('overview.plan.paid', { name: t(`overview.plan.${plan.code}`), price: plan.price })
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <CardHeader title={t('overview.subscriptionHealth')} subtitle={formatMonth(asOf, t)} />

      {health.plans.map((plan) => {
        const percent = (plan.count / totalSubscriptions) * 100
        return (
          <ProgressRow
            key={plan.code}
            label={planLabel(plan)}
            value={formatNumber(plan.count)}
            percent={percent}
            fill={percent}
            tone={PLAN_TONES[plan.code]}
          />
        )
      })}
      <ProgressRow
        label={t('overview.latePaused')}
        value={`${formatNumber(health.lateOwners)} / ${pausedListings}`}
        percent={null}
        fill={lateFill}
        tone="warning"
      />

      <div className="flex gap-3">
        <StatTile label={t('overview.renewals')} value={formatNumber(health.renewalsNext7Days)} />
        <StatTile label={t('overview.trialsEnding')} value={formatNumber(health.trialsEndingNext7Days)} />
        <StatTile label={t('overview.revenueAtRisk')} value={formatMoney(health.revenueAtRisk)} tone="warning" />
      </div>
    </Card>
  )
}
