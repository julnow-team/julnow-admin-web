import { useState } from 'react'
import { MoreVertical, Search, X } from 'lucide-react'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import Card from '../../components/Card'
import ConfirmDialog from '../../components/ConfirmDialog'
import Dialog from '../../components/Dialog'
import Drawer from '../../components/Drawer'
import IconButton from '../../components/IconButton'
import Input from '../../components/Input'
import Menu from '../../components/Menu'
import MenuItem from '../../components/MenuItem'
import PageHeader from '../../components/PageHeader'
import Pagination from '../../components/Pagination'
import RowActions from '../../components/RowActions'
import SearchField from '../../components/SearchField'
import SegmentedControl from '../../components/SegmentedControl'
import Select from '../../components/Select'
import Table from '../../components/Table'
import Tag from '../../components/Tag'
import { formatNumber } from '../../lib/format'
import { addMessages, useI18n } from '../../lib/i18n'
import { useDebounce } from '../../lib/useDebounce'
import { demoText } from './demoLocale'

// Dev only page (/dev/components). It is not in the sidebar and not built for production.
// It shows every shared component, the code to use it, and a Copy button.
// The text inside the examples comes from t() ("demo.*" in demoLocale.js), so you can also try Khmer.
// The titles and descriptions of the page itself are plain English on purpose.
addMessages('en', demoText.en)
addMessages('km', demoText.km)

const GROUPS = [
  { id: 'buttons', title: 'Buttons', items: ['Button', 'IconButton'] },
  { id: 'form', title: 'Form', items: ['Input', 'Select', 'SearchField', 'SegmentedControl'] },
  { id: 'data', title: 'Data', items: ['Table', 'Pagination', 'Tag', 'RowActions'] },
  { id: 'overlays', title: 'Overlays', items: ['Menu', 'Dialog', 'ConfirmDialog', 'Drawer'] },
]

const anchorOf = (name) => name.toLowerCase()

// The code shown under each example
const CODE = {
  Button: `<Button>Save</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button icon={Search} variant="secondary">Search</Button>
<Button variant="danger" loading>Deleting…</Button>
<Button variant="link" to="/users">Users</Button>`,

  IconButton: `<IconButton icon={X} label={t('common.close')} />
<IconButton icon={MoreVertical} iconSize={20} bordered
  label={t('table.rowActions')} />`,

  Input: `<Input icon={Search} placeholder="Type something…" />
<Input trailing={<span>USD</span>} />
<Input type="password" disabled />`,

  Select: `<Select prefix="Role" label="Role" value={role} onChange={setRole}
  options={[
    { value: 'all', label: 'All' },
    { value: 'owner', label: 'Owners' },
  ]} />`,

  SearchField: `const [search, setSearch] = useState('')
const debounced = useDebounce(search)   // send this one to the API
<SearchField value={search} onChange={setSearch}
  placeholder={t('users.search')} />`,

  SegmentedControl: `<SegmentedControl label="User type" value={type} onChange={setType}
  options={[
    { value: 'all', label: 'All 12,847' },
    { value: 'owners', label: 'Owners 2,598' },
  ]} />`,

  Table: `const columns = [
  { key: 'name', header: t('users.name') },
  { key: 'menu', header: t('users.actions'), hideHeader: true, align: 'right',
    render: (user) => <RowActions items={menuFor(user)} /> },
]
<Table columns={columns} rows={rows} loading={loading} error={error} onRetry={reload} />`,

  Pagination: `<Pagination page={page} size={10} label={t('users.title')}
  totalItems={data.totalItems} totalPages={data.totalPages}
  onPageChange={setPage} />`,

  Tag: `<Tag>Pro · $29</Tag>
<Tag tone="rental">Rental</Tag>
<Tag tone="travel">Travel</Tag>`,

  RowActions: `<RowActions items={[
  { label: t('users.view'), onClick: () => openUser(user) },
  { label: t('users.suspend'), onClick: () => askSuspend(user) },
]} />`,

  Menu: `<div className="relative">
  <button onClick={toggle}>Open</button>
  {open && <Menu><MenuItem>View details</MenuItem></Menu>}
</div>`,

  Dialog: `<Dialog open={open} onClose={() => setOpen(false)} title="Title"
  actions={<Button onClick={() => setOpen(false)}>Done</Button>}>
  Text inside the dialog
</Dialog>`,

  ConfirmDialog: `<ConfirmDialog open={open} onClose={() => setOpen(false)} tone="danger"
  title="Suspend Visal Heng?" message="His 10 listings will be hidden."
  confirmLabel="Suspend owner" loading={saving}
  onConfirm={handleSuspend} />`,

  Drawer: `<Drawer open={open} onClose={() => setOpen(false)} title="Listing review"
  subtitle="#JN-48213" badge={<Badge tone="danger" dot>Flagged</Badge>}
  footer={<Button>Approve listing</Button>}>
  Body of the drawer, it scrolls
</Drawer>`,
}

