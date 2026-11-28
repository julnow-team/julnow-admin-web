import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginRequest, resendMfa, verifyMfa } from '../api/auth'
import { setAccessToken, setUnauthorizedHandler } from '../api/client'
import { clearDevSession, loadDevSession, saveDevSession } from './devSession'

// Who is logged in, and the MFA step between the password and the code.
// Everything is in memory. After a reload the admin logs in again (the refresh API is P2).
const AuthContext = createContext(null)

// Used when the server does not tell the times (seconds)
const DEFAULT_EXPIRES_IN = 300
const DEFAULT_RESEND_AFTER = 60

function restoreSession() {
  const saved = loadDevSession()
  // The api client needs the token before any page asks for data, so it is set here and not in an effect
  if (saved) setAccessToken(saved.accessToken)
  return saved
}

// When the code ends and when a new one can be asked (timestamps in ms)
function codeTimes(result) {
  return {
    expiresAt: Date.now() + (result.expiresIn ?? DEFAULT_EXPIRES_IN) * 1000,
    resendAt: Date.now() + (result.resendAfter ?? DEFAULT_RESEND_AFTER) * 1000,
  }
}

export function AuthProvider({ children }) {
  // { accessToken, admin } when logged in, otherwise null
  const [session, setSession] = useState(restoreSession)
  // After the password is accepted: { mfaToken, email, from, expiresAt, resendAt }
  const [pendingMfa, setPendingMfa] = useState(null)

  // A 401 on a logged in request ends the session. The guard in App.jsx then sends the admin to /login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearDevSession()
      setSession(null)
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  // `from` is the page the admin wanted before the login, we go back there after the code
  const login = useCallback(async ({ email, password, from }) => {
    const result = await loginRequest({ email, password })
    setPendingMfa({ mfaToken: result.mfaToken, email, from, ...codeTimes(result) })
  }, [])

  const verify = useCallback(
    async (code) => {
      const { accessToken, admin } = await verifyMfa({ mfaToken: pendingMfa.mfaToken, code })
      setAccessToken(accessToken)
      saveDevSession({ accessToken, admin })
      setSession({ accessToken, admin })
      // The code is used up. Only `from` stays, so the MFA page knows where to go.
      setPendingMfa({ from: pendingMfa.from })
    },
    [pendingMfa],
  )

  const resend = useCallback(async () => {
    try {
      const result = await resendMfa({ mfaToken: pendingMfa.mfaToken })
      setPendingMfa({ ...pendingMfa, ...codeTimes(result) })
    } catch (error) {
      // Asked too soon: keep our countdown in step with the server
      if (error.code === 'MFA_RESEND_TOO_SOON' && error.retryAfter) {
        setPendingMfa({ ...pendingMfa, resendAt: Date.now() + error.retryAfter * 1000 })
      }
      throw error
    }
  }, [pendingMfa])

  const cancelLogin = useCallback(() => setPendingMfa(null), [])

  // No API call yet, the logout API is P2
  const logout = useCallback(() => {
    setAccessToken(null)
    clearDevSession()
    setSession(null)
    setPendingMfa(null)
  }, [])

  const value = useMemo(
    () => ({
      isLoggedIn: session !== null,
      admin: session?.admin ?? null,
      pendingMfa,
      login,
      verify,
      resend,
      cancelLogin,
      logout,
    }),
    [session, pendingMfa, login, verify, resend, cancelLogin, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// The hook lives next to its provider on purpose
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
