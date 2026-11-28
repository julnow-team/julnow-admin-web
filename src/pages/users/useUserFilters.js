import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from '../../lib/useDebounce'

// The values each filter accepts. Anything else in the URL is ignored.
export const ROLES = ['OWNER', 'TENANT', 'ADMIN']
export const STATUSES = ['ACTIVE', 'SUSPENDED']
export const TRUSTS = ['VERIFIED', 'FLAGGED', 'UNVERIFIED']
export const PLANS = ['TRIAL', 'STARTER', 'PRO', 'NONE']
export const BILLINGS = ['PAID', 'UNPAID', 'PAST_DUE', 'FAILED']

const ALLOWED = { role: ROLES, status: STATUSES, trust: TRUSTS, plan: PLANS, billing: BILLINGS }

// The filters of the Users page live in the URL (?role=OWNER&billing=PAST_DUE&page=2),
// so a reload or the Back button keeps them. In the URL the page starts at 1, in `filters` it starts at 0 like the API.
export function useUserFilters() {
  const [params, setParams] = useSearchParams()

  const filters = { q: params.get('q') ?? '', page: Math.max(0, (parseInt(params.get('page'), 10) || 1) - 1) }
  Object.entries(ALLOWED).forEach(([key, allowed]) => {
    const value = params.get(key)
    filters[key] = allowed.includes(value) ? value : ''
  })

  // Empty values leave the URL, so a clean page has a clean address
  const update = useCallback(
    (changes, replace = false) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
          return next
        },
        { replace },
      )
    },
    [setParams],
  )

  // The search box keeps its own text while typing. The URL gets the text after a short pause.
  const [search, setSearch] = useState(filters.q)
  const debounced = useDebounce(search)
  const inUrl = useRef(filters.q)

  useEffect(() => {
    if (debounced === inUrl.current) return
    inUrl.current = debounced
    update({ q: debounced, page: '' }, true)
  }, [debounced, update])

  // The URL changed from outside (Back button, reset, a link): show it in the box
  useEffect(() => {
    if (filters.q === inUrl.current) return
    inUrl.current = filters.q
    setSearch(filters.q)
  }, [filters.q])

  return {
    filters,
    search,
    setSearch,
    // A new filter always goes back to the first page
    setFilter: (key, value) => update({ [key]: value, page: '' }),
    setPage: (page) => update({ page: page > 0 ? String(page + 1) : '' }),
    reset: () => setParams({}),
  }
}