// Sample rows for the table demo. A real page gets its rows from an api file.
const USERS = [
  { id: 1, name: 'Sokha Chan', email: 'sokha.chan@gmail.com', roleKey: 'demo.roleOwner', statusKey: 'demo.statusActive', tone: 'success', plan: 'Pro · $29', joined: 'Mar 12, 2025' },
  { id: 2, name: 'Dara Kim', email: 'dara.kim@gmail.com', roleKey: 'demo.roleTenant', statusKey: 'demo.statusActive', tone: 'success', plan: null, joined: 'Apr 02, 2025' },
  { id: 3, name: 'Visal Heng', email: 'visal.heng@gmail.com', roleKey: 'demo.roleOwner', statusKey: 'demo.statusGrace', tone: 'warning', plan: 'Starter · $15', joined: 'May 21, 2025', rowTone: 'warning' },
  { id: 4, name: 'Bopha Sok', email: 'bopha.sok@gmail.com', roleKey: 'demo.roleOwner', statusKey: 'demo.statusSuspended', tone: 'danger', plan: 'Pro · $29', joined: 'Jun 09, 2025', rowTone: 'danger' },
  { id: 5, name: 'Sokha Chan Visal Heng Dara Kim Rithy Meas Srey Neang Phal', email: 'a-very-long-name-to-test-wrapping@example.com', roleKey: 'demo.roleAdmin', statusKey: 'demo.statusActive', tone: 'success', plan: null, joined: 'Jul 30, 2025' },
]

// Code under an example, with a button that copies it
function CodeSample({ code }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="relative mt-4">
      <pre className="overflow-x-auto rounded-md border border-line bg-canvas p-3 pr-24 font-mono text-xs leading-5 text-ink-soft">
        <code>{code}</code>
      </pre>
      <Button variant="secondary" size="sm" className="absolute top-2 right-2" onClick={copy}>
        {copied ? t('demo.copied') : t('demo.copy')}
      </Button>
    </div>
  )
}

// One component: title, short note, the live example, and its code
function Section({ name, note, children }) {
  return (
    <section id={anchorOf(name)} className="scroll-mt-20">
      <Card className="p-5">
        <h3 className="text-base font-semibold text-ink">{name}</h3>
        {note && <p className="mt-1 text-caption text-muted">{note}</p>}
        <div className="mt-4">{children}</div>
        <CodeSample code={CODE[name]} />
      </Card>
    </section>
  )
}

function Group({ id, title, children }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 id={id} className="scroll-mt-20 text-xl font-semibold text-ink">
        {title}
      </h2>
      {children}
    </div>
  )
}

