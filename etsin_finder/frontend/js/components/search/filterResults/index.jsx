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

import { observer } from 'mobx-react'
import FilterSection from './filterSection'
import { useStores } from '../../../utils/stores'

const FilterContainer = styled.ul`
  padding: 1em;
  margin-bottom: 1em;
  border: 2px solid ${props => props.theme.color.lightgray};
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0em;
    border: none;
  }
`

const FilterResults = () => {
  const {
    SearchFilters: { fieldOfScienceIsOpen, keywordIsOpen, projectIsOpen },
  } = useStores()

  return (
    <FilterContainer aria-labelledby="filterlabel">
      <span id="filterlabel" className="sr-only" aria-hidden>
        <Translate content="search.filter.filters" />
      </span>
      <FilterSection aggregation="data_catalog" />
      <FilterSection aggregation="access_type" />
      <FilterSection aggregation="organization" />
      <FilterSection aggregation="creator" />
      <FilterSection aggregation="field_of_science" filterOpen={fieldOfScienceIsOpen} />
      <FilterSection aggregation="keyword" filterOpen={keywordIsOpen} />
      <FilterSection aggregation="infrastructure" />
      <FilterSection aggregation="project" filterOpen={projectIsOpen} />
      <FilterSection aggregation="file_type" />
    </FilterContainer>
  )
}

export default observer(FilterResults)
