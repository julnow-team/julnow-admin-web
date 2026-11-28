import { Briefcase, CreditCard, User, Users } from 'lucide-react'
import CardStatus from '../../components/CardStatus'
import KpiCard from '../../components/KpiCard'
import { formatNumber } from '../../lib/format'
import { useI18n } from '../../lib/i18n'

export default function KpiRow({ stats }) {
  const { t } = useI18n()
  const data = stats.data
  const vsLastMonth = t('users.kpi.vsLastMonth')

  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {['total', 'tenants', 'owners', 'paid'].map((name) => (
          <CardStatus key={name} title={t(`users.kpi.${name}`)} sources={[stats]} className="min-h-35" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label={t('users.kpi.total')}
        value={formatNumber(data.totalUsers.value)}
        icon={Users}
        change={data.totalUsers.change}
        note={vsLastMonth}
      />
      <KpiCard
        label={t('users.kpi.tenants')}
        value={formatNumber(data.tenants.value)}
        icon={User}
        change={data.tenants.change}
        note={vsLastMonth}
      />
      <KpiCard
        label={t('users.kpi.owners')}
        value={formatNumber(data.owners.value)}
        icon={Briefcase}
        change={data.owners.change}
        note={vsLastMonth}
      />
      <KpiCard
        label={t('users.kpi.paid')}
        value={formatNumber(data.paidSubscriptions.value)}
        icon={CreditCard}
        change={data.paidSubscriptions.change}
        note={t('users.kpi.onTrial', { count: formatNumber(data.paidSubscriptions.onTrial) })}
      />
    </div>
  )
}
