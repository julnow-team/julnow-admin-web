import { ApiError } from '../client'
import { wait } from './wait'

// Test accounts, the same password for all of them (see docs/TEAM-GUIDE.md):
//   admin@julnow.com    works, the code is 123456
//   expired@julnow.com  logs in, but the code is always expired
//   network@julnow.com  the login call fails like a lost connection
// Any other email gives "wrong email or password".
const PASSWORD = 'Admin@123'
const CODE = '123456'
const EXPIRED_EMAIL = 'expired@julnow.com'
const NETWORK_EMAIL = 'network@julnow.com'
const EMAILS = ['admin@julnow.com', EXPIRED_EMAIL, NETWORK_EMAIL]

const EXPIRES_IN = 300
const RESEND_AFTER = 60
const MAX_TRIES = 5

const ADMIN = { fullName: 'Pon Somnang', roleName: 'Super admin' }

// What the server would remember for each mfaToken
const sessions = new Map()

function newWindow() {
  return { expiresAt: Date.now() + EXPIRES_IN * 1000, resendAt: Date.now() + RESEND_AFTER * 1000 }
}

function findSession(mfaToken) {
  const session = sessions.get(mfaToken)
  if (!session || session.email === EXPIRED_EMAIL || Date.now() > session.expiresAt) {
    throw new ApiError({ status: 401, code: 'MFA_EXPIRED', detail: 'The code has expired.' })
  }
  return session
}

export async function loginMock({ email, password }) {
  await wait()
  const name = email.trim().toLowerCase()

  if (name === NETWORK_EMAIL) throw new ApiError({ code: 'NETWORK' })
  if (!EMAILS.includes(name) || password !== PASSWORD) {
    throw new ApiError({ status: 401, code: 'LOGIN_INVALID', detail: 'Wrong email or password.' })
  }

  const mfaToken = `mock-${Date.now()}-${Math.random().toString(36).slice(2)}`
  sessions.set(mfaToken, { email: name, tries: 0, locked: false, ...newWindow() })
  return { mfaToken, expiresIn: EXPIRES_IN, resendAfter: RESEND_AFTER }
}

export async function verifyMfaMock({ mfaToken, code }) {
  await wait()
  const session = findSession(mfaToken)

  if (session.locked) throw new ApiError({ status: 401, code: 'MFA_LOCKED', detail: 'Too many wrong codes.' })

  if (code !== CODE) {
    session.tries += 1
    if (session.tries >= MAX_TRIES) {
      session.locked = true
      throw new ApiError({ status: 401, code: 'MFA_LOCKED', detail: 'Too many wrong codes.' })
    }
    throw new ApiError({ status: 401, code: 'MFA_INVALID', detail: 'Wrong code.', attemptsLeft: MAX_TRIES - session.tries })
  }

  sessions.delete(mfaToken)
  return { accessToken: 'mock-access-token', admin: ADMIN }
}

export async function resendMfaMock({ mfaToken }) {
  await wait()
  const session = findSession(mfaToken)

  if (Date.now() < session.resendAt) {
    throw new ApiError({
      status: 429,
      code: 'MFA_RESEND_TOO_SOON',
      detail: 'Please wait before asking for a new code.',
      retryAfter: Math.ceil((session.resendAt - Date.now()) / 1000),
    })
  }

  // A new code, a new 5 minutes, and the wrong tries start from zero again
  Object.assign(session, { tries: 0, locked: false, ...newWindow() })
  return { expiresIn: EXPIRES_IN, resendAfter: RESEND_AFTER }
}
