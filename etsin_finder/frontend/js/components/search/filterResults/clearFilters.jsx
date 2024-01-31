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
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { InvertedButton } from '../../general/button'
import { useStores } from '@/stores/stores'

const ClearFilters = () => {
  const { ElasticQuery, Matomo, Accessibility } = useStores()

  const clear = () => {
    Matomo.recordEvent('CLEAR_FILTERS')
    ElasticQuery.clearFilters()
    ElasticQuery.queryES()
    Accessibility.announce(translate('search.filter.filtersCleared'))
  }

  return (
    <CustomButton onClick={clear} color="primary" open={ElasticQuery.filter.length > 0}>
      <Translate content="search.filter.clearFilter" />
    </CustomButton>
  )
}

const CustomButton = styled(InvertedButton)`
  display: ${p => (p.open ? 'initial' : 'none')};
  width: 100%;
  transition: 0.2s ease;
  margin: 0;
  margin-bottom: 0.5em;
`

export default ClearFilters
