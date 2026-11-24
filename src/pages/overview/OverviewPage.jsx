import { CreditCard, DollarSign, Flag, House, Shield, Users } from 'lucide-react'
import { getCurrentAdmin } from '../../api/navigation'
import { getOverview } from '../../api/overview'
import AlertCard from '../../components/AlertCard'
import KpiCard from '../../components/KpiCard'
import PageHeader from '../../components/PageHeader'
import PageStatus from '../../components/PageStatus'
import { useI18n } from '../../lib/i18n'
import { useApi } from '../../lib/useApi'

const number = (value) => value.toLocaleString('en-US')

export default function OverviewPage() {
  const { t } = useI18n()
  const { data: overview, error, reload } = useApi(getOverview)
  const { data: admin } = useApi(getCurrentAdmin)

  if (!overview) return <PageStatus error={error} onRetry={reload} />

  const { monthlyRevenue, paidSubscriptions, activeListings, totalUsers, attention } = overview
  const vsLastMonth = t('overview.vsLastMonth')

  return (
    <>
      <PageHeader title={t('nav.overview')} subtitle={t('overview.welcome', { name: admin?.fullName })} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label={t('overview.monthlyRevenue')}
          value={`$${number(monthlyRevenue.value)}`}
          icon={DollarSign}
          change={monthlyRevenue.change}
          note={vsLastMonth}
        />
        <KpiCard
          label={t('overview.paidSubscriptions')}
          value={number(paidSubscriptions.value)}
          icon={CreditCard}
          change={paidSubscriptions.change}
          note={`${vsLastMonth} ${t('overview.onTrial', { count: paidSubscriptions.onTrial })}`}
        />
        <KpiCard
          label={t('overview.activeListings')}
          value={number(activeListings.value)}
          icon={House}
          change={activeListings.change}
          note={vsLastMonth}
        />
        <KpiCard
          label={t('overview.totalUsers')}
          value={number(totalUsers.value)}
          icon={Users}
          change={totalUsers.change}
          note={vsLastMonth}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <AlertCard
          tone="warning"
          icon={CreditCard}
          label={t('overview.paymentFailures')}
          title={t('overview.lateOwners', { count: attention.lateOwners })}
          note={t('overview.lateOwnersNote')}
        />
        <AlertCard
          tone="info"
          icon={Flag}
          label={t('overview.newListings')}
          title={t('overview.flaggedToday', { count: attention.flaggedToday })}
          note={t('overview.flaggedNote', { total: attention.newToday })}
        />
        <AlertCard
          tone="danger"
          icon={Shield}
          label={t('overview.openCases')}
          title={t('overview.openCasesCount', { count: attention.openCases })}
          note={t('overview.openCasesNote', { users: attention.casesFromUsers, system: attention.casesFromSystem })}
        />
      </div>
    </>
  )
}