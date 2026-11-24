import { createContext, useContext, useEffect, useState } from 'react'
import en from '../locales/en'
import km from '../locales/km'

const STORAGE_KEY = 'julnow-lang'
const DICTIONARIES = { en, km }
const I18nContext = createContext(null)

function readSavedLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved in DICTIONARIES) return saved
  } catch {
    // ignore
  }
  return 'en'
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(readSavedLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
  }, [lang])

  // t('nav.users') or t('placeholder.body', { task: 'T37' })
  const t = (key, params = {}) => {
    const text = DICTIONARIES[lang][key] ?? en[key] ?? key
    return text.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '')
  }

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

// The hook lives next to its provider on purpose
// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  return useContext(I18nContext)
}
