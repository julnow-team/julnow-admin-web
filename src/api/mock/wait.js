// Small delay so mock calls feel like a real network call (the loading state shows)
export function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
