import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useClickOutside } from '../lib/useClickOutside'
import { useI18n } from '../lib/i18n'
import IconButton from './IconButton'
import Menu from './Menu'
import MenuItem from './MenuItem'

// Height of one menu row (34) with the gap (2), plus the padding and border of the menu
const ITEM_HEIGHT = 36
const MENU_FRAME = 14

// The "⋮" button at the end of a table row. items: [{ label, onClick }].
// The menu uses fixed position, so a table that scrolls sideways does not cut it off.
export default function RowActions({ items, label }) {
  const { t } = useI18n()
  // null when closed, otherwise where the menu goes: { top or bottom, right }
  const [place, setPlace] = useState(null)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const open = place !== null
  const name = label ?? t('table.rowActions')

  useClickOutside(rootRef, () => setPlace(null), open)

  // Move focus to the first item when the menu opens
  useEffect(() => {
    if (open) menuRef.current?.querySelector('[role=menuitem]')?.focus()
  }, [open])

  // A fixed menu would stay behind when the page scrolls, so close it
  useEffect(() => {
    if (!open) return

    const close = () => setPlace(null)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  function openMenu() {
    const rect = buttonRef.current.getBoundingClientRect()
    const viewport = document.documentElement
    const fitsBelow = rect.bottom + 6 + items.length * ITEM_HEIGHT + MENU_FRAME < viewport.clientHeight

    setPlace({
      right: viewport.clientWidth - rect.right,
      ...(fitsBelow ? { top: rect.bottom + 6 } : { bottom: viewport.clientHeight - rect.top + 6 }),
    })
  }

  function closeMenu() {
    setPlace(null)
    buttonRef.current?.focus()
  }

  function choose(item) {
    closeMenu()
    item.onClick()
  }

  function handleButtonKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openMenu()
    }
  }

  function handleMenuKeyDown(event) {
    const rows = [...menuRef.current.querySelectorAll('[role=menuitem]')]
    const index = rows.indexOf(document.activeElement)

    switch (event.key) {
      case 'ArrowDown':
        rows[(index + 1) % rows.length].focus()
        break
      case 'ArrowUp':
        rows[(index - 1 + rows.length) % rows.length].focus()
        break
      case 'Home':
        rows[0].focus()
        break
      case 'End':
        rows[rows.length - 1].focus()
        break
      case 'Escape':
        closeMenu()
        break
      case 'Tab':
        setPlace(null)
        return
      default:
        return
    }
    event.preventDefault()
  }

  return (
    <div ref={rootRef} className="relative inline-flex">
      <IconButton
        ref={buttonRef}
        icon={MoreVertical}
        iconSize={20}
        label={name}
        aria-haspopup="menu"
        aria-expanded={open}
        className={open ? 'bg-hover' : ''}
        onClick={() => (open ? setPlace(null) : openMenu())}
        onKeyDown={handleButtonKeyDown}
      />

      {open && (
        <Menu ref={menuRef} fixed role="menu" aria-label={name} style={place} onKeyDown={handleMenuKeyDown}>
          {items.map((item) => (
            <MenuItem key={item.label} as="button" type="button" role="menuitem" onClick={() => choose(item)}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  )
}
