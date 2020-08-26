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

import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import FilterSection from './filterSection'

const FilterContainer = styled.ul`
  padding: 1em;
  margin-bottom: 1em;
  border: 2px solid ${props => props.theme.color.lightgray};
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0em;
    border: none;
  }
`

class FilterResults extends Component {
  render() {
    const SearchFilters = this.props.Stores.SearchFilters
    return (
      <FilterContainer aria-labelledby="filterlabel">
        <span id="filterlabel" className="sr-only" aria-hidden>
          <Translate content="search.filter.filters" />
        </span>
        <FilterSection aggregation="access_type" />
        <FilterSection aggregation="organization" />
        <FilterSection aggregation="creator" />
        <FilterSection aggregation="field_of_science" filterOpen={SearchFilters.fieldOfScienceIsOpen} />
        <FilterSection aggregation="keyword" filterOpen={SearchFilters.keywordIsOpen} />
        <FilterSection aggregation="infrastructure" />
        <FilterSection aggregation="project" filterOpen={SearchFilters.projectIsOpen} />
        <FilterSection aggregation="file_type" />
        <FilterSection aggregation="data_catalog" />
      </FilterContainer>
    )
  }
}

export default inject('Stores')(observer(FilterResults))

FilterResults.propTypes = {
  Stores: PropTypes.object.isRequired,
}
