/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import LocaleClass from './view/locale'
import EnvClass from './domain/env'
import AuthClass from './domain/auth'
import ElasticQueryClass from './view/elasticquery'
import DatasetQueryClass from './view/datasetquery'
import AccessibilityClass from './view/accessibility'
import MapClass from './view/map'
import QvainClass from './view/qvain'
import QvainDatasetsClass from './view/qvain/qvain.datasets'
import AccessClass from './view/access'
import SearchFiltersClass from './view/searchfilters'

// named exports fo the instances for non-React functions and classes
export const Env = new EnvClass()
export const Auth = new AuthClass()
export const QvainDatasets = new QvainDatasetsClass()
export const SearchFilters = new SearchFiltersClass()
export const Access = new AccessClass(Auth)
export const Qvain = new QvainClass(Env)
export const Accessibility = new AccessibilityClass(Env)
export const ElasticQuery = new ElasticQueryClass(Env)
export const Locale = new LocaleClass(Accessibility, ElasticQuery)
export const DatasetQuery = new DatasetQueryClass(Env, Access)
export const Map = new MapClass(Locale)

const Stores = {
  Env,
  Qvain,
  Accessibility,
  Locale,
  ElasticQuery,
  DatasetQuery,
  Auth,
  Access,
  Map,
  QvainDatasets,
  SearchFilters,
}

export default Stores
