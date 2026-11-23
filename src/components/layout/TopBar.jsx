import { Bell, Search } from 'lucide-react'
import Avatar from '../Avatar'

export default function TopBar({ admin, hasNotifications }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-canvas px-8">
      <button
        type="button"
        className="flex h-[38px] w-[440px] items-center gap-2 rounded-md border border-line bg-surface px-3 text-left text-sm text-muted"
      >
        <Search size={16} />
        <span className="flex-1">Search users, listings, subscriptions, cases…</span>
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-md border border-line bg-surface text-ink-soft hover:bg-hover"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {hasNotifications && <span className="absolute top-2 right-2 size-1.5 rounded-full bg-danger" />}
        </button>
        <span className="h-6 w-px bg-subtle" />
        <Avatar name={admin.fullName} size={32} />
      </div>
    </header>
  )
}
