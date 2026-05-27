import { lumiAifPortalConfig } from './lumi-aif/config'

function noopMergeFacetParams(/* params */) {}

function copySearchParams(params) {
  return new URLSearchParams(params)
}

/** Default Fairdata Etsin (no branded portal cookie). */
export const defaultEtsinPortalConfig = {
  id: 'default',
  site: 'etsin.fairdata.fi',
  cookieValue: null,
  searchPathname: '/datasets',
  homeRouteIsSearch: false,
  redirectDatasetsToCanonicalSearch: false,
  hideDataCatalogFilterSection: false,
  mergeDefaultSearchFacetParams: noopMergeFacetParams,
  stripHiddenSearchFacetParams: copySearchParams,
}

const portalsByCookie = new Map([[lumiAifPortalConfig.cookieValue, lumiAifPortalConfig]])

/**
 * @param {string|undefined|null} app etsin_app cookie value
 * @returns {typeof defaultEtsinPortalConfig}
 */
export function getEtsinPortalConfig(app) {
  if (!app) {
    return defaultEtsinPortalConfig
  }
  return portalsByCookie.get(app) ?? defaultEtsinPortalConfig
}

export function isBrandedEtsinPortal(app) {
  return getEtsinPortalConfig(app).id !== 'default'
}
