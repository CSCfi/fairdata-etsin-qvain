import React from 'react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import ElasticQuery from '../../stores/view/elasticquery'

export default function NoResults() {
  return (
    <Wrapper>
      {ElasticQuery.search ? (
        <Translate
          content="search.noResults.searchterm"
          with={{ search: ElasticQuery.search }}
          component="span"
          unsafe
        />
      ) : (
        <Translate content="search.noResults.nosearchterm" component="span" unsafe />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  text-align: center;
  font-size: 1.1em;
`
