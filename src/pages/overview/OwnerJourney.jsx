import Card from '../../components/Card'
import CardHeader from '../../components/CardHeader'
import CardStatus from '../../components/CardStatus'
import ProgressRow from '../../components/ProgressRow'
import { useI18n } from '../../lib/i18n'
import { formatNumber } from '../../lib/format'

export default function OwnerJourney({ auth, listings, bookings, range }) {
  const { t } = useI18n()

  if (!auth.data || !listings.data || !bookings.data) {
    return <CardStatus title={t('overview.ownerJourney')} sources={[auth, listings, bookings]} />
  }

  const { signups, startedTrial, convertedToPaid } = auth.data.ownerJourney
  const steps = [
    { key: 'signups', count: signups, tone: 'series-1' },
    { key: 'trial', count: startedTrial, tone: 'series-1' },
    { key: 'firstListing', count: listings.data.publishedFirstListing, tone: 'series-2' },
    { key: 'paid', count: convertedToPaid, tone: 'series-2' },
    { key: 'firstBooking', count: bookings.data.ownersWithFirstBooking, tone: 'series-3' },
  ]

  return (
    <Card className="flex flex-col gap-4 p-5">
      <CardHeader title={t('overview.ownerJourney')} subtitle={t(`overview.range.${range}`)} />

      {steps.map((step) => {
        const percent = signups ? (step.count / signups) * 100 : 0
        return (
          <ProgressRow
            key={step.key}
            label={t(`overview.step.${step.key}`)}
            value={formatNumber(step.count)}
            percent={percent}
            fill={percent}
            tone={step.tone}
          />
        )
      })}
    </Card>
  )
}
