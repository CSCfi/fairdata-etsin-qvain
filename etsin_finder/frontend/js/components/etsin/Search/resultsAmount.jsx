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
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { useStores } from '@/stores/stores'

const ResultsAmount = () => {
  const {
    Etsin: {
      Search: { count, isLoading },
    },
  } = useStores()

  if (isLoading) return null

  return (
    <Translate
      component={Amount}
      aria-live="polite"
      content={`results.amount.${count === 1 ? 'snglr' : 'plrl'}`}
      with={{ amount: count }}
    />
  )
}

const Amount = styled.div`
  p {
    letter-spacing: 1px;
    font-weight: bold;
    color: ${props => props.theme.color.gray};
    font-size: 0.9em;
    margin: auto;
  }
`

export default observer(ResultsAmount)
