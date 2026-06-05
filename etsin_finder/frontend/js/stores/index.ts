import LocaleClass from './view/locale'
import EnvClass from './domain/env'
import AuthClass from './domain/auth'
import DatasetQueryClass from './view/datasetquery'
import AccessibilityClass from './view/accessibility'
import MapClass from './view/mapUtils'
import QvainClass from './view/qvain'
import EtsinClass from './view/etsin'
import QvainDatasetsClass from './view/qvain/qvain.datasets'
import AccessClass from './view/access'
import SearchFiltersClass from './view/searchfilters'
import MatomoClass from './tracking'
import CrossRefClass from './view/qvain/qvain.crossRef'
import OrgReferencesClass from './view/qvain/qvain.orgReferences.v3'

export const buildStores = (options: { Env?: EnvClass } = {}) => {
  const Env = options.Env || new EnvClass()
  const Auth = new AuthClass(Env)
  const Locale = new LocaleClass(Env)
  const Accessibility = new AccessibilityClass(Env, Locale)
  const SearchFilters = new SearchFiltersClass()
  const Access = new AccessClass(Auth)
  const QvainDatasets = new QvainDatasetsClass(Env, Auth, Locale)
  const OrgReferences = new OrgReferencesClass(Env)
  const Qvain = new QvainClass(Env, Auth, Locale, OrgReferences)
  const DatasetQuery = new DatasetQueryClass(Env, Access)
  const Etsin = new EtsinClass({ Env, Access, Accessibility, Locale })
  const MapUtils = new MapClass(Locale)
  const Matomo = new MatomoClass(Env)
  const CrossRef = new CrossRefClass(Env)
  return {
    Env,
    Qvain,
    Etsin,
    Accessibility,
    Locale,
    DatasetQuery,
    Auth,
    Access,
    MapUtils,
    QvainDatasets,
    SearchFilters,
    Matomo,
    CrossRef,
  }
}

export type Stores = ReturnType<typeof buildStores>
