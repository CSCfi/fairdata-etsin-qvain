import { useMemo } from 'react'
import { useLocation } from 'react-router'

export function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default useQuery
