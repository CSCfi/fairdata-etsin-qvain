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
      Search: { term, isLoading },
    },
  } = useStores()
  if (isLoading) return null
  if (term) {
    return (
      <p>
        <Translate content="results.resultsFor" />
        <strong>{term}</strong>
      </p>
    )
  }
  return null
}

export default observer(CurrentQuery)
