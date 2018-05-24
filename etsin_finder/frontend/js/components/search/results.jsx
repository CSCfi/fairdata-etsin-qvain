import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faFilter from '@fortawesome/fontawesome-free-solid/faFilter'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import ElasticQuery from '../../stores/view/elasticquery'
import HeightTransition from '../general/animations/heightTransition'
import SortResults from './sortResults'
import Pagination from './pagination'
import ResultsList from './resultslist'
import ResultsAmount from './resultsAmount'
import CurrentQuery from './currentQuery'
import FilterResults from './filterResults'
import FilterToggle from './filterResults/filterToggle'
import NoResults from './noResults'

class Results extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterOpen: false,
    }
  }

  toggleFilter = () => {
    this.setState({
      filterOpen: !this.state.filterOpen,
    })
  }

  render() {
    return (
      <div className="container">
        <div className="regular-row">
          {ElasticQuery.results.total === 0 && !ElasticQuery.loading ? (
            <NoResults />
          ) : (
            <Grid>
              <AmountRes>
                <ResultsAmount amount={ElasticQuery.results.total} />
              </AmountRes>
              <SortRes>
                <FilterToggle
                  margin="0em 0.5em 0em 0em"
                  onClick={this.toggleFilter}
                  active={this.state.filterOpen}
                >
                  <FontAwesomeIcon icon={faFilter} /> <Translate content="search.filter.filter" />
                </FilterToggle>
                <SortResults />
              </SortRes>
              <FilterRes>
                <HeightTransition in={this.state.filterOpen} duration={300} onlyMobile>
                  <FilterResults open={this.state.filterOpen} />
                </HeightTransition>
              </FilterRes>
              <QueryString>
                <CurrentQuery />
              </QueryString>
              <ResList>
                <ResultsList />
              </ResList>
              <PageSwitcher>
                <Pagination
                  loading={ElasticQuery.loading}
                  totalResults={ElasticQuery.results.total}
                  perPage={ElasticQuery.perPage}
                  currentPage={ElasticQuery.pageNum}
                />
              </PageSwitcher>
            </Grid>
          )}
        </div>
      </div>
    )
  }
}

const Grid = styled.div`
  display: grid;
  transition: 0.3s ease;
  width: 100%;
  grid-template-columns: auto;
  grid-template-areas:
    'header'
    'settings'
    'filters'
    'results'
    'pagination';
  grid-column-gap: 0.5em;
  grid-row-gap: 0.5em;
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-areas:
      'settings'
      'filters'
      'results'
      'pagination';
  }
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-column-gap: 1em;
    grid-row-gap: 1em;
    grid-template-columns: 1fr 3fr;
    grid-template-areas:
      'header settings'
      'sidebar results'
      'pagination pagination';
  }
`
const AmountRes = styled.div`
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    grid-area: settings;
  }
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-area: header;
  }
  grid-area: header;
  align-self: center;
`
const FilterRes = styled.div`
  display: flex;
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-area: sidebar;
  }
  overflow: hidden;
  grid-area: filters;
`
const SortRes = styled.div`
  grid-area: settings;
  align-self: center;
  width: max-content;
  justify-self: end;
`
const QueryString = styled.div`
  grid-area: settings;
  display: none;
  align-self: center;
  p {
    margin: auto;
  }
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
  }
`

const ResList = styled.div`
  grid-area: results;
`
const PageSwitcher = styled.div`
  grid-area: pagination;
`

Results.defaultProps = {
  query: '',
}

export default inject('Stores')(observer(Results))
