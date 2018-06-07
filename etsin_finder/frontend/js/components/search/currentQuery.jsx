import React from 'react'
import Translate from 'react-translate-component'

import ElasticQuery from '../../stores/view/elasticquery'

const CurrentQuery = () => {
  if (ElasticQuery.search !== '') {
    return (
      <p>
        <Translate content="results.resultsFor" />
        <strong>{ElasticQuery.search}</strong>
      </p>
    )
  }
  return null
}

export default CurrentQuery
