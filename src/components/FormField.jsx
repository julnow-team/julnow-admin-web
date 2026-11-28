import { useId } from 'react'

// Label, input box and an error text. "trailing" is a button inside the box (for example show password).
export default function FormField({ label, error, invalid, trailing, id, className = '', ...inputProps }) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`
  const hasError = Boolean(error) || invalid

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-medium tracking-[0.01em] text-ink-soft">
        {label}
      </label>
      <div
        className={`flex min-h-[42px] items-center gap-1.5 rounded-md border bg-surface pr-2 pl-3 focus-within:ring-3 focus-within:ring-focus ${
          hasError ? 'border-danger' : 'border-line-strong focus-within:border-primary'
        }`}
      >
        <input
          id={inputId}
          aria-invalid={hasError || undefined}
          aria-describedby={error ? errorId : undefined}
          className={`min-w-0 flex-1 bg-transparent text-sm leading-5 text-ink outline-none placeholder:text-muted ${className}`}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className="text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
