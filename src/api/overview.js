import { apiClient, USE_MOCK } from './client'
import {
  getAuthStatsMock,
  getBookingStatsMock,
  getListingStatsMock,
  getRecentActivityMock,
  getRevenueSeriesMock,
} from './mock/overview'

export async function getAuthStats({ range }) {
  if (USE_MOCK) return getAuthStatsMock(range)
  return apiClient.get(`/api/admin/auth/stats?range=${range}`)
}

export async function getListingStats({ range }) {
  if (USE_MOCK) return getListingStatsMock(range)
  return apiClient.get(`/api/admin/listings/stats?range=${range}`)
}

export async function getBookingStats({ range }) {
  if (USE_MOCK) return getBookingStatsMock(range)
  return apiClient.get(`/api/admin/bookings/stats?range=${range}`)
}

// No real endpoint for these two yet (mock only, see docs/api-contract.md)
export async function getRevenueSeries() {
  return getRevenueSeriesMock()
}

export async function getRecentActivity() {
  return getRecentActivityMock()
}
