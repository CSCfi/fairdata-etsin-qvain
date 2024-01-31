import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'

import HeightTransition from '@/components/general/animations/heightTransition'
import SortResults from './sortResults'
import Pagination from './pagination'
import ResultsList from './resultslist'
import ResultsAmount from './resultsAmount'
import FilterResults from './filterResults'
import FilterToggle from './filterResults/filterToggle'
import NoResults from './noResults'
import ClearFilters from './filterResults/clearFilters'
import CurrentQuery from './currentQuery'

import { useStores } from '@/stores/stores'

const Results = () => {
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleFilter = () => {
    setFilterOpen(!filterOpen)
  }

  return (
    <div className="container">
      <div className="regular-row">
        <NoResults />
        <div>
          <ResultsHeader filterOpen={filterOpen} toggleFilter={toggleFilter} />
          <ResultsView filterOpen={filterOpen} />
        </div>
      </div>
    </div>
  )
}

function ResultsHeader({ toggleFilter, filterOpen }) {
  return (
    <Header>
      <AmountCont>
        <ResultsAmount />
      </AmountCont>
      <ResultsHeaderCont>
        <QueryCont>
          <CurrentQuery />
        </QueryCont>
        <Settings>
          <FilterToggle margin="0em 0.5em 0em 0em" onClick={toggleFilter} active={filterOpen}>
            <FontAwesomeIcon icon={faFilter} /> <Translate content="search.filter.filter" />
          </FilterToggle>
          <SortResults />
        </Settings>
      </ResultsHeaderCont>
    </Header>
  )
}

ResultsHeader.propTypes = {
  toggleFilter: PropTypes.func,
  filterOpen: PropTypes.bool,
}

ResultsHeader.defaultProps = {
  toggleFilter: () => {},
  filterOpen: false,
}

const ResultsView = observer(({ filterOpen }) => {
  const {
    Etsin: {
      Search: { isLoading },
    },
  } = useStores()

  if (isLoading) return null

  return (
    <div>
      <Flex>
        <Filters filterOpen={filterOpen} />
        <ResultsCont>
          <ResultsList />
        </ResultsCont>
      </Flex>
      {!isLoading && <Pagination />}
    </div>
  )
})

ResultsView.propTypes = {
  filterOpen: PropTypes.bool,
}

ResultsView.defaultProps = {
  filterOpen: false,
}

function Filters({ filterOpen }) {
  return (
    <Translate
      component={Sidebar}
      role="search"
      attributes={{ 'aria-label': 'search.filter.filters' }}
    >
      <HeightTransition in={filterOpen} duration={300} onlyMobile>
        <ClearFilters />
        <FilterResults open={filterOpen} />
      </HeightTransition>
    </Translate>
  )
}

Filters.propTypes = {
  filterOpen: PropTypes.bool,
}

Filters.defaultProps = {
  filterOpen: false,
}

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8em;
`

const ResultsHeaderCont = styled.div`
  width: 100%;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: ${8 / 0.12}%;
    padding: 0 0 0 1em;
  }
`

const AmountCont = styled.div`
  width: 100%;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    width: ${4 / 0.12}%;
  }
`

const QueryCont = styled.div`
  display: none;
  p {
    margin-bottom: 0;
  }
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: block;
  }
`

const Sidebar = styled.div`
  display: block;
  overflow: hidden;
  width: 100%;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    width: ${4 / 0.12}%;
  }
`

const ResultsCont = styled.div`
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    width: ${8 / 0.12}%;
    padding: 0 0 0 1em;
  }
`

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Settings = styled.div`
  float: right;
`

Results.defaultProps = {
  query: '',
}

export default observer(Results)
