// Centered message for a table body: an icon, a title, a short text and buttons.
// tone="danger" is for errors, the default tone is for "no results".
export default function TableState({ icon: Icon, tone = 'primary', title, description, footnote, actions }) {
  const tile = tone === 'danger' ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'

  return (
    <div className="flex min-h-105 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <span className={`mb-2 flex size-12 items-center justify-center rounded-lg ${tile}`}>
        <Icon size={24} />
      </span>
      <p className="text-base font-semibold text-ink">{title}</p>
      {description && <p className="max-w-md text-sm text-ink-soft">{description}</p>}
      {actions && <div className="mt-2 flex flex-wrap justify-center gap-2">{actions}</div>}
      {footnote && <p className="text-caption text-muted">{footnote}</p>}
    </div>
  )
}
