// The message for an ApiError, chosen from its `code` so it follows the language.
// Pass the t function from useI18n.
export function errorText(error, t) {
  switch (error.code) {
    case 'LOGIN_INVALID':
      return t('login.error.invalid')
    case 'MFA_INVALID':
      return t('mfa.error.invalid', { count: error.attemptsLeft })
    case 'MFA_LOCKED':
      return t('mfa.error.locked')
    case 'MFA_EXPIRED':
      return t('mfa.error.expired')
    case 'MFA_RESEND_TOO_SOON':
      return t('mfa.error.resendTooSoon', { seconds: error.retryAfter })
    case 'NETWORK':
      return t('error.network')
    default:
      return t('error.unknown')
  }
}
