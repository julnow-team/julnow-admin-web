import { useId } from 'react'
import { useModal } from '../lib/useModal'

// Small window in the middle of the screen. `actions` are the buttons, they sit on the right.
// Esc and a click outside call onClose. The browser keeps focus inside and gives it back when it closes.
export default function Dialog({ open, onClose, title, children, actions }) {
  const modal = useModal(open, onClose)
  const titleId = useId()
  const bodyId = useId()

  return (
    <dialog
      {...modal}
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className="m-auto w-105 max-w-[calc(100vw-2rem)] overflow-visible rounded-lg border-0 bg-surface p-0 text-ink shadow-dialog backdrop:bg-overlay"
    >
      {open && (
        <div className="flex flex-col gap-2 px-6 pt-6 pb-5">
          <h2 id={titleId} className="text-base font-semibold text-ink">
            {title}
          </h2>
          <div id={bodyId} className="text-sm text-ink-soft">
            {children}
          </div>
          {actions && <div className="flex flex-wrap justify-end gap-2 pt-3">{actions}</div>}
        </div>
      )}
    </dialog>
  )
}