// Links on the left that stay in view and jump to each section
function Contents() {
  return (
    <nav aria-label="Components" className="mb-6 lg:sticky lg:top-20 lg:mb-0 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
      {GROUPS.map((group) => (
        <div key={group.id} className="mb-4">
          <a href={`#${group.id}`} className="block px-2 py-1 text-xs font-semibold tracking-wide text-muted uppercase hover:text-ink">
            {group.title}
          </a>
          <ul>
            {group.items.map((name) => (
              <li key={name}>
                <a href={`#${anchorOf(name)}`} className="block rounded-md px-2 py-1 text-sm text-ink-soft hover:bg-hover hover:text-ink">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export default function ComponentsDemo() {
  const { t } = useI18n()
  const [role, setRole] = useState('all')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [segment, setSegment] = useState('all')
  const [tableState, setTableState] = useState('data')
  const [lastAction, setLastAction] = useState('none')
  const [bigPage, setBigPage] = useState(0)
  const [smallPage, setSmallPage] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogRole, setDialogRole] = useState('all')
  const [confirmKind, setConfirmKind] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [result, setResult] = useState('none')
  const debouncedSearch = useDebounce(search)

  const roles = [
    { value: 'all', label: t('demo.all') },
    { value: 'owner', label: t('demo.owners') },
    { value: 'tenant', label: t('demo.tenants') },
    { value: 'admin', label: t('demo.admins') },
  ]
  const sorts = [
    { value: 'newest', label: t('demo.newest') },
    { value: 'oldest', label: t('demo.oldest') },
    { value: 'price', label: t('demo.price') },
  ]
  const segments = [
    { value: 'all', label: t('demo.segAll', { count: formatNumber(12847) }) },
    { value: 'owners', label: t('demo.segOwners', { count: formatNumber(2598) }) },
    { value: 'tenants', label: t('demo.segTenants', { count: formatNumber(10215) }) },
    { value: 'admins', label: t('demo.segAdmins', { count: formatNumber(34) }) },
  ]
  const tableStates = [
    { value: 'data', label: t('demo.stateRows') },
    { value: 'loading', label: t('demo.stateLoading') },
    { value: 'empty', label: t('demo.stateEmpty') },
    { value: 'error', label: t('demo.stateError') },
  ]
  const confirms = {
    danger: {
      title: t('demo.suspendTitle'),
      message: t('demo.suspendMessage'),
      confirmLabel: t('demo.suspendConfirm'),
      tone: 'danger',
    },
    primary: {
      title: t('demo.discardTitle'),
      message: t('demo.discardMessage'),
      confirmLabel: t('demo.discardConfirm'),
      tone: 'primary',
    },
    long: {
      title: t('demo.longTitle'),
      message: t('demo.longMessage'),
      confirmLabel: t('demo.longConfirm'),
      tone: 'danger',
    },
  }

  const rowMenu = (user) => [
    { label: t('demo.viewDetails'), onClick: () => setLastAction(`${t('demo.viewDetails')}: ${user.name}`) },
    { label: t('demo.edit'), onClick: () => setLastAction(`${t('demo.edit')}: ${user.name}`) },
    { label: t('demo.remove'), onClick: () => setLastAction(`${t('demo.remove')}: ${user.name}`) },
  ]

  const columns = [
    {
      key: 'user',
      header: t('demo.colUser'),
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
    { key: 'role', header: t('demo.colRole'), width: 110, render: (user) => <Badge>{t(user.roleKey)}</Badge> },
    {
      key: 'status',
      header: t('demo.colStatus'),
      width: 150,
      render: (user) => (
        <Badge tone={user.tone} dot>
          {t(user.statusKey)}
        </Badge>
      ),
    },
    { key: 'plan', header: t('demo.colPlan'), width: 130, render: (user) => (user.plan ? <Tag>{user.plan}</Tag> : <span className="text-muted">—</span>) },
    { key: 'joined', header: t('demo.colJoined'), width: 120, render: (user) => <span className="text-ink-soft">{user.joined}</span> },
    {
      key: 'actions',
      header: t('demo.colActions'),
      hideHeader: true,
      width: 96,
      align: 'right',
      render: (user) => <RowActions items={rowMenu(user)} />,
    },
  ]

  // A real page would call the API here
  function runAction(done) {
    setConfirmLoading(true)
    setTimeout(() => {
      setConfirmLoading(false)
      done()
    }, 800)
  }

  return (
    <>
      <PageHeader
        title="Shared components"
        subtitle="Every shared component with a live example, the code to use it, and a Copy button. Only in development."
      />

      <div className="lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-8">
        <Contents />

        {/* The bottom space lets the last sections scroll up to the top when you click them in the contents */}
        <div className="flex flex-col gap-10 lg:pb-[70vh]">
          <Group id="buttons" title="Buttons">
            <Section name="Button" note='Variants: primary (default), secondary, ghost, link, danger. Sizes: md (default) and sm. Pass the "to" prop for a link that looks like a button.'>
              <div className="flex flex-wrap items-center gap-3">
                <Button>{t('demo.save')}</Button>
                <Button variant="secondary">{t('common.cancel')}</Button>
                <Button variant="ghost">{t('demo.skip')}</Button>
                <Button variant="link">{t('demo.learnMore')}</Button>
                <Button variant="danger">{t('demo.delete')}</Button>
                <Button size="sm">{t('demo.save')}</Button>
                <Button icon={Search} variant="secondary">
                  {t('demo.learnMore')}
                </Button>
                <Button loading>{t('demo.saving')}</Button>
                <Button disabled>{t('demo.disabled')}</Button>
              </div>
            </Section>

            <Section name="IconButton" note="Always pass label. It is the tooltip and the name for screen readers.">
              <div className="flex items-center gap-3">
                <IconButton icon={MoreVertical} iconSize={20} label={t('demo.menu')} />
                <IconButton icon={X} iconSize={20} label={t('common.close')} bordered />
                <IconButton icon={X} size="sm" iconSize={16} label={t('search.clear')} />
                <IconButton icon={X} label={t('demo.disabled')} disabled />
              </div>
            </Section>
          </Group>

          <Group id="form" title="Form">
            <Section name="Input" note="A text field. Use icon for something on the left and trailing for something on the right.">
              <div className="flex flex-wrap items-center gap-3">
                <Input icon={Search} placeholder={t('demo.inputPlaceholder')} className="w-70" />
                <Input trailing={<span className="text-sm text-muted">{t('demo.currency')}</span>} placeholder={t('demo.inputPlaceholder')} className="w-70" />
                <Input type="password" disabled className="w-70" />
              </div>
            </Section>

            <Section name="Select" note="Click it, or Tab to it and press the arrow keys, Enter and Esc. align='right' keeps the menu inside the screen.">
              <div className="flex items-center gap-3">
                <Select prefix={t('demo.role')} label={t('demo.role')} value={role} onChange={setRole} options={roles} />
                <Select prefix={t('demo.sort')} label={t('demo.sort')} value={sort} onChange={setSort} options={sorts} align="right" className="ml-auto" />
              </div>
              <p className="mt-4 text-sm text-ink-soft">
                Role: {role}, sort: {sort}
              </p>
            </Section>

            <Section name="SearchField" note="Controlled. The page sends the debounced value to the API, not the one that is being typed.">
              <SearchField value={search} onChange={setSearch} placeholder={t('demo.searchPlaceholder')} />
              <p className="mt-4 text-sm text-ink-soft">
                Typing: “{search}”, debounced: “{debouncedSearch}”
              </p>
            </Section>

            <Section name="SegmentedControl" note="Tabs with counts. Click, or Tab to it and use the arrow keys, Home and End.">
              <SegmentedControl label={t('demo.userType')} value={segment} onChange={setSegment} options={segments} />
              <p className="mt-4 text-sm text-ink-soft">Selected: {segment}</p>
            </Section>
          </Group>

          <Group id="data" title="Data">
            <Section
              name="Table"
              note="Pick a state. The Table has no card around it, so the page puts it in a Card with a toolbar and Pagination. Rows with rowTone are flagged."
            >
              <Select prefix={t('demo.state')} label={t('demo.tableState')} value={tableState} onChange={setTableState} options={tableStates} />
              <div className="mt-4 rounded-lg border border-line">
                <Table
                  columns={columns}
                  rows={tableState === 'data' ? USERS : []}
                  loading={tableState === 'loading'}
                  error={tableState === 'error' ? new Error('demo') : null}
                  onRetry={() => setTableState('data')}
                  empty={{ footnote: t('demo.filtersApplied'), onReset: () => setTableState('data') }}
                  rowTone={(user) => user.rowTone}
                />
                <Pagination
                  page={0}
                  size={10}
                  totalItems={tableState === 'data' ? USERS.length : 0}
                  totalPages={1}
                  onPageChange={() => {}}
                  label={t('demo.users')}
                />
              </div>
            </Section>

            <Section name="Pagination" note="page starts at 0, like the API. Many pages, then a few pages.">
              <div className="rounded-lg border border-line">
                <Pagination page={bigPage} size={10} totalItems={12847} totalPages={1285} onPageChange={setBigPage} label={t('demo.users')} />
              </div>
              <div className="mt-4 rounded-lg border border-line">
                <Pagination page={smallPage} size={10} totalItems={25} totalPages={3} onPageChange={setSmallPage} label={t('demo.listings')} />
              </div>
            </Section>

            <Section name="Tag" note="Square corners. Plan tags use the neutral tone, listing categories use rental, stay and travel.">
              <div className="flex items-center gap-3">
                <Tag>Pro · $29</Tag>
                <Tag tone="rental">{t('demo.rental')}</Tag>
                <Tag tone="stay">{t('demo.stay')}</Tag>
                <Tag tone="travel">{t('demo.travel')}</Tag>
              </div>
            </Section>

            <Section name="RowActions" note="The ⋮ button at the end of a row. The menu is fixed, so a table that scrolls sideways does not cut it off.">
              <div className="flex items-center gap-3">
                <RowActions items={rowMenu({ name: 'Sokha Chan' })} />
              </div>
              <p className="mt-4 text-sm text-ink-soft">Last row action: {lastAction}</p>
            </Section>
          </Group>

          <Group id="overlays" title="Overlays">
            <Section name="Menu" note="Used inside Select and RowActions. This one is always open.">
              <div className="h-44">
                <div className="relative inline-block">
                  <span className="text-sm text-ink-soft">{t('demo.menu')}</span>
                  <Menu>
                    <MenuItem>{t('demo.viewDetails')}</MenuItem>
                    <MenuItem selected>{t('demo.edit')}</MenuItem>
                    <MenuItem active>{t('demo.remove')}</MenuItem>
                  </Menu>
                </div>
              </div>
            </Section>

            <Section name="Dialog" note="A window in the middle. Esc and a click outside close it. The browser keeps focus inside and gives it back.">
              <Button variant="secondary" onClick={() => setDialogOpen(true)}>
                {t('demo.openDialog')}
              </Button>
            </Section>

            <Section
              name="ConfirmDialog"
              note="A Dialog that asks are you sure. The confirm buttons wait 0.8 seconds, like a real request, and the dialog cannot close meanwhile."
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary" onClick={() => setConfirmKind('danger')}>
                  {t('demo.dangerConfirm')}
                </Button>
                <Button variant="secondary" onClick={() => setConfirmKind('primary')}>
                  {t('demo.primaryConfirm')}
                </Button>
                <Button variant="secondary" onClick={() => setConfirmKind('long')}>
                  {t('demo.longText')}
                </Button>
              </div>
              <p className="mt-4 text-sm text-ink-soft">Result: {result}</p>
            </Section>

            <Section name="Drawer" note="Only the body scrolls. The footer stays. The Reject button opens a ConfirmDialog on top of the drawer.">
              <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                {t('demo.openDrawer')}
              </Button>
            </Section>
          </Group>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={t('demo.dialogTitle')}
        actions={<Button onClick={() => setDialogOpen(false)}>{t('demo.done')}</Button>}
      >
        <p className="mb-3">{t('demo.dialogText')}</p>
        <Select prefix={t('demo.role')} label={t('demo.dialogRole')} value={dialogRole} onChange={setDialogRole} options={roles} />
      </Dialog>

      <ConfirmDialog
        open={confirmKind !== null}
        onClose={() => setConfirmKind(null)}
        {...(confirms[confirmKind] ?? {})}
        loading={confirmLoading}
        onConfirm={() =>
          runAction(() => {
            setResult(`confirmed: ${confirmKind}`)
            setConfirmKind(null)
          })
        }
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={t('demo.drawerTitle')}
        subtitle={t('demo.drawerSubtitle')}
        badge={
          <Badge tone="danger" dot>
            {t('demo.flagged')}
          </Badge>
        }
        footer={
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setDrawerOpen(false)}>{t('demo.approve')}</Button>
              <Button variant="secondary" onClick={() => setRejectOpen(true)}>
                {t('demo.reject')}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary">{t('demo.requestChanges')}</Button>
              <Button variant="danger">{t('demo.suspendAccount')}</Button>
            </div>
            <p className="text-center text-xs font-medium text-muted">{t('demo.loggedNote')}</p>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-danger-subtle p-4 text-danger">
            <p className="text-sm font-semibold">{t('demo.checksFailed')}</p>
            <p className="text-xs font-medium">{t('demo.checksDetail')}</p>
          </div>
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className="rounded-lg border border-line bg-canvas p-4">
              <p className="text-sm font-semibold text-ink">{t('demo.section', { n: index + 1 })}</p>
              <p className="text-sm text-ink-soft">{t('demo.sectionText')}</p>
            </div>
          ))}
        </div>
      </Drawer>

      <ConfirmDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title={t('demo.rejectTitle')}
        message={t('demo.rejectMessage')}
        confirmLabel={t('demo.rejectConfirm')}
        tone="danger"
        loading={confirmLoading}
        onConfirm={() =>
          runAction(() => {
            setResult('rejected from the drawer')
            setRejectOpen(false)
            setDrawerOpen(false)
          })
        }
      />
    </>
  )
}
