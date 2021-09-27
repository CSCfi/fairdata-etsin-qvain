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
import QvainDatasetsV2Class from './view/qvain/qvain.datasetsV2'
import AccessClass from './view/access'
import SearchFiltersClass from './view/searchfilters'
import MatomoClass from './tracking'
import CrossRefClass from './view/qvain/qvain.crossRef'

export const buildStores = () => {
  const Env = new EnvClass()
  const Auth = new AuthClass()
  const QvainDatasets = new QvainDatasetsClass()
  const QvainDatasetsV2 = new QvainDatasetsV2Class(QvainDatasets)
  const SearchFilters = new SearchFiltersClass()
  const Access = new AccessClass(Auth)
  const Qvain = new QvainClass(Env, Auth)
  const Accessibility = new AccessibilityClass(Env)
  const ElasticQuery = new ElasticQueryClass(Env)
  const Locale = new LocaleClass(Accessibility, ElasticQuery)
  const DatasetQuery = new DatasetQueryClass(Env, Access)
  const Map = new MapClass(Locale)
  const Matomo = new MatomoClass(Env)
  const CrossRef = new CrossRefClass()

  return {
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
    QvainDatasetsV2,
    SearchFilters,
    Matomo,
    CrossRef,
  }
}

export default buildStores()
