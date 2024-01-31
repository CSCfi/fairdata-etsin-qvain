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
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

import { useStores } from '@/stores/stores'
import { InvertedButton } from '@/components/etsin/general/button'

const ClearFilters = () => {
  const {
    Matomo,
    Accessibility,
    Etsin: {
      Search: { isLoading },
    },
  } = useStores()
  const history = useHistory()

  const clear = () => {
    Matomo.recordEvent('CLEAR_FILTERS')
    Accessibility.announce(translate('search.filter.filtersCleared'))
    history.push('/datasets')
  }

  if (isLoading) return null

  return (
    <Translate
      component={CustomButton}
      content="search.filter.clearFilter"
      onClick={clear}
      color="primary"
      open
    />
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
