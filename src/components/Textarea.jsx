// Multi-line text field, same look as Input. invalid = true shows the red border (and aria-invalid).
export default function Textarea({ invalid = false, className = '', ...rest }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={`min-h-24 w-full resize-y rounded-md border bg-surface px-3 py-2 text-sm leading-5 text-ink outline-none placeholder:text-muted focus:ring-3 focus:ring-focus ${
        invalid ? 'border-danger' : 'border-line-strong focus:border-primary'
      } ${className}`}
      {...rest}
    />
  )
}
