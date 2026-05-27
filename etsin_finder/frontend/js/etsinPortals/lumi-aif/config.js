/**
 * LUMI-AIF branded Etsin portal: search at `/` with fixed Daas + LUMI-AIF facets
 * in API/query logic, omitted from the visible URL.
 */

import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'

export const LUMI_AIF_ETSIN_APP_COOKIE = 'lumi-aif.etsin'

const DEFAULT_SEARCH_FACET_PARAMS = {
  data_catalog__id: DATA_CATALOG_IDENTIFIER.DAAS,
  facet_data_service: 'LUMI AI Factory',
}

export function mergePortalFacetParams(params) {
  params.delete('facet_data_catalog')
  params.delete('data_catalog__id')
  params.delete('facet_data_service')

  Object.entries(DEFAULT_SEARCH_FACET_PARAMS).forEach(([key, value]) => {
    params.delete(key)
    params.append(key, value)
  })
}

export function stripPortalFacetParamsFromSearchParams(params) {
  const next = new URLSearchParams(params)
  next.delete('facet_data_catalog')
  next.delete('data_catalog__id')
  next.delete('facet_data_service')
  return next
}

export const lumiAifPortalConfig = {
  id: 'lumi-aif',
  site: 'lumi-aif.fairdata.fi',
  cookieValue: LUMI_AIF_ETSIN_APP_COOKIE,
  searchPathname: '/',
  homeRouteIsSearch: true,
  redirectDatasetsToCanonicalSearch: true,
  hideDataCatalogFilterSection: true,
  mergeDefaultSearchFacetParams: mergePortalFacetParams,
  stripHiddenSearchFacetParams: stripPortalFacetParamsFromSearchParams,
}
