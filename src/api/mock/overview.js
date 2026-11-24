import { wait } from './wait'

// Same shape as GET /api/admin/overview (see docs/api-contract.md)
const overview = {
  monthlyRevenue: { value: 12480, change: 12.5 },
  paidSubscriptions: { value: 312, change: 8.2, onTrial: 48 },
  activeListings: { value: 1284, change: 5.1 },
  totalUsers: { value: 8923, change: 3.4 },
  attention: {
    lateOwners: 12,
    flaggedToday: 7,
    newToday: 26,
    openCases: 34,
    casesFromUsers: 21,
    casesFromSystem: 13,
  },
}

export async function getOverviewMock() {
  await wait()
  return overview
}
