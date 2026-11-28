import { useI18n } from '../../lib/i18n'
import Logo from '../Logo'
import { LanguageToggle, ThemeToggle } from '../PreferenceToggles'

// Page frame for Login and MFA: logo, a card in the middle, footer
export default function AuthLayout({ cardClassName = '', children }) {
  const { t } = useI18n()

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute top-6 right-6 flex gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-8">
        <Logo className="mb-6 h-24.5 w-44" />
        <div className={`max-w-full rounded-xl border border-line bg-surface shadow-auth ${cardClassName}`}>
          {children}
        </div>
      </main>

      <footer className="px-6 pb-5 text-center text-xs font-medium tracking-[0.01em] text-muted sm:px-[120px]">
        {t('auth.copyright')}
      </footer>
    </div>
  )
}
