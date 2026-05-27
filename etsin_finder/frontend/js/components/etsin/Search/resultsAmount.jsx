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

const ResultsAmount = () => {
  const {
    Etsin: {
      Search: { count, isLoading },
    },
  } = useStores()

  return (
    <Translate
      component={Amount}
      aria-live="polite"
      content={isLoading ? 'results.loadingDatasets' : 'results.count'}
      with={{ count }}
    />
  )
}

const Amount = styled.div`
  p {
    letter-spacing: 1px;
    font-weight: bold;
    color: ${p => p.theme.ui.search.resultsAmountPeriod.color};
    font-size: 0.9em;
    margin: auto;
  }
`

export default observer(ResultsAmount)
