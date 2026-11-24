import { ArrowLeft, ArrowRight } from 'lucide-react'
import { formatNumber } from '../lib/format'
import { useI18n } from '../lib/i18n'
import IconButton from './IconButton'

const GAP = 'gap'

// Page numbers to show (0-based): the first, the last, and the current one with its neighbours.
// A missing stretch shows "…", unless only one page is missing, then that page is shown.
function pagesToShow(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index)

  const wanted = [0, page - 1, page, page + 1, totalPages - 1].filter((number) => number >= 0 && number < totalPages)
  const sorted = [...new Set(wanted)].sort((a, b) => a - b)

  const result = []
  sorted.forEach((number, index) => {
    const previous = sorted[index - 1]
    if (index > 0 && number - previous === 2) result.push(previous + 1)
    if (index > 0 && number - previous > 2) result.push(GAP)
    result.push(number)
  })
  return result
}

// Footer of a table. page starts at 0, like the API. `label` is the name of the rows, like "users".
export default function Pagination({ page, size, totalItems, totalPages, onPageChange, label }) {
  const { t } = useI18n()

  if (totalItems === 0) return null

  const from = page * size + 1
  const to = Math.min((page + 1) * size, totalItems)

  return (
    <nav aria-label={t('pagination.label')} className="flex min-h-14 flex-wrap items-center gap-1 border-t border-line px-4 py-3">
      <p className="min-w-0 flex-1 text-sm text-ink-soft">
        {t('pagination.summary', {
          from: formatNumber(from),
          to: formatNumber(to),
          total: formatNumber(totalItems),
          label,
        })}
      </p>

      <IconButton
        icon={ArrowLeft}
        label={t('pagination.previous')}
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      />

      {pagesToShow(page, totalPages).map((number, index) =>
        number === GAP ? (
          <span key={`gap-${index}`} className="flex size-8 items-center justify-center text-sm text-muted">
            …
          </span>
        ) : (
          <button
            key={number}
            type="button"
            aria-label={t('pagination.page', { page: number + 1 })}
            aria-current={number === page ? 'page' : undefined}
            onClick={() => onPageChange(number)}
            className={`flex size-8 min-w-8 cursor-pointer items-center justify-center rounded-md px-2 text-sm focus-visible:outline-2 focus-visible:outline-primary ${number === page ? 'bg-primary-subtle font-semibold text-primary' : 'text-ink-soft hover:bg-hover'}`}
          >
            {formatNumber(number + 1)}
          </button>
        )
      )}

      <IconButton
        icon={ArrowRight}
        label={t('pagination.next')}
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      />
    </nav>
  )
}
