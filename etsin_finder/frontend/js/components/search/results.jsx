import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faFilter from '@fortawesome/fontawesome-free-solid/faFilter'

import ElasticQuery from 'Stores/view/elasticquery'
import HeightTransition from '../general/animations/heightTransition'
import SortResults from './sortResults'
import Pagination from './pagination'
import ResultsList from './resultslist'
import ResultsAmount from './resultsAmount'
import CurrentQuery from './currentQuery'
import FilterResults from './filterResults'
import FilterToggle from './filterResults/filterToggle'
import Loader from '../general/loader'

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
          <Grid>
            <AmountRes>
              <ResultsAmount />
            </AmountRes>
            <SortRes>
              <FilterToggle
                margin="0em 0.5em 0em 0em"
                onClick={this.toggleFilter}
                active={this.state.filterOpen}
              >
                <FontAwesomeIcon icon={faFilter} /> Filter
              </FilterToggle>
              <SortResults />
            </SortRes>
            <FilterRes>
              <HeightTransition in={this.state.filterOpen} duration={300}>
                <FilterResults open={this.state.filterOpen} />
              </HeightTransition>
            </FilterRes>
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

const Grid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: auto;
  grid-template-areas:
    'header'
    'filters'
    'results'
    'pagination';
  grid-column-gap: 0.5em;
  grid-row-gap: 0.5em;
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-column-gap: 1em;
    grid-row-gap: 1em;
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
  width: max-content;
  justify-self: end;
`
const QueryString = styled.div`
  grid-area: header;
  display: none;
  align-self: center;
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
  }
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

export default inject('Stores')(observer(Results))
