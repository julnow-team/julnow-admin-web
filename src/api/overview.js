import { apiClient, USE_MOCK } from './client'
import { getOverviewMock } from './mock/overview'

export async function getOverview() {
  if (USE_MOCK) return getOverviewMock()
  return apiClient.get('/api/admin/overview')
}
