import { CreditCard, Shield } from 'lucide-react'
import AlertCard from '../../components/AlertCard'
import CardStatus from '../../components/CardStatus'
import { formatNumber } from '../../lib/format'
import { useI18n } from '../../lib/i18n'

export default function AlertRow({ stats }) {
  const { t } = useI18n()
  const data = stats.data

  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CardStatus title={t('users.alert.billing')} sources={[stats]} className="min-h-30" />
        <CardStatus title={t('users.alert.trust')} sources={[stats]} className="min-h-30" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <AlertCard
        tone="warning"
        icon={CreditCard}
        label={t('users.alert.billing')}
        title={t('users.alert.lateOwners', { count: formatNumber(data.lateOwners.value) })}
        note={t('users.alert.lateNote', { days: data.lateOwners.graceDays })}
        to="/users?billing=PAST_DUE"
      />
      <AlertCard
        tone="danger"
        icon={Shield}
        label={t('users.alert.trust')}
        title={t('users.alert.suspended', { count: formatNumber(data.suspendedUsers) })}
        note={t('users.alert.suspendedNote')}
        to="/users?status=SUSPENDED"
      />
    </div>
  )
}
