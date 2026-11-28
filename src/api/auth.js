import { apiClient, USE_MOCK } from './client'
import { loginMock, resendMfaMock, verifyMfaMock } from './mock/auth'

// Step 1: email and password. Sends a code by email.
// Returns { mfaToken, expiresIn, resendAfter } (seconds), see docs/api-contract.md
export async function login({ email, password }) {
  if (USE_MOCK) return loginMock({ email, password })
  return apiClient.post('/api/admin/auth/login', { email, password })
}

// Step 2: the 6 digit code. Returns { accessToken, admin }
export async function verifyMfa({ mfaToken, code }) {
  if (USE_MOCK) return verifyMfaMock({ mfaToken, code })
  return apiClient.post('/api/admin/auth/mfa', { mfaToken, code })
}

// New code and a new 5 minutes. Returns { expiresIn, resendAfter }
export async function resendMfa({ mfaToken }) {
  if (USE_MOCK) return resendMfaMock({ mfaToken })
  return apiClient.post('/api/admin/auth/mfa/resend', { mfaToken })
}
