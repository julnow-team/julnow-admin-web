import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Moon, Sun } from 'lucide-react'
import gbFlag from '../assets/flags/gb.svg'
import khFlag from '../assets/flags/kh.svg'
import { useI18n } from '../lib/i18n'
import { useTheme } from '../lib/theme'

const LANGUAGES = [
  { code: 'km', label: 'ខ្មែរ', flag: khFlag },
  { code: 'en', label: 'English', flag: gbFlag },
]

function FlagIcon({ src }) {
  return (
    <img
      src={src}
      alt=""
      className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgb(0_0_0/0.1)]"
    />
  )
}

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const current = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0]

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('topbar.language')}
        className="flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm text-ink-soft hover:bg-hover"
      >
        <FlagIcon src={current.flag} />
        <span>{current.label}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-1 w-40 rounded-md border border-line bg-surface p-1 shadow-lg"
        >
          {LANGUAGES.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                role="option"
                aria-selected={item.code === lang}
                onClick={() => {
                  setLang(item.code)
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm text-ink hover:bg-hover"
              >
                <FlagIcon src={item.flag} />
                <span className="flex-1">{item.label}</span>
                {item.code === lang && <Check size={16} className="text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t('topbar.lightMode') : t('topbar.darkMode')}
      title={isDark ? t('topbar.lightMode') : t('topbar.darkMode')}
      className="flex size-9 items-center justify-center rounded-md border border-line bg-surface text-ink-soft hover:bg-hover"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
