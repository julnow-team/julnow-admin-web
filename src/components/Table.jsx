import { CircleAlert, Search } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import Button from './Button'
import TableState from './TableState'

const SKELETON_WIDTHS = ['w-3/5', 'w-1/2', 'w-4/5', 'w-2/3', 'w-3/4', 'w-1/2', 'w-2/3', 'w-1/3']
const SKELETON_FADE = ['opacity-100', 'opacity-90', 'opacity-80', 'opacity-70', 'opacity-60', 'opacity-50', 'opacity-40']
const ROW_TONES = { warning: 'bg-warning-subtle', danger: 'bg-danger-subtle' }

// Space kept for the one column that has no width (it takes what is left)
const FLEX_COLUMN_MIN = 240

function cellSpace(index, last) {
  return `${index === 0 ? 'pl-4' : ''} ${index === last ? 'pr-5' : 'pr-3'}`
}

// Header, rows and the loading / empty / error states. It has no card, search or pagination around it.
//
// columns: [{ key, header, render(row), width, align, hideHeader }]
//   render(row) gives the cell content, without it the cell shows row[key]
//   width is in px, a column without width takes the space that is left
//   align="right" puts the content on the right (use it for the actions column)
//   hideHeader keeps the header text for screen readers only
// rows: the rows of the current page. rowKey: the field (or a function) that is unique per row.
// loading: shows grey bars when there are no rows yet, and dims the rows while the next page loads.
// error: when set, shows the error state with a "Try again" button (onRetry).
// empty: { title, description, footnote, resetLabel, onReset } for "no results". onReset shows a reset button.
// rowTone(row): "warning" or "danger" colours the row, for flagged rows.
export default function Table({ columns, rows, rowKey = 'id', loading = false, error = null, onRetry, empty = {}, rowTone }) {
  const { t } = useI18n()

  const keyOf = typeof rowKey === 'function' ? rowKey : (row) => row[rowKey]
  const last = columns.length - 1
  const hasFlexColumn = columns.some((column) => !column.width)
  const minWidth = columns.reduce((sum, column) => sum + (column.width ?? 0), 0) + (hasFlexColumn ? FLEX_COLUMN_MIN : 0)

  function stateBody(state) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length}>{state}</td>
        </tr>
      </tbody>
    )
  }

  function renderBody() {
    if (loading && rows.length === 0) {
      return (
        <tbody>
          {SKELETON_FADE.map((fade, rowIndex) => (
            <tr key={fade} className={`h-15 border-b border-line last:border-b-0 ${fade}`}>
              {columns.map((column, index) => (
                <td key={column.key} className={`py-2 ${cellSpace(index, last)}`}>
                  <div className={`h-3 rounded-sm bg-subtle ${SKELETON_WIDTHS[index % SKELETON_WIDTHS.length]}`} />
                  {rowIndex === 0 && index === 0 && <span className="sr-only">{t('common.loading')}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      )
    }

    if (error) {
      return stateBody(
        <TableState
          icon={CircleAlert}
          tone="danger"
          title={t('table.errorTitle')}
          description={t('table.errorHint')}
          actions={
            onRetry && (
              <Button variant="secondary" onClick={onRetry}>
                {t('common.retry')}
              </Button>
            )
          }
        />
      )
    }

    if (rows.length === 0) {
      return stateBody(
        <TableState
          icon={Search}
          title={empty.title ?? t('table.empty')}
          description={empty.description ?? t('table.emptyHint')}
          footnote={empty.footnote}
          actions={
            empty.onReset && <Button onClick={empty.onReset}>{empty.resetLabel ?? t('table.reset')}</Button>
          }
        />
      )
    }

    return (
      <tbody className={loading ? 'opacity-60' : ''}>
        {rows.map((row) => {
          const tone = rowTone?.(row)
          return (
            <tr
              key={keyOf(row)}
              className={`h-15 border-b border-line last:border-b-0 ${tone ? ROW_TONES[tone] : 'bg-surface hover:bg-hover'}`}
            >
              {columns.map((column, index) => {
                const content = column.render ? column.render(row) : row[column.key]
                return (
                  <td key={column.key} className={`py-2 text-sm text-ink ${cellSpace(index, last)}`}>
                    {column.align === 'right' ? (
                      <div className="flex items-center justify-end gap-1">{content}</div>
                    ) : (
                      <div className="min-w-0 break-words">{content}</div>
                    )}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    )
  }

  return (
    <div className="relative overflow-x-auto">
      <table aria-busy={loading} className="w-full table-fixed border-collapse text-left" style={{ minWidth }}>
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} style={column.width ? { width: column.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-line bg-canvas">
            {columns.map((column, index) => (
              <th
                key={column.key}
                scope="col"
                className={`py-3 text-xs font-medium tracking-[0.01em] text-muted ${column.align === 'right' ? 'text-right' : 'text-left'} ${cellSpace(index, last)}`}
              >
                {column.hideHeader ? <span className="sr-only">{column.header}</span> : column.header}
              </th>
            ))}
          </tr>
        </thead>
        {renderBody()}
      </table>
    </div>
  )
}
