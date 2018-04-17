import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import ElasticQuery from 'Stores/view/elasticquery'
import HeightTransition from './heightTransition'
import SortResults from './sortResults'
import Pagination from './pagination'
import ResultsList from './resultslist'
import ResultsAmount from './resultsAmount'
import CurrentQuery from './currentQuery'
import FilterResults from './filterResults'
import Loader from '../general/loader'

const Grid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: auto;
  grid-template-areas:
    'header'
    'filters'
    'results'
    'pagination';
  grid-column-gap: 1em;
  grid-row-gap: 1em;
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr 3fr;
    grid-template-areas:
      'sidebartop header'
      'sidebar results'
      'pagination pagination';
  }
`
const AmountRes = styled.div`
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-area: sidebartop;
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
  grid-area: header;
  align-self: center;
`
const QueryString = styled.div`
  grid-area: header;
  display: none;
  align-self: center;
`
const LoadCont = styled.div`
  grid-area: results;
`
const ResList = styled.div`
  grid-area: results;
`
const PageSwitcher = styled.div`
  grid-area: pagination;
`

const FilterToggle = styled.button``

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
        <div className="row regular-row">
          <Grid>
            <AmountRes>
              <ResultsAmount />
            </AmountRes>
            <FilterRes collapsed={this.state.filterOpen}>
              <HeightTransition in={this.state.filterOpen} duration={500}>
                <FilterResults />
              </HeightTransition>
            </FilterRes>
            <SortRes>
              <FilterToggle onClick={this.toggleFilter}>Toggle Filter</FilterToggle>
              <SortResults />
            </SortRes>
            <QueryString>
              <CurrentQuery />
            </QueryString>
            <LoadCont>
              <Loader active={ElasticQuery.loading} margin="0.2em 0 1em" />
            </LoadCont>
            <ResList>
              <ResultsList query={this.props.query} />
            </ResList>
            <PageSwitcher>
              <Pagination />
            </PageSwitcher>
          </Grid>
        </div>
      </div>
    )
  }
}

export default inject('Stores')(observer(Results))
