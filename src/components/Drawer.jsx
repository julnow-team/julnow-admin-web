import { useId } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { useModal } from '../lib/useModal'
import IconButton from './IconButton'

// Panel that slides in from the right, for looking at one item. Only the body scrolls.
// badge: a Badge next to the title. footer: the action buttons, they stay at the bottom.
export default function Drawer({ open, onClose, title, subtitle, badge, children, footer }) {
  const { t } = useI18n()
  const modal = useModal(open, onClose)
  const titleId = useId()

  return (
    <dialog
      {...modal}
      aria-labelledby={titleId}
      className="m-0 ml-auto h-dvh max-h-none w-130 max-w-full overflow-hidden border-0 border-l border-line bg-surface p-0 text-ink shadow-drawer backdrop:bg-overlay"
    >
      {open && (
        <div className="flex h-full flex-col">
          <header className="flex min-h-18 items-center justify-between gap-3 border-b border-line px-6 py-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id={titleId} className="text-base font-semibold text-ink">
                  {title}
                </h2>
                {badge}
              </div>
              {subtitle && <p className="text-xs font-medium tracking-[0.01em] text-muted">{subtitle}</p>}
            </div>
            <IconButton icon={X} iconSize={20} bordered label={t('common.close')} onClick={onClose} />
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

          {footer && <footer className="border-t border-line px-6 py-3.5">{footer}</footer>}
        </div>
      )}
    </dialog>
  )
}
