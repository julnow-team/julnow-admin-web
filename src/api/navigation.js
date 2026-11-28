// Mock data until the admin APIs exist (T31, T37, T44). Keep the same shape as the real API.
// The logged in admin comes from the login (src/lib/auth.jsx), not from here.
export async function getNavCounts() {
  return { flaggedListings: 7, openCases: 34 }
}
