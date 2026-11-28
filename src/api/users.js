import { apiClient, USE_MOCK } from './client'
import { getUsersMock, getUserStatsMock, setUserStatusMock } from './mock/users'

// filters: { page, size, q, role, status, trust, plan, billing }. Empty ones are not sent.
export async function getUsers(filters) {
  if (USE_MOCK) return getUsersMock(filters)

  const query = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) query.set(key, value)
  })
  return apiClient.get(`/api/admin/users?${query}`)
}

export async function getUserStats() {
  if (USE_MOCK) return getUserStatsMock()
  return apiClient.get('/api/admin/users/stats')
}

// status is ACTIVE or SUSPENDED. reason is required for SUSPENDED.
export async function setUserStatus(id, { status, reason }) {
  if (USE_MOCK) return setUserStatusMock(id, { status, reason })
  return apiClient.patch(`/api/admin/users/${id}/status`, { status, reason })
}
