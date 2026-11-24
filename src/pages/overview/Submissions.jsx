import Button from '../../components/Button'
import Card from '../../components/Card'
import CardHeader from '../../components/CardHeader'
import CardStatus from '../../components/CardStatus'
import StatTile from '../../components/StatTile'
import { useI18n } from '../../lib/i18n'

const FLAG_TONES = {
  DUPLICATE_PHOTOS: { dot: 'bg-warning', result: 'text-warning' },
  PRICE_TOO_HIGH: { dot: 'bg-warning', result: 'text-warning' },
  BANNED_PHONE: { dot: 'bg-danger', result: 'text-danger' },
}

function CheckRow({ label, result, tone }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-line bg-canvas px-3 py-2">
      <span className={`size-2 shrink-0 rounded-full ${tone.dot}`} />
      <span className="flex-1 text-sm text-ink">{label}</span>
      <span className={`text-sm font-semibold ${tone.result}`}>{result}</span>
    </div>
  )
}

export default function Submissions({ listings }) {
  const { t } = useI18n()

  if (!listings.data) return <CardStatus title={t('overview.submissions')} sources={[listings]} />

  const { submitted, autoPublished, flagged, flags } = listings.data.submissions

  return (
    <Card className="flex flex-col gap-4 p-5">
      <CardHeader title={t('overview.submissions')} />

      <div className="flex gap-3">
        <StatTile label={t('overview.submitted')} value={submitted} />
        <StatTile label={t('overview.autoPublished')} value={autoPublished} tone="success" />
        <StatTile label={t('overview.flaggedForReview')} value={flagged} tone="warning" />
      </div>

      {flags.map((flag) => (
        <CheckRow
          key={flag.type}
          label={t(`overview.flag.${flag.type}`)}
          result={t('overview.flaggedCount', { count: flag.count })}
          tone={FLAG_TONES[flag.type]}
        />
      ))}

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" to="/listings">
          {t('overview.reviewFlagged')}
        </Button>
        <Button variant="link" size="sm" to="/settings">
          {t('overview.publishingRules')}
        </Button>
      </div>
    </Card>
  )
}
