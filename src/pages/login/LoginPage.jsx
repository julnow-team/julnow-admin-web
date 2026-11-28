import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { LanguageToggle, ThemeToggle } from '../../components/PreferenceToggles'
import { useAuth } from '../../lib/auth'
import { errorText } from '../../lib/errorText'
import { useI18n } from '../../lib/i18n'

// Simple version. T21 part B replaces it with the Figma screen.
export default function LoginPage() {
  const { t } = useI18n()
  const { isLoggedIn, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // The page the admin wanted before the login (see RequireAuth)
  const from = location.state?.from ?? '/'

  if (isLoggedIn) return <Navigate to={from} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login({ email, password, from })
      navigate('/login/verify')
    } catch (problem) {
      setError(problem)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center p-6">
      <div className="absolute top-6 right-6 flex gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-8">
        <h1 className="text-2xl font-semibold">{t('login.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('login.subtitle')}</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            {t('login.email')}
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@julnow.com"
              className="h-10 rounded-md border border-line bg-surface px-3 focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            {t('login.password')}
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 rounded-md border border-line bg-surface px-3 focus:border-primary focus:outline-none"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-danger">
              {errorText(error, t)}
            </p>
          )}

          <Button type="submit" loading={loading} className="mt-2">
            {t('login.submit')}
          </Button>
        </form>
      </div>
    </main>
  )
}
