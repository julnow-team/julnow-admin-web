import { useState } from 'react'
import { CircleAlert } from 'lucide-react'
import { setUserStatus } from '../../api/users'
import ConfirmDialog from '../../components/ConfirmDialog'
import Notice from '../../components/Notice'
import Textarea from '../../components/Textarea'
import { errorText } from '../../lib/errorText'
import { useI18n } from '../../lib/i18n'

// Asks before a user is suspended (with a reason) or reactivated.
// change = { user, status } where status is the new status, or null when the dialog is closed.
export default function StatusDialog({ change, onClose, onDone }) {
  const { t } = useI18n()
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const open = change !== null
  const suspending = change?.status === 'SUSPENDED'

  // The next time the dialog opens it starts clean
  function clear() {
    setReason('')
    setError(null)
  }

  function handleClose() {
    clear()
    onClose()
  }

  async function handleConfirm() {
    // The server also checks this (REASON_REQUIRED), we save the call
    if (suspending && !reason.trim()) {
      setError({ code: 'REASON_REQUIRED' })
      return
    }

    setLoading(true)
    setError(null)
    try {
      const updated = await setUserStatus(change.user.id, {
        status: change.status,
        reason: suspending ? reason.trim() : undefined,
      })
      clear()
      onDone(updated)
    } catch (problem) {
      setError(problem)
    } finally {
      setLoading(false)
    }
  }

  const name = change?.user.fullName
  const reasonMissing = error?.code === 'REASON_REQUIRED'

  return (
    <ConfirmDialog
      open={open}
      onClose={handleClose}
      tone={suspending ? 'danger' : 'primary'}
      title={t(suspending ? 'users.suspendTitle' : 'users.reactivateTitle', { name })}
      confirmLabel={t(suspending ? 'users.suspend' : 'users.reactivate')}
      onConfirm={handleConfirm}
      loading={loading}
      message={
        <div className="flex flex-col gap-3">
          <p>{t(suspending ? 'users.suspendMessage' : 'users.reactivateMessage')}</p>

          {suspending && (
            <label className="flex flex-col gap-1.5 text-xs font-medium tracking-[0.01em] text-ink-soft">
              {t('users.reasonLabel')}
              <Textarea
                autoFocus
                maxLength={500}
                value={reason}
                invalid={reasonMissing}
                onChange={(event) => setReason(event.target.value)}
                placeholder={t('users.reasonPlaceholder')}
              />
            </label>
          )}

          {error && (
            <Notice tone="danger" icon={CircleAlert}>
              {errorText(error, t)}
            </Notice>
          )}
        </div>
      }
    />
  )
}
