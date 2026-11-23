import { LanguageToggle, ThemeToggle } from '../../components/PreferenceToggles'
import { useI18n } from '../../lib/i18n'

export default function LoginPage() {
  const { t } = useI18n()

  return (
    <main className="relative flex min-h-screen items-center justify-center p-6">
      <div className="absolute top-6 right-6 flex gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-8">
        <h1 className="text-2xl font-semibold">{t('login.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('login.subtitle')}</p>

        <form className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            {t('login.email')}
            <input
              type="email"
              placeholder="admin@julnow.com"
              className="h-10 rounded-md border border-line bg-surface px-3 focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            {t('login.password')}
            <input
              type="password"
              className="h-10 rounded-md border border-line bg-surface px-3 focus:border-primary focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="mt-2 h-10 rounded-md bg-primary font-medium text-on-primary hover:bg-primary-hover"
          >
            {t('login.submit')}
          </button>
        </form>
      </div>
    </main>
  )
}
