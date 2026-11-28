// Keeps the login after a page reload, only while developing, so you do not log in again after every F5.
// In a production build import.meta.env.DEV is false and this code is not built, so the token is never stored.
// Turn it off with VITE_DEV_KEEP_SESSION=false in .env.local when you want to test the login screens.
// It uses sessionStorage, so it is gone when the tab is closed.
const KEY = 'julnow-dev-session'

export function loadDevSession() {
  if (!import.meta.env.DEV || import.meta.env.VITE_DEV_KEEP_SESSION === 'false') return null

  try {
    return JSON.parse(sessionStorage.getItem(KEY))
  } catch {
    return null
  }
}

export function saveDevSession(session) {
  if (!import.meta.env.DEV || import.meta.env.VITE_DEV_KEEP_SESSION === 'false') return

  try {
    sessionStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    // storage can be blocked, then we just log in again after a reload
  }
}

export function clearDevSession() {
  if (!import.meta.env.DEV) return

  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
