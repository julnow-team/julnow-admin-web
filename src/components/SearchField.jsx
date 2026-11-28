import { Search, X } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import IconButton from './IconButton'
import Input from './Input'

// Controlled search box. The clear button shows when there is text.
// For a table, pass the value through useDebounce before calling the API.
export default function SearchField({ value, onChange, placeholder, label, className = '' }) {
  const { t } = useI18n()

  return (
    <Input
      icon={Search}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={label ?? placeholder}
      className={`w-70 ${className}`}
      trailing={
        value && (
          <IconButton icon={X} size="sm" iconSize={16} label={t('search.clear')} className="-mr-1" onClick={() => onChange('')} />
        )
      }
    />
  )
}
