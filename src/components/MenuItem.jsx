import { Check } from 'lucide-react'

// One row in a Menu. `selected` shows a check mark, `active` is the row the keyboard is on.
// Use as="button" for a row that does an action.
export default function MenuItem({ as: Tag = 'div', selected = false, active = false, children, ...rest }) {
  return (
    <Tag
      className={`flex min-h-8.5 w-full cursor-pointer items-center gap-2 rounded-sm px-2.5 py-1.5 text-left text-sm text-ink ${selected ? 'font-semibold' : ''} ${active ? 'bg-hover' : 'hover:bg-hover'}`}
      {...rest}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {selected && <Check size={16} className="shrink-0 text-primary" />}
    </Tag>
  )
}
