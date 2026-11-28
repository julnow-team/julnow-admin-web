import { useEffect, useState } from 'react'

// Seconds left until `endsAt` (a timestamp in ms). It counts down once a second and stops at 0.
export function useCountdown(endsAt) {
  const [seconds, setSeconds] = useState(() => Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)))

  useEffect(() => {
    const update = () => setSeconds(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)))
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [endsAt])

  return seconds
}

// 65 -> "01:05"
export function formatClock(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}
