import { CreditCard, DollarSign, House, Users } from 'lucide-react'
import CardStatus from '../../components/CardStatus'
import KpiCard from '../../components/KpiCard'
import { useI18n } from '../../lib/i18n'
import { formatMoney, formatNumber } from '../../lib/format'

export default function KpiRow({ auth, listings }) {
  const { t } = useI18n()
  const vsLastMonth = t('overview.vsLastMonth')
  const authStats = auth.data
  const listingStats = listings.data

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {authStats ? (
        <KpiCard
          label={t('overview.monthlyRevenue')}
          value={formatMoney(authStats.monthlyRevenue.value)}
          icon={DollarSign}
          change={authStats.monthlyRevenue.change}
          note={vsLastMonth}
        />
      ) : (
        <CardStatus title={t('overview.monthlyRevenue')} sources={[auth]} className="min-h-35" />
      )}

      {authStats ? (
        <KpiCard
          label={t('overview.paidSubscriptions')}
          value={formatNumber(authStats.paidSubscriptions.value)}
          icon={CreditCard}
          change={authStats.paidSubscriptions.change}
          note={t('overview.onTrial', { count: formatNumber(authStats.paidSubscriptions.onTrial) })}
        />
      ) : (
        <CardStatus title={t('overview.paidSubscriptions')} sources={[auth]} className="min-h-35" />
      )}

      {listingStats ? (
        <KpiCard
          label={t('overview.activeListings')}
          value={formatNumber(listingStats.activeListings.value)}
          icon={House}
          change={listingStats.activeListings.change}
          note={vsLastMonth}
        />
      ) : (
        <CardStatus title={t('overview.activeListings')} sources={[listings]} className="min-h-35" />
      )}

      {authStats ? (
        <KpiCard
          label={t('overview.totalUsers')}
          value={formatNumber(authStats.totalUsers.value)}
          icon={Users}
          change={authStats.totalUsers.change}
          note={vsLastMonth}
        />
      ) : (
        <CardStatus title={t('overview.totalUsers')} sources={[auth]} className="min-h-35" />
      )}
    </div>
  )
}
