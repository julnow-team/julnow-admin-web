import { useState } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import Card from '../../components/Card'
import CardHeader from '../../components/CardHeader'
import CardStatus from '../../components/CardStatus'
import { formatChange, formatMoney, formatMonth, formatMonthShort } from '../../lib/format'
import { useI18n } from '../../lib/i18n'

// Chart size in pixels from Figma. The SVG scales to the width of the card.
const WIDTH = 674
const HEIGHT = 206
const PLOT = { left: 48, width: 626, top: 5.5, bottom: 172 }
const SIDE_PADDING = 11

// The smallest clean step that gives about 4 grid lines, for example 10,674 -> 12,000
function niceStep(raw) {
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const factor = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((value) => value * magnitude >= raw)
  return factor * magnitude
}

function axisLabel(value) {
  return value === 0 ? '$0' : `$${value / 1000}K`
}

// Month labels under the chart: every 3rd month, and always the last one
function labelIndexes(count) {
  const indexes = []
  for (let i = 0; i < count; i += 3) indexes.push(i)

  const last = count - 1
  if (last - indexes.at(-1) >= 2) indexes.push(last)
  else indexes[indexes.length - 1] = last
  return indexes
}

export default function RevenueChart({ auth, series }) {
  const { t } = useI18n()
  const [active, setActive] = useState(null)

  if (!auth.data || !series.data) return <CardStatus title={t('overview.monthlyRevenue')} sources={[auth, series]} />

  const { value, change } = auth.data.monthlyRevenue
  const points = series.data.series
  const step = niceStep(Math.max(...points.map((point) => point.value), 1) / 4)
  const yMax = step * 4
  const ticks = [0, 1, 2, 3, 4].map((index) => index * step)

  const spacing = (PLOT.width - 2 * SIDE_PADDING) / (points.length - 1)
  const toY = (amount) => PLOT.bottom - (amount / yMax) * (PLOT.bottom - PLOT.top)
  const coords = points.map((point, index) => ({ x: PLOT.left + SIDE_PADDING + index * spacing, y: toY(point.value) }))

  const line = coords.map((c, index) => `${index === 0 ? 'M' : 'L'}${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')
  const area = `${line} L${coords.at(-1).x.toFixed(1)} ${PLOT.bottom} L${coords[0].x.toFixed(1)} ${PLOT.bottom} Z`

  // The dot sits on the hovered month, or on the last month
  const dot = coords[active ?? points.length - 1]
  const tooltipLeft = active === null ? 0 : Math.min(Math.max((coords[active].x / WIDTH) * 100, 10), 90)

  const badge = change != null && (
    <>
      {change > 0 && <TrendingUp size={12} />}
      {change < 0 && <TrendingDown size={12} />}
      {t('overview.changeVsLastMonth', { change: formatChange(change) })}
    </>
  )

  return (
    <Card className="flex flex-col gap-4 p-5">
      <CardHeader
        title={t('overview.monthlyRevenue')}
        subtitle={t('overview.last12Months')}
        badge={badge}
        badgeTone={change > 0 ? 'success' : change < 0 ? 'danger' : 'neutral'}
      />
      <p className="text-metric font-bold text-ink">{formatMoney(value)}</p>

      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="group"
          aria-label={`${t('overview.monthlyRevenue')}, ${t('overview.last12Months')}`}
          className="block w-full"
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: 'var(--color-data-series-1)', stopOpacity: 0.28 }} />
              <stop offset="100%" style={{ stopColor: 'var(--color-data-series-1)', stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {ticks.map((tick, index) => {
            const y = toY(tick)
            const isTop = index === ticks.length - 1
            return (
              <g key={tick}>
                {!isTop && (
                  <line
                    x1={PLOT.left}
                    x2={PLOT.left + PLOT.width}
                    y1={y}
                    y2={y}
                    strokeDasharray={index === 0 ? undefined : '4 4'}
                    className="stroke-grid"
                  />
                )}
                <text x={PLOT.left - 6} y={y} dy="0.32em" textAnchor="end" className="fill-muted text-xs font-medium">
                  {axisLabel(tick)}
                </text>
              </g>
            )
          })}

          <path d={area} fill="url(#revenue-fill)" />
          <path d={line} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-series-1" />
          <circle cx={dot.x} cy={dot.y} r="4" strokeWidth="2" className="fill-series-1 stroke-surface" />

          {labelIndexes(points.length).map((index) => {
            const isFirst = index === 0
            const isLast = index === points.length - 1
            return (
              <text
                key={index}
                x={isFirst ? PLOT.left : isLast ? WIDTH : coords[index].x}
                y={194}
                textAnchor={isFirst ? 'start' : isLast ? 'end' : 'middle'}
                className="fill-muted text-xs font-medium"
              >
                {formatMonthShort(points[index].month, t)}
              </text>
            )
          })}

          {points.map((point, index) => (
            <rect
              key={point.month}
              x={coords[index].x - spacing / 2}
              y={0}
              width={spacing}
              height={PLOT.bottom}
              fill="transparent"
              tabIndex={0}
              role="img"
              aria-label={`${formatMonth(point.month, t)}: ${formatMoney(point.value)}`}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
            />
          ))}
        </svg>

        {active !== null && (
          <div
            className="pointer-events-none absolute -mt-2 -translate-x-1/2 -translate-y-full rounded-md border border-line bg-surface px-3 py-2 shadow-card"
            style={{ left: `${tooltipLeft}%`, top: `${(coords[active].y / HEIGHT) * 100}%` }}
          >
            <p className="text-caption whitespace-nowrap text-muted">{formatMonth(points[active].month, t)}</p>
            <p className="text-sm font-semibold text-ink">{formatMoney(points[active].value)}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
