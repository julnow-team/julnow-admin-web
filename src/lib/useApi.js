import { useEffect, useState } from 'react'

// Calls an api function and gives back { data, error, loading, reload }.
// params must be plain values (strings, numbers), they are sent to fetcher.
// When params change, it loads again. Example: useApi(getUsers, { page, q })
export function useApi(fetcher, params = {}) {
  const key = JSON.stringify(params)
  const [version, setVersion] = useState(0)
  const [result, setResult] = useState({ requestId: null, data: null, error: null })

  const requestId = `${key}#${version}`

  useEffect(() => {
    let ignore = false

    fetcher(JSON.parse(key))
      .then((data) => {
        if (!ignore) setResult({ requestId, data, error: null })
      })
      .catch((error) => {
        if (!ignore) setResult({ requestId, data: null, error })
      })

    // A newer request started, drop this answer
    return () => {
      ignore = true
    }
  }, [fetcher, key, requestId])

  return {
    data: result.data,
    error: result.error,
    loading: result.requestId !== requestId,
    reload: () => setVersion((current) => current + 1),
  }
}
