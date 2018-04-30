import React from 'react'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import ElasticQuery from '../../stores/view/elasticquery'

const ResultsAmount = () => (
  <Translate
    className="results-amount"
    with={{ amount: ElasticQuery.results.total }}
    component="p"
    content={`results.amount.${ElasticQuery.results.total === 1 ? 'snglr' : 'plrl'}`}
    fallback="%(amount)s results"
  />
)

export default inject('Stores')(observer(ResultsAmount))
