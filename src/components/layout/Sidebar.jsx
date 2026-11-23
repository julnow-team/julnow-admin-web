import { NavLink } from 'react-router-dom'
import { ChartNoAxesColumn, CreditCard, House, LayoutGrid, LogOut, Settings, Shield, Users } from 'lucide-react'
import logo from '../../assets/logo.png'
import Avatar from '../Avatar'

const MAIN_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/listings', label: 'Listings', icon: House, countKey: 'flaggedListings' },
  { to: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/reports', label: 'Reports & Risk', icon: Shield, countKey: 'openCases' },
  { to: '/analytics', label: 'Analytics', icon: ChartNoAxesColumn },
]

const SYSTEM_ITEMS = [{ to: '/settings', label: 'Settings', icon: Settings }]

function NavItem({ item, count }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex h-[38px] items-center gap-3 rounded-md px-3 text-sm ${
          isActive ? 'bg-primary-subtle font-semibold text-primary' : 'text-ink-soft hover:bg-hover'
        }`
      }
    >
      <Icon size={18} strokeWidth={2} />
      <span className="flex-1">{item.label}</span>
      {count > 0 && (
        <span className="rounded-full bg-subtle px-2 py-0.5 text-xs font-medium text-ink-soft">{count}</span>
      )}
    </NavLink>
  )
}

function SectionLabel({ children }) {
  return <p className="px-3 pt-4 pb-2 text-xs font-medium tracking-[0.01em] text-muted">{children}</p>
}

export default function Sidebar({ counts, admin, onLogout }) {
  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col gap-1 border-r border-line bg-surface px-4 py-5">
      <div className="flex items-center gap-2 px-2 pt-1 pb-5">
        <div className="relative h-[69px] w-[124px] overflow-hidden">
          <img
            src={logo}
            alt="JulNow"
            className="absolute max-w-none"
            style={{ width: '142.27%', height: '255.56%', left: '-20.62%', top: '-81.48%' }}
          />
        </div>
        <span className="rounded-sm bg-subtle px-2 py-0.5 text-xs font-medium text-ink-soft">Admin</span>
      </div>

      <SectionLabel>MAIN</SectionLabel>
      {MAIN_ITEMS.map((item) => (
        <NavItem key={item.to} item={item} count={item.countKey ? counts[item.countKey] : 0} />
      ))}

      <SectionLabel>SYSTEM</SectionLabel>
      {SYSTEM_ITEMS.map((item) => (
        <NavItem key={item.to} item={item} />
      ))}

      <div className="flex-1" />

      <div className="flex items-center gap-2.5 rounded-[10px] border border-line bg-canvas p-3">
        <Avatar name={admin.fullName} size={36} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{admin.fullName}</p>
          <p className="truncate text-xs font-medium text-muted">{admin.roleName}</p>
        </div>
        <button type="button" onClick={onLogout} className="text-ink-soft hover:text-ink" aria-label="Log out">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  )
}
