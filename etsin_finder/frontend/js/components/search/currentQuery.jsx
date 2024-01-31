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
import { useStores } from '@/stores/stores'

const CurrentQuery = () => {
  const { ElasticQuery } = useStores()
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
