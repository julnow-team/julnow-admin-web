import { useEffect } from 'react'
import { getUsers, getUserStats } from '../../api/users'
import PageHeader from '../../components/PageHeader'
import { useI18n } from '../../lib/i18n'
import { useApi } from '../../lib/useApi'
import AlertRow from './AlertRow'
import KpiRow from './KpiRow'
import UsersTable, { PAGE_SIZE } from './UsersTable'
import { useUserFilters } from './useUserFilters'

export default function UsersPage() {
  const { t } = useI18n()
  const { filters, search, setSearch, setFilter, setPage, reset } = useUserFilters()

  const stats = useApi(getUserStats)
  const users = useApi(getUsers, { ...filters, size: PAGE_SIZE })

  // A page number in the URL that is too big (an old link): go to the last page
  const totalPages = users.data?.totalPages ?? 0
  useEffect(() => {
    if (totalPages > 0 && filters.page >= totalPages) setPage(totalPages - 1)
  }, [totalPages, filters.page, setPage])

  return (
    <>
      <PageHeader title={t('users.title')} subtitle={t('users.subtitle')} />

      <div className="flex flex-col gap-6">
        <KpiRow stats={stats} />
        <AlertRow stats={stats} />
        <UsersTable
          users={users}
          stats={stats}
          filters={filters}
          search={search}
          onSearch={setSearch}
          onFilter={setFilter}
          onPage={setPage}
          onReset={reset}
        />
      </div>
    </>
  )
}
