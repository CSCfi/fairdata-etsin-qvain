import { Navigate, useLocation } from 'react-router'
import { observer } from 'mobx-react'

import { stripHiddenSearchFacetParamsForApp } from '@/utils/lumiAifEtsinSearch'
import { useStores } from '@/stores/stores'

/** `/datasets` → portal search root; hidden default facets omitted from the URL. */
const DatasetsCanonicalRedirect = () => {
  const { search } = useLocation()
  const {
    Env: { app },
  } = useStores()
  const params = stripHiddenSearchFacetParamsForApp(app, new URLSearchParams(search))
  const qs = params.toString()
  return <Navigate replace to={qs ? `/?${qs}` : '/'} />
}

export default observer(DatasetsCanonicalRedirect)
