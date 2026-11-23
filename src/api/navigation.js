// Mock data until the admin APIs exist (T31, T37, T44). Keep the same shape as the real API.
export async function getNavCounts() {
  return { flaggedListings: 7, openCases: 34 }
}

export async function getCurrentAdmin() {
  return { fullName: 'Pon Somnang', roleName: 'Super admin' }
}
