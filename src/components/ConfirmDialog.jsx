import { useI18n } from '../lib/i18n'
import Button from './Button'
import Dialog from './Dialog'

// Dialog that asks "are you sure?". tone="danger" is for things like suspend or delete.
// While loading is true the buttons wait and the dialog cannot be closed, so a half done request is not lost.
export default function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = 'primary',
  onConfirm,
  loading = false,
}) {
  const { t } = useI18n()

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title={title}
      actions={
        <>
          <Button variant="secondary" disabled={loading} onClick={onClose}>
            {cancelLabel ?? t('common.cancel')}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {message}
    </Dialog>
  )
}
