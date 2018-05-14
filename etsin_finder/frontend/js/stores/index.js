import Locale from './view/language'
import Env from './domain/env'
import Auth from './domain/auth'
import ElasticQuery from './view/elasticquery'
import DatasetQuery from './view/datasetquery'
import Accessibility from './view/accessibility'

const Stores = {
  Env,
  Auth,
  Locale,
  ElasticQuery,
  DatasetQuery,
  Accessibility,
}

export default Stores
