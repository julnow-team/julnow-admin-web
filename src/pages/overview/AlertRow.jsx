import { CreditCard, Flag, Shield } from 'lucide-react'
import AlertCard from '../../components/AlertCard'
import CardStatus from '../../components/CardStatus'
import { useI18n } from '../../lib/i18n'

export default function AlertRow({ auth, listings }) {
  const { t } = useI18n()
  const authStats = auth.data
  const listingStats = listings.data

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {authStats ? (
        <AlertCard
          tone="warning"
          icon={CreditCard}
          label={t('overview.paymentFailures')}
          title={t('overview.lateOwners', { count: authStats.subscriptionHealth.lateOwners })}
          note={t('overview.lateOwnersNote')}
          to="/subscriptions"
        />
      ) : (
        <CardStatus title={t('overview.paymentFailures')} sources={[auth]} className="min-h-30" />
      )}

      {listingStats ? (
        <AlertCard
          tone="info"
          icon={Flag}
          label={t('overview.newListings')}
          title={t('overview.flaggedToday', { count: listingStats.submissions.flagged })}
          note={t('overview.flaggedNote', { total: listingStats.submissions.submitted })}
          to="/listings"
        />
      ) : (
        <CardStatus title={t('overview.newListings')} sources={[listings]} className="min-h-30" />
      )}

      {authStats && listingStats ? (
        <AlertCard
          tone="danger"
          icon={Shield}
          label={t('overview.openCases')}
          title={t('overview.openCasesCount', { count: authStats.casesFromUsers + listingStats.casesFromSystem })}
          note={t('overview.openCasesNote', { users: authStats.casesFromUsers, system: listingStats.casesFromSystem })}
          to="/reports"
        />
      ) : (
        <CardStatus title={t('overview.openCases')} sources={[auth, listings]} className="min-h-30" />
      )}
    </div>
  )
}
