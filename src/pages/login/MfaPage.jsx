import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { LanguageToggle, ThemeToggle } from '../../components/PreferenceToggles'
import { useAuth } from '../../lib/auth'
import { errorText } from '../../lib/errorText'
import { useI18n } from '../../lib/i18n'

// Simple version. T21 part C replaces it with the Figma screen (6 boxes, countdown, resend timer).
export default function MfaPage() {
  const { t } = useI18n()
  const { isLoggedIn, pendingMfa, verify, resend, cancelLogin } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // After the code: go to the page the admin wanted. Without a password step: back to the login.
  if (isLoggedIn) return <Navigate to={pendingMfa?.from ?? '/'} replace />
  if (!pendingMfa?.mfaToken) return <Navigate to="/login" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await verify(code)
    } catch (problem) {
      setError(problem)
      setCode('')
      setLoading(false)
    }
  }

  async function handleResend() {
    setError(null)
    try {
      await resend()
    } catch (problem) {
      setError(problem)
    }
  }

  function handleBack() {
    cancelLogin()
    navigate('/login')
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center p-6">
      <div className="absolute top-6 right-6 flex gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-8">
        <button type="button" onClick={handleBack} className="text-sm font-semibold text-primary">
          {t('mfa.back')}
        </button>
        <h1 className="mt-4 text-2xl font-semibold">{t('mfa.title')}</h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            {t('mfa.code')}
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="h-10 rounded-md border border-line bg-surface px-3 focus:border-primary focus:outline-none"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-danger">
              {errorText(error, t)}
            </p>
          )}

          <Button type="submit" loading={loading}>
            {t('mfa.verify')}
          </Button>
          <Button type="button" variant="link" onClick={handleResend}>
            {t('mfa.resend')}
          </Button>
        </form>
      </div>
    </main>
  )
}
