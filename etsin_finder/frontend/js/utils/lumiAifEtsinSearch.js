/**
 * Etsin search URL and query helpers for branded portals (re-exports stable names).
 */

import { getEtsinPortalConfig } from '@/etsinPortals/registry'
import { LUMI_AIF_ETSIN_APP_COOKIE } from '@/etsinPortals/lumi-aif/config'

export { LUMI_AIF_ETSIN_APP_COOKIE }

export function etsinSearchPathname(app) {
  return getEtsinPortalConfig(app).searchPathname
}

export function mergeEtsinSearchQueryParams(app, searchString) {
  const params = new URLSearchParams(searchString)
  const portal = getEtsinPortalConfig(app)
  portal.mergeDefaultSearchFacetParams(params)
  return params
}

export function stripHiddenSearchFacetParamsForApp(app, params) {
  return getEtsinPortalConfig(app).stripHiddenSearchFacetParams(new URLSearchParams(params))
}

/** Strips hidden facet keys for the LUMI-AIF portal (same as stripHiddenSearchFacetParamsForApp with that cookie). */
export function stripLumiAifFacetParamsFromSearchParams(params) {
  return stripHiddenSearchFacetParamsForApp(LUMI_AIF_ETSIN_APP_COOKIE, params)
}

export function buildEtsinSearchTo(app, params) {
  const portal = getEtsinPortalConfig(app)
  const path = portal.searchPathname
  const q = portal.stripHiddenSearchFacetParams(new URLSearchParams(params))
  const s = q.toString()
  return s ? `${path}?${s}` : path
}
