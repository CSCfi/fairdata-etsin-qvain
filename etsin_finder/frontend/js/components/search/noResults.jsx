{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React from 'react'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import { useStores } from '../../stores/stores'

export default function NoResults() {
  const { ElasticQuery } = useStores()
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
