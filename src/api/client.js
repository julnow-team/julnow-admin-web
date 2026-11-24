const baseUrl = import.meta.env.VITE_API_URL

// true = api files return mock data. Set VITE_USE_MOCK=false to call the Gateway.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// Kept in memory only, never in localStorage
let accessToken = null

export function setAccessToken(token) {
  accessToken = token
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    setAccessToken(null)
    window.location.assign('/login')
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}))
    throw new Error(problem.detail ?? `Request failed (${response.status})`)
  }

  return response.status === 204 ? null : response.json()
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
}