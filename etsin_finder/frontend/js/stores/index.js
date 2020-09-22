/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import Locale from './view/language'
import Env from './domain/env'
import Auth from './domain/auth'
import ElasticQuery from './view/elasticquery'
import DatasetQuery from './view/datasetquery'
import Accessibility from './view/accessibility'
import Map from './view/map'
import Qvain from './view/qvain'
import QvainDatasets from './view/qvain.datasets'
import Access from './view/access'
import SearchFilters from './view/searchfilters'

const Stores = {
  Env,
  Auth,
  Locale,
  ElasticQuery,
  DatasetQuery: new DatasetQuery(Env),
  Accessibility,
  Map,
  Qvain: new Qvain(Env),
  QvainDatasets,
  Access,
  SearchFilters,
}

export default Stores
