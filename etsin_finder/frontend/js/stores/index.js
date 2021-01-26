/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import Locale from './view/locale'
import Env from './domain/env'
import Auth from './domain/auth'
import ElasticQuery from './view/elasticquery'
import DatasetQuery from './view/datasetquery'
import Accessibility from './view/accessibility'
import Map from './view/map'
import Qvain from './view/qvain'
import QvainDatasets from './view/qvain/qvain.datasets'
import Access from './view/access'
import SearchFilters from './view/searchfilters'

const env = new Env()
const qvain = new Qvain(env)
const accessibility = new Accessibility(env)
const elasticQuery = new ElasticQuery(env)
const locale = new Locale(accessibility, elasticQuery)
const datasetQuery = new DatasetQuery(env)
const auth = new Auth()
const access = new Access(auth)
const map = new Map()
const qvainDatasets = new QvainDatasets()
const searchFilters = new SearchFilters()

const Stores = {
  Env: env,
  Qvain: qvain,
  Accessibility: accessibility,
  Locale: locale,
  ElasticQuery: elasticQuery,
  DatasetQuery: datasetQuery,
  Auth: auth,
  Access: access,
  Map: map,
  QvainDatasets: qvainDatasets,
  SearchFilters: searchFilters,
}

export default Stores
