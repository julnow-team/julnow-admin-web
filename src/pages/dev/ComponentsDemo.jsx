import { useState } from 'react'
import { MoreVertical, X } from 'lucide-react'
import Card from '../../components/Card'
import IconButton from '../../components/IconButton'
import Menu from '../../components/Menu'
import MenuItem from '../../components/MenuItem'
import PageHeader from '../../components/PageHeader'
import Pagination from '../../components/Pagination'
import SearchField from '../../components/SearchField'
import Select from '../../components/Select'
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
  const debouncedSearch = useDebounce(search)

  return (
    <>
      <PageHeader title="Shared components" subtitle="Part A: Input, IconButton, Menu, Select, SearchField, Pagination" />

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
