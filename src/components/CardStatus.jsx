import Card from './Card'
import CardHeader from './CardHeader'
import PageStatus from './PageStatus'

// Shown instead of a section while its data loads, or when one of its services failed.
// The title stays visible so the admin knows which section it is.
// sources are the results of useApi. Retry loads again only the ones that failed.
export default function CardStatus({ title, sources, className = '' }) {
  const failed = sources.filter((source) => source.error && !source.loading)

  return (
    <Card className={`flex flex-col gap-4 p-5 ${className}`}>
      <CardHeader title={title} />
      <PageStatus
        error={failed[0]?.error}
        onRetry={() => failed.forEach((source) => source.reload())}
      />
    </Card>
  )
}
