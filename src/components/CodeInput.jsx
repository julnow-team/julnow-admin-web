import { useState } from 'react'

// Six boxes for the MFA code. One real input sits on top, so typing, paste and autofill just work.
export default function CodeInput({ value, onChange, invalid, readOnly, length = 6, label, ...inputProps }) {
  const [focused, setFocused] = useState(false)
  const active = Math.min(value.length, length - 1)

  return (
    <div className="relative flex gap-2.5">
      {Array.from({ length }, (_, index) => {
        let border = 'border-line-strong'
        if (invalid) border = 'border-danger'
        else if (focused && index === active) border = 'border-primary ring-3 ring-focus'

        return (
          <div
            key={index}
            className={`grid h-13 min-w-0 flex-1 place-items-center rounded-md border bg-surface text-xl font-semibold text-ink ${border}`}
          >
            {value[index]}
          </div>
        )
      })}
      <input
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        value={value}
        readOnly={readOnly}
        aria-label={label}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, ''))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="absolute inset-0 h-full w-full cursor-text opacity-0"
        {...inputProps}
      />
    </div>
  )
}
