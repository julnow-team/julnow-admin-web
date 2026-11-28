import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useClickOutside } from '../lib/useClickOutside'
import Menu from './Menu'
import MenuItem from './MenuItem'

// Dropdown for filters. options is a list of { value, label }.
// `prefix` is shown before the chosen option, like "Role: All". `label` is the name for screen readers.
export default function Select({ value, onChange, options, label, prefix, align = 'left', className = '' }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()

  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))
  const selected = options[selectedIndex]

  // When the list opens, move focus into it so the arrow keys work
  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  useClickOutside(rootRef, () => setOpen(false), open)

  function openList() {
    setActive(selectedIndex)
    setOpen(true)
  }

  function closeList() {
    setOpen(false)
    buttonRef.current?.focus()
  }

  function choose(index) {
    onChange(options[index].value)
    closeList()
  }

  function handleButtonKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openList()
    }
  }

  function handleListKeyDown(event) {
    const last = options.length - 1

    switch (event.key) {
      case 'ArrowDown':
        setActive((current) => Math.min(current + 1, last))
        break
      case 'ArrowUp':
        setActive((current) => Math.max(current - 1, 0))
        break
      case 'Home':
        setActive(0)
        break
      case 'End':
        setActive(last)
        break
      case 'Enter':
      case ' ':
        choose(active)
        break
      case 'Escape':
        closeList()
        break
      case 'Tab':
        setOpen(false)
        return
      default:
        return
    }
    event.preventDefault()
  }

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label ? `${label}: ${selected.label}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleButtonKeyDown}
        className={`flex min-h-9 cursor-pointer items-center gap-2 rounded-md border bg-surface px-3 text-sm text-ink hover:bg-hover ${open ? 'border-primary ring-3 ring-focus' : 'border-line'}`}
      >
        <span className="whitespace-nowrap">{prefix ? `${prefix}: ${selected.label}` : selected.label}</span>
        <ChevronDown size={16} className="shrink-0 text-ink-soft" />
      </button>

      {open && (
        <Menu
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${listId}-${active}`}
          align={align}
          className="outline-none"
          onKeyDown={handleListKeyDown}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              selected={option.value === value}
              active={index === active}
              onClick={() => choose(index)}
              onMouseEnter={() => setActive(index)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  )
}
