import { Bell, Search } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import Avatar from '../Avatar'
import { LanguageToggle, ThemeToggle } from '../PreferenceToggles'

export default function TopBar({ admin, hasNotifications }) {
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-canvas px-8">
      <button
        type="button"
        className="flex h-[38px] w-[440px] items-center gap-2 rounded-md border border-line bg-surface px-3 text-left text-sm text-muted"
      >
        <Search size={16} />
        <span className="flex-1">{t('topbar.search')}</span>
      </button>

      <div className="flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-md border border-line bg-surface text-ink-soft hover:bg-hover"
          aria-label={t('topbar.notifications')}
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
