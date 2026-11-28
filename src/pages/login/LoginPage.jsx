import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'
import Button from '../../components/Button'
import FormField from '../../components/FormField'
import PasswordField from '../../components/PasswordField'
import Notice from '../../components/Notice'
import AuthLayout from '../../components/layout/AuthLayout'
import { useAuth } from '../../lib/auth'
import { errorText } from '../../lib/errorText'
import { useI18n } from '../../lib/i18n'

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

  // A wrong email or password is shown on both fields, the server does not say which one
  const wrongLogin = error?.code === 'LOGIN_INVALID'

  return (
    <AuthLayout cardClassName="w-126 p-9">
      <h1 className="text-2xl font-semibold text-ink">{t('login.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('login.subtitle')}</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <FormField
          label={t('login.email')}
          type="email"
          required
          autoComplete="username"
          value={email}
          invalid={wrongLogin}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@julnow.com"
        />
        <PasswordField
          label={t('login.password')}
          required
          autoComplete="current-password"
          value={password}
          invalid={wrongLogin}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && (
          <Notice tone="danger" icon={CircleAlert}>
            {errorText(error, t)}
          </Notice>
        )}

        <Button type="submit" loading={loading} className="mt-2 w-full">
          {t('login.submit')}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs font-medium tracking-[0.01em] text-muted">{t('login.support')}</p>
    </AuthLayout>
  )
}
