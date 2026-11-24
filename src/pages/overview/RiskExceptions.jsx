import { Link } from 'react-router-dom'
import { Calendar, Car, House } from 'lucide-react'
import Badge from '../../components/Badge'
import Card from '../../components/Card'
import CardHeader from '../../components/CardHeader'
import CardStatus from '../../components/CardStatus'
import { useI18n } from '../../lib/i18n'

const CATEGORIES = {
  RENTAL: { icon: House, tile: 'bg-rental-subtle', color: 'text-rental' },
  STAY: { icon: Calendar, tile: 'bg-stay-subtle', color: 'text-stay' },
  TRAVEL: { icon: Car, tile: 'bg-travel-subtle', color: 'text-travel' },
}

const LEVEL_TONES = { HIGH: 'danger', MEDIUM: 'warning', REPORTED: 'warning' }

function RiskRow({ item }) {
  const { t } = useI18n()
  const { icon: Icon, tile, color } = CATEGORIES[item.categoryCode]
  // High risk listings get a red icon, the others keep the category colour
  const iconColor = item.level === 'HIGH' ? 'text-danger' : color

  // Reported listings have no flags, they show the report reason instead
  const reasons = item.level === 'REPORTED' ? [t('overview.reason.REPORTED')] : item.flags.map((flag) => t(`overview.reason.${flag.type}`, { percent: flag.percentAboveAverage }))

  return (
    <Link
      to="/reports"
      className="flex min-h-16 items-center gap-3 rounded-md p-3 hover:bg-hover focus-visible:outline-2 focus-visible:outline-primary"
    >
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-md ${tile} ${iconColor}`}>
        <Icon size={18} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-semibold text-ink">{item.title}</span>
        <span className="text-caption text-muted">{[...reasons, `#${item.code}`].join(' · ')}</span>
      </span>
      <Badge tone={LEVEL_TONES[item.level]}>{t(`overview.risk.${item.level}`)}</Badge>
    </Link>
  )
}

export default function RiskExceptions({ auth, listings }) {
  const { t } = useI18n()

  if (!listings.data) return <CardStatus title={t('overview.riskExceptions')} sources={[listings]} />

  // Open cases = reports from users (auth) + system checks (listings)
  const openCases = auth.data ? auth.data.casesFromUsers + listings.data.casesFromSystem : null

  return (
    <Card className="flex flex-col gap-4 p-5">
      <CardHeader
        title={t('overview.riskExceptions')}
        badge={openCases !== null && t('overview.openBadge', { count: openCases })}
        actionLabel={t('overview.viewAll')}
        actionTo="/reports"
      />

      {listings.data.riskExceptions.map((item) => (
        <RiskRow key={item.listingId} item={item} />
      ))}
    </Card>
  )
}
