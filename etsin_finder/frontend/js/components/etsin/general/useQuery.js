import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { useStores } from '@/stores/stores'
import { buildEtsinSearchTo, mergeEtsinSearchQueryParams } from '@/utils/lumiAifEtsinSearch'

export function useQuery() {
  const { search } = useLocation()
  const { Env: { app } } = useStores()
  return useMemo(() => mergeEtsinSearchQueryParams(app, search), [search, app])
}

export function useEtsinSearchNavigate() {
  const navigate = useNavigate()
  const { Env: { app } } = useStores()
  return useCallback(
    params => {
      navigate(buildEtsinSearchTo(app, params))
    },
    [navigate, app]
  )
}

export default useQuery
