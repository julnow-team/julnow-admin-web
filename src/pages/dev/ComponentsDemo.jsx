import { useState } from 'react'
import { MoreVertical, X } from 'lucide-react'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'
import Card from '../../components/Card'
import IconButton from '../../components/IconButton'
import Menu from '../../components/Menu'
import MenuItem from '../../components/MenuItem'
import PageHeader from '../../components/PageHeader'
import Pagination from '../../components/Pagination'
import RowActions from '../../components/RowActions'
import SearchField from '../../components/SearchField'
import Select from '../../components/Select'
import Table from '../../components/Table'
import Tag from '../../components/Tag'
import { useDebounce } from '../../lib/useDebounce'

// Dev only page (/dev/components). It is not in the sidebar and not built for production.
// Use it to see how each shared component looks and how to call it. The text here is plain English on purpose.

const ROLES = [
  { value: 'all', label: 'All' },
  { value: 'owner', label: 'Owners' },
  { value: 'tenant', label: 'Tenants' },
  { value: 'admin', label: 'Admins' },
]

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price', label: 'Price' },
]

const TABLE_STATES = [
  { value: 'data', label: 'With rows' },
  { value: 'loading', label: 'Loading' },
  { value: 'empty', label: 'Empty' },
  { value: 'error', label: 'Error' },
]

// Sample rows for the table demo. A real page gets its rows from an api file.
const USERS = [
  { id: 1, name: 'Sokha Chan', email: 'sokha.chan@gmail.com', role: 'Owner', status: 'Active', tone: 'success', plan: 'Pro · $29', joined: 'Mar 12, 2025' },
  { id: 2, name: 'Dara Kim', email: 'dara.kim@gmail.com', role: 'Tenant', status: 'Active', tone: 'success', plan: null, joined: 'Apr 02, 2025' },
  { id: 3, name: 'Visal Heng', email: 'visal.heng@gmail.com', role: 'Owner', status: 'Grace', tone: 'warning', plan: 'Starter · $15', joined: 'May 21, 2025', rowTone: 'warning' },
  { id: 4, name: 'Bopha Sok', email: 'bopha.sok@gmail.com', role: 'Owner', status: 'Suspended', tone: 'danger', plan: 'Pro · $29', joined: 'Jun 09, 2025', rowTone: 'danger' },
  { id: 5, name: 'Sokha Chan Visal Heng Dara Kim Rithy Meas Srey Neang Phal', email: 'a-very-long-name-to-test-wrapping@example.com', role: 'Admin', status: 'Active', tone: 'success', plan: null, joined: 'Jul 30, 2025' },
]

function Demo({ title, note, children }) {
  return (
    <Card className="p-5">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {note && <p className="mt-1 mb-4 text-caption text-muted">{note}</p>}
      {!note && <div className="mb-4" />}
      {children}
    </Card>
  )
}

