import React from 'react'
import ElasticQuery from '../../stores/view/elasticquery'

const CurrentQuery = () => (
  <p>
    <span className="text-muted">Results for query: </span>
    <strong>{ElasticQuery.search}</strong>
  </p>
)

export default CurrentQuery
