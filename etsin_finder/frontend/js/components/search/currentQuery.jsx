import React from 'react'

import ElasticQuery from 'Stores/view/elasticquery'

const CurrentQuery = () => {
  if (ElasticQuery.search !== '') {
    return (
      <p>
        <span className="text-muted">Results for query: </span>
        <strong>{ElasticQuery.search}</strong>
      </p>
    )
  }
  return null
}

export default CurrentQuery
