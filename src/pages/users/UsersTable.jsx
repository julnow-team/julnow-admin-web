import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import RowActions from '../../components/RowActions'
import SearchField from '../../components/SearchField'
import SegmentedControl from '../../components/SegmentedControl'
import Select from '../../components/Select'
import Table from '../../components/Table'
import { formatDate, formatNumber } from '../../lib/format'
import { useI18n } from '../../lib/i18n'
import { BillingBadge, PlanCell, StatusBadge, TrustBadge, UserCell } from './UserCells'
import { BILLINGS, PLANS, ROLES, STATUSES, TRUSTS } from './useUserFilters'

export const PAGE_SIZE = 10

export default function UsersTable({ users, stats, filters, search, onSearch, onFilter, onPage, onReset, onView, onStatus }) {
  const { t } = useI18n()

  // The tab counts are for all users, they do not follow the other filters
  const totals = stats.data
  const counts = totals && {
    all: totals.totalUsers.value,
    OWNER: totals.owners.value,
    TENANT: totals.tenants.value,
    ADMIN: totals.totalUsers.value - totals.owners.value - totals.tenants.value,
  }
  const withCount = (key, label) => (counts ? `${label} ${formatNumber(counts[key])}` : label)

  const roleTabs = [
    { value: '', label: withCount('all', t('users.tab.all')) },
    ...ROLES.map((role) => ({ value: role, label: withCount(role, t(`users.tab.${role}`)) })),
  ]

  // A filter Select: the first option is "All", the others are the values with their text
  function filterSelect(key, values, textKey) {
    return (
      <Select
        value={filters[key]}
        onChange={(value) => onFilter(key, value)}
        label={t(`users.filter.${key}`)}
        prefix={t(`users.filter.${key}`)}
        options={[
          { value: '', label: t('users.filter.all') },
          ...values.map((value) => ({ value, label: t(`${textKey}.${value}`) })),
        ]}
      />
    )
  }

  // Admins are not suspended from this screen, they only have View details
  function rowItems(user) {
    const items = [{ label: t('users.view'), onClick: () => onView(user) }]
    if (user.role === 'ADMIN') return items
    if (user.status === 'SUSPENDED') return [...items, { label: t('users.reactivate'), onClick: () => onStatus(user, 'ACTIVE') }]
    return [...items, { label: t('users.suspend'), onClick: () => onStatus(user, 'SUSPENDED') }]
  }

  const columns = [
    { key: 'user', header: t('users.col.user'), render: (user) => <UserCell user={user} /> },
    { key: 'role', header: t('users.col.role'), width: 110, render: (user) => t(`users.role.${user.role}`) },
    { key: 'status', header: t('users.col.status'), width: 150, render: (user) => <StatusBadge status={user.status} /> },
    { key: 'plan', header: t('users.col.plan'), width: 200, render: (user) => <PlanCell plan={user.plan} /> },
    {
      key: 'billing',
      header: t('users.col.billing'),
      width: 130,
      render: (user) => <BillingBadge billing={user.billing} hasPlan={user.plan !== null} />,
    },
    { key: 'trust', header: t('users.col.trust'), width: 140, render: (user) => <TrustBadge trust={user.trust} /> },
    {
      key: 'joined',
      header: t('users.col.joined'),
      width: 130,
      render: (user) => <span className="whitespace-nowrap">{formatDate(user.createdAt, t)}</span>,
    },
    {
      key: 'actions',
      header: t('users.col.actions'),
      hideHeader: true,
      align: 'right',
      width: 64,
      render: (user) => <RowActions label={t('users.rowActionsFor', { name: user.fullName })} items={rowItems(user)} />,
    },
  ]

  const data = users.data

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2 p-4">
        <SegmentedControl
          value={filters.role}
          onChange={(value) => onFilter('role', value)}
          options={roleTabs}
          label={t('users.roleTabs')}
        />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <SearchField
            value={search}
            onChange={onSearch}
            placeholder={t('users.search')}
            label={t('users.searchLabel')}
          />
          {filterSelect('status', STATUSES, 'users.status')}
          {filterSelect('plan', PLANS, 'users.planName')}
          {filterSelect('billing', BILLINGS, 'users.billing')}
          {filterSelect('trust', TRUSTS, 'users.trust')}
        </div>
      </div>

      <Table
        columns={columns}
        rows={data?.items ?? []}
        loading={users.loading}
        error={users.error && !data ? users.error : null}
        onRetry={users.reload}
        empty={{ title: t('users.emptyTitle'), onReset }}
      />

      {data && (
        <Pagination
          page={data.page}
          size={data.size}
          totalItems={data.totalItems}
          totalPages={data.totalPages}
          onPageChange={onPage}
          label={t('users.rows')}
        />
      )}
    </Card>
  )
}
