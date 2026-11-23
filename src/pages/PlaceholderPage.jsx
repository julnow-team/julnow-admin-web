import PageHeader from '../components/PageHeader'

// Temporary page until the real screen is built
export default function PlaceholderPage({ title, task }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="rounded-xl border border-dashed border-line-strong bg-surface p-8 text-sm text-muted">
        This page is built in {task}.
      </div>
    </>
  )
}
