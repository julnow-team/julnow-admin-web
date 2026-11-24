import { ChevronDown } from 'lucide-react'

// Dropdown for filters. options is a list of { value, label }.
export default function Select({ value, onChange, options, label, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="h-9 cursor-pointer appearance-none rounded-md border border-line bg-surface pr-9 pl-3 text-sm text-ink outline-none hover:bg-hover focus:border-primary focus:ring-2 focus:ring-focus"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft" />
    </div>
  )
}