export default function ComponentsDemo() {
  const [role, setRole] = useState('all')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [bigPage, setBigPage] = useState(0)
  const [smallPage, setSmallPage] = useState(0)
  const [tableState, setTableState] = useState('data')
  const [lastAction, setLastAction] = useState('none')
  const debouncedSearch = useDebounce(search)

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (user) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={user.name} size={36} />
          <div className="min-w-0">
            <p className={`font-semibold ${user.rowTone === 'danger' ? 'text-danger' : 'text-ink'}`}>{user.name}</p>
            <p className="text-caption text-muted">{user.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', width: 96, render: (user) => <Badge>{user.role}</Badge> },
    { key: 'status', header: 'Account status', width: 150, render: (user) => <Badge tone={user.tone} dot>{user.status}</Badge> },
    { key: 'plan', header: 'Plan', width: 130, render: (user) => (user.plan ? <Tag>{user.plan}</Tag> : <span className="text-muted">—</span>) },
    { key: 'joined', header: 'Joined', width: 120, render: (user) => <span className="text-ink-soft">{user.joined}</span> },
    {
      key: 'actions',
      header: 'Actions',
      hideHeader: true,
      width: 96,
      align: 'right',
      render: (user) => (
        <RowActions
          items={[
            { label: 'View details', onClick: () => setLastAction(`View details: ${user.name}`) },
            { label: 'Edit', onClick: () => setLastAction(`Edit: ${user.name}`) },
            { label: 'Remove', onClick: () => setLastAction(`Remove: ${user.name}`) },
          ]}
        />
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Shared components" subtitle="Part A: Input, IconButton, Menu, Select, SearchField, Pagination. Part B: Table, Tag, RowActions" />

      <div className="flex flex-col gap-6">
        <Demo title="IconButton" note="Always pass label. It is the tooltip and the name for screen readers.">
          <div className="flex items-center gap-3">
            <IconButton icon={MoreVertical} iconSize={20} label="Row menu" />
            <IconButton icon={X} iconSize={20} label="Close" bordered />
            <IconButton icon={X} size="sm" iconSize={16} label="Clear" />
            <IconButton icon={X} label="Disabled" disabled />
          </div>
        </Demo>

        <Demo title="Select" note="Click it, or Tab to it and press the arrow keys, Enter and Esc. align='right' keeps the menu inside the screen.">
          <div className="flex items-center gap-3">
            <Select prefix="Role" label="Role" value={role} onChange={setRole} options={ROLES} />
            <Select prefix="Sort" label="Sort" value={sort} onChange={setSort} options={SORTS} align="right" className="ml-auto" />
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Role: {role}, sort: {sort}
          </p>
        </Demo>

        <Demo title="SearchField" note="Controlled. The page sends debouncedSearch to the API, not search.">
          <SearchField value={search} onChange={setSearch} placeholder="Search by name or email…" />
          <p className="mt-4 text-sm text-ink-soft">
            Typing: “{search}”, debounced: “{debouncedSearch}”
          </p>
        </Demo>

        <Demo title="Menu and MenuItem" note="Used inside Select and later in the row actions. This one is always open.">
          <div className="h-44">
            <div className="relative inline-block">
              <span className="text-sm text-ink-soft">Menu under this text</span>
              <Menu>
                <MenuItem>View details</MenuItem>
                <MenuItem selected>Edit (selected)</MenuItem>
                <MenuItem active>Remove (active)</MenuItem>
              </Menu>
            </div>
          </div>
        </Demo>

        <Demo title="Tag" note="Square corners. Plan tags use the neutral tone, listing categories use rental, stay and travel.">
          <div className="flex items-center gap-3">
            <Tag>Pro · $29</Tag>
            <Tag tone="rental">Rental</Tag>
            <Tag tone="stay">Stay</Tag>
            <Tag tone="travel">Travel</Tag>
          </div>
        </Demo>

        <Demo
          title="Table, RowActions"
          note="Pick a state. The Table has no card around it, so the page puts it in a Card with a toolbar and Pagination. Rows with rowTone are flagged."
        >
          <Select prefix="State" label="Table state" value={tableState} onChange={setTableState} options={TABLE_STATES} />
          <Card className="mt-4">
            <Table
              columns={columns}
              rows={tableState === 'data' ? USERS : []}
              loading={tableState === 'loading'}
              error={tableState === 'error' ? new Error('demo') : null}
              onRetry={() => setTableState('data')}
              empty={{ footnote: '2 filters applied · search, role', onReset: () => setTableState('data') }}
              rowTone={(user) => user.rowTone}
            />
            <Pagination page={0} size={10} totalItems={tableState === 'data' ? USERS.length : 0} totalPages={1} onPageChange={() => {}} label="users" />
          </Card>
          <p className="mt-4 text-sm text-ink-soft">Last row action: {lastAction}</p>
        </Demo>

        <Demo title="Pagination" note="page starts at 0, like the API. Many pages, then a few pages.">
          <Card>
            <Pagination page={bigPage} size={10} totalItems={12847} totalPages={1285} onPageChange={setBigPage} label="users" />
          </Card>
          <Card className="mt-4">
            <Pagination page={smallPage} size={10} totalItems={25} totalPages={3} onPageChange={setSmallPage} label="listings" />
          </Card>
        </Demo>
      </div>
    </>
  )
}
