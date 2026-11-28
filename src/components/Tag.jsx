const TONES = {
  neutral: 'bg-subtle text-ink',
  rental: 'bg-rental-subtle text-rental',
  stay: 'bg-stay-subtle text-stay',
  travel: 'bg-travel-subtle text-travel',
}

// Small label with square corners. Use it for a plan ("Pro · $29") or a listing category.
// Badge is for status, Tag is for a kind of thing.
export default function Tag({ tone = 'neutral', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs leading-4 font-medium tracking-[0.01em] whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
