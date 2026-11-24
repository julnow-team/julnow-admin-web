import { useEffect } from 'react'

// Calls onOutside when the user presses outside the element in ref. Only runs while enabled.
export function useClickOutside(ref, onOutside, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    function handlePress(event) {
      if (ref.current && !ref.current.contains(event.target)) onOutside()
    }

    document.addEventListener('mousedown', handlePress)
    return () => document.removeEventListener('mousedown', handlePress)
  }, [ref, onOutside, enabled])
}
