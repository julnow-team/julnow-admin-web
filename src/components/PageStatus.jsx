import { useI18n } from '../lib/i18n'
import Button from './Button'

// Shown while a page has no data yet: loading text, or the error with a retry button
export default function PageStatus({ error, onRetry }) {
  const { t } = useI18n()

  if (!error) return <p className="text-sm text-muted">{t('common.loading')}</p>

  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-sm text-danger">{t('common.error')}</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        {t('common.retry')}
      </Button>
    </div>
  )
}
