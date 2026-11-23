import PageHeader from '../components/PageHeader'
import { useI18n } from '../lib/i18n'

// Temporary page until the real screen is built
export default function PlaceholderPage({ titleKey, task }) {
  const { t } = useI18n()

  return (
    <>
      <PageHeader title={t(titleKey)} />
      <div className="rounded-xl border border-dashed border-line-strong bg-surface p-8 text-sm text-muted">
        {t('placeholder.body', { task: task ?? t('placeholder.later') })}
      </div>
    </>
  )
}
