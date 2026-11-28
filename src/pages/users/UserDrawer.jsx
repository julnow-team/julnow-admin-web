import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import Drawer from '../../components/Drawer'
import { formatDate } from '../../lib/format'
import { useI18n } from '../../lib/i18n'
import { BillingBadge, PlanCell, StatusBadge, TrustBadge } from './UserCells'

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 text-sm">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="flex min-w-0 flex-col items-end text-right break-words text-ink">{children}</dd>
    </div>
  )
}

// Details of one user. It shows what the list already has, there is no detail endpoint yet.
// user is null while the drawer is closed.
export default function UserDrawer({ user, onClose, onStatus }) {
  const { t } = useI18n()
  const suspended = user?.status === 'SUSPENDED'

  // Admins are not suspended from this screen
  const footer =
    user && user.role !== 'ADMIN' ? (
      <div className="flex justify-end">
        <Button
          variant={suspended ? 'secondary' : 'danger'}
          onClick={() => onStatus(user, suspended ? 'ACTIVE' : 'SUSPENDED')}
        >
          {t(suspended ? 'users.reactivate' : 'users.suspend')}
        </Button>
      </div>
    ) : null

  return (
    <Drawer
      open={user !== null}
      onClose={onClose}
      title={user?.fullName}
      badge={user && <StatusBadge status={user.status} />}
      footer={footer}
    >
      {user && (
        <>
          <div className="mb-4 flex items-center gap-3">
            <Avatar name={user.fullName} size={48} />
            <div className="min-w-0">
              <p className="text-sm font-semibold break-words text-ink">{user.email}</p>
              <p className="text-caption text-muted">{t(`users.role.${user.role}`)}</p>
            </div>
          </div>

          <dl className="divide-y divide-line border-y border-line">
            <Row label={t('users.detail.phone')}>{user.phone ?? <span className="text-muted">—</span>}</Row>
            <Row label={t('users.col.trust')}>
              <TrustBadge trust={user.trust} />
            </Row>
            <Row label={t('users.col.plan')}>
              <PlanCell plan={user.plan} />
            </Row>
            <Row label={t('users.col.billing')}>
              <BillingBadge billing={user.billing} hasPlan={user.plan !== null} />
            </Row>
            <Row label={t('users.col.joined')}>{formatDate(user.createdAt, t)}</Row>
            <Row label={t('users.detail.lastLogin')}>
              {user.lastLoginAt ? formatDate(user.lastLoginAt, t) : t('users.detail.never')}
            </Row>
          </dl>
        </>
      )}
    </Drawer>
  )
}
