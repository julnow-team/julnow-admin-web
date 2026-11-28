import { useState } from 'react'
import {
  getAuthStats,
  getBookingStats,
  getListingStats,
  getRecentActivity,
  getRevenueSeries,
} from '../../api/overview'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import Select from '../../components/Select'
import { useAuth } from '../../lib/auth'
import { useI18n } from '../../lib/i18n'
import { useApi } from '../../lib/useApi'
import AlertRow from './AlertRow'
import KpiRow from './KpiRow'
import OwnerJourney from './OwnerJourney'
import RecentActivity from './RecentActivity'
import RevenueChart from './RevenueChart'
import RiskExceptions from './RiskExceptions'
import Submissions from './Submissions'
import SubscriptionHealth from './SubscriptionHealth'

const RANGES = ['7d', '30d', '90d']

export default function OverviewPage() {
  const { t } = useI18n()
  const [range, setRange] = useState('30d')

  // Each service has its own call, so one failing service only breaks its own sections
  const auth = useApi(getAuthStats, { range })
  const listings = useApi(getListingStats, { range })
  const bookings = useApi(getBookingStats, { range })
  const series = useApi(getRevenueSeries)
  const activity = useApi(getRecentActivity)
  const { admin } = useAuth()

  const actions = (
    <>
      <Select
        value={range}
        onChange={setRange}
        label={t('overview.rangeLabel')}
        options={RANGES.map((value) => ({ value, label: t(`overview.range.${value}`) }))}
      />
      <span title={t('overview.exportSoon')}>
        <Button disabled aria-label={`${t('overview.export')}. ${t('overview.exportSoon')}`}>
          {t('overview.export')}
        </Button>
      </span>
    </>
  )

  return (
    <>
      <PageHeader
        title={t('nav.overview')}
        subtitle={t('overview.welcome', { name: admin.fullName })}
        actions={actions}
      />

      <div className="flex flex-col gap-6">
        <KpiRow auth={auth} listings={listings} />
        <AlertRow auth={auth} listings={listings} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <SubscriptionHealth auth={auth} listings={listings} />
          <Submissions listings={listings} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <RevenueChart auth={auth} series={series} />
          <OwnerJourney auth={auth} listings={listings} bookings={bookings} range={range} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <RiskExceptions auth={auth} listings={listings} />
          <RecentActivity activity={activity} />
        </div>
      </div>
    </>
  )
}
