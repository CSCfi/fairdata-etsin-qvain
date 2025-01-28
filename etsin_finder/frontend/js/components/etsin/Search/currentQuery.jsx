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
import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'

const CurrentQuery = () => {
  const {
    Etsin: {
      Search: { usedTerm, isLoading },
    },
  } = useStores()
  if (isLoading) return null
  if (usedTerm) {
    return (
      <p>
        <Translate content="results.resultsFor" />
        <strong>{usedTerm}</strong>
      </p>
    )
  }
  return null
}

export default observer(CurrentQuery)
