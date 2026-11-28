const baseUrl = import.meta.env.VITE_API_URL

// true = api files return mock data. Set VITE_USE_MOCK=false to call the Gateway.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// Kept in memory only, never in localStorage
let accessToken = null

export function setAccessToken(token) {
  accessToken = token
}

// The auth state (src/lib/auth.jsx) sets this. It is called when a logged in request gets 401,
// so the session ends and the router sends the admin to /login, without reloading the page.
let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

// An error from the API, or from the network. The page chooses the message from `code`
// (like MFA_INVALID), and `detail` is only a fallback text from the server.
export class ApiError extends Error {
  constructor({ status = 0, code = 'UNKNOWN', detail, attemptsLeft, retryAfter }) {
    super(detail ?? code)
    this.status = status
    this.code = code
    this.detail = detail
    this.attemptsLeft = attemptsLeft
    this.retryAfter = retryAfter
  }
}

async function request(path, options = {}) {
  const hadToken = Boolean(accessToken)
  let response

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError({ code: 'NETWORK' })
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}))
    const error = new ApiError({
      status: response.status,
      code: problem.code,
      detail: problem.detail,
      attemptsLeft: problem.attemptsLeft,
      retryAfter: Number(response.headers.get('Retry-After')) || undefined,
    })

    // 401 means the session ended only when the request carried a token.
    // Login and MFA also answer 401 for a wrong password or code, and that is not the end of a session.
    if (response.status === 401 && hadToken) {
      setAccessToken(null)
      unauthorizedHandler?.()
    }
    throw error
  }

  return response.status === 204 ? null : response.json()
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
}
