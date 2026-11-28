import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, CircleAlert, Clock, Mail } from 'lucide-react'
import Button from '../../components/Button'
import CodeInput from '../../components/CodeInput'
import Notice from '../../components/Notice'
import AuthLayout from '../../components/layout/AuthLayout'
import { useAuth } from '../../lib/auth'
import { errorText } from '../../lib/errorText'
import { useI18n } from '../../lib/i18n'
import { formatClock, useCountdown } from '../../lib/useCountdown'

const CODE_LENGTH = 6

// admin@julnow.com -> a••••@julnow.com
function maskEmail(email = '') {
  const [name, domain] = email.split('@')
  if (!domain) return email
  return `${name[0]}••••@${domain}`
}

export default function MfaPage() {
  const { t } = useI18n()
  const { isLoggedIn, pendingMfa, verify, resend, cancelLogin } = useAuth()
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState(null)
  const expiresIn = useCountdown(pendingMfa?.expiresAt ?? 0)
  const resendIn = useCountdown(pendingMfa?.resendAt ?? 0)

  // After the code: go to the page the admin wanted. Without a password step: back to the login.
  if (isLoggedIn) return <Navigate to={pendingMfa?.from ?? '/'} replace />
  if (!pendingMfa?.mfaToken) return <Navigate to="/login" replace />

  function focusCode() {
    formRef.current?.querySelector('input[inputmode=numeric]')?.focus()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (code.length < CODE_LENGTH) return
    setLoading(true)
    setError(null)

    try {
      await verify(code)
    } catch (problem) {
      setError(problem)
      setCode('')
      setLoading(false)
      focusCode()
    }
  }

  async function handleResend() {
    setResending(true)
    setError(null)
    try {
      await resend()
      setCode('')
      focusCode()
    } catch (problem) {
      setError(problem)
    } finally {
      setResending(false)
    }
  }

  function handleBack() {
    cancelLogin()
    navigate('/login')
  }

  const wrongCode = error?.code === 'MFA_INVALID' || error?.code === 'MFA_LOCKED'

  return (
    <AuthLayout cardClassName="w-120 p-8">
      <Button variant="link" size="sm" icon={ArrowLeft} onClick={handleBack} className="-ml-3">
        {t('mfa.back')}
      </Button>
      <h1 className="mt-2 text-metric font-bold text-ink">{t('mfa.title')}</h1>
      <p className="mt-2 text-sm text-ink-soft">{t('mfa.subtitle')}</p>

      <div className="mt-6 flex items-center gap-3 rounded-md bg-subtle p-3">
        <div className="grid size-8.5 shrink-0 place-items-center text-ink-soft">
          <Mail size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink-soft">{t('mfa.method')}</p>
          <p className="text-xs font-medium tracking-[0.01em] text-ink-soft">
            {t('mfa.sentTo', { email: maskEmail(pendingMfa.email) })}
          </p>
        </div>
        <p className="shrink-0 rounded-full bg-canvas px-2.5 py-1 text-xs font-medium tracking-[0.01em] text-ink-soft">
          {expiresIn > 0 ? t('mfa.expiresIn', { time: formatClock(expiresIn) }) : t('mfa.expired')}
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-ink">{t('mfa.code')}</p>
          <p className="text-xs font-medium tracking-[0.01em] text-muted">{t('mfa.digits')}</p>
        </div>

        <CodeInput
          value={code}
          onChange={setCode}
          invalid={wrongCode}
          readOnly={loading}
          length={CODE_LENGTH}
          label={t('mfa.code')}
          autoFocus
        />

        <div className="flex min-h-8 items-center justify-between gap-3">
          <p className="text-xs font-medium tracking-[0.01em] text-muted">
            {resendIn > 0 && t('mfa.resendIn', { time: formatClock(resendIn) })}
          </p>
          <Button
            variant="link"
            size="sm"
            icon={Clock}
            disabled={resendIn > 0}
            loading={resending}
            onClick={handleResend}
            className="-mr-3"
          >
            {t('mfa.resend')}
          </Button>
        </div>

        {error && (
          <div className="mb-2">
            <Notice tone="danger" icon={CircleAlert}>
              {errorText(error, t)}
            </Notice>
          </div>
        )}

        <Button type="submit" loading={loading} disabled={code.length < CODE_LENGTH} className="w-full">
          {t('mfa.verify')}
        </Button>
      </form>

      <p className="mt-6 border-t border-line pt-6 text-center text-xs font-medium tracking-[0.01em] text-muted">
        {t('login.support')}
      </p>
    </AuthLayout>
  )
}
