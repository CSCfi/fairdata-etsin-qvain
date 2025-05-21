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

import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { useQuery } from '@/components/etsin/general/useQuery'

function NoResults() {
  const {
    Etsin: {
      Search: { count, isLoading },
    },
  } = useStores()

  const query = useQuery()

  if (count > 0 || isLoading) return null

  return (
    <Wrapper>
      {query.has('search') ? (
        <Translate
          content="search.noResults.searchterm"
          with={{ search: query.get('search') }}
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

export default observer(NoResults)
