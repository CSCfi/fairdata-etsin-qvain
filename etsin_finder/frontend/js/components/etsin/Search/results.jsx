import { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

import HeightTransition from '@/components/general/animations/heightTransition'
import SortResults from './sortResults'
import Pagination from './pagination'
import ResultsList from './resultslist'
import ResultsAmount from './resultsAmount'
import FilterResults from './filterResults'
import FilterToggle from './filterResults/filterToggle'
import NoResults from './noResults'
import CurrentQuery from './currentQuery'

import { useStores } from '@/stores/stores'

const Results = () => {
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleFilter = () => {
    setFilterOpen(!filterOpen)
  }

  return (
    <div className="container">
      <ContentPanel className="regular-row">
        <NoResults />
        <div>
          <ResultsHeader filterOpen={filterOpen} toggleFilter={toggleFilter} />
          <ResultsView filterOpen={filterOpen} />
        </div>
      </ContentPanel>
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

  return (
    <div>
      <Flex>
        <Filters filterOpen={filterOpen} />
        <ResultsCont>
          {isLoading ? <Translate content="results.loadingDatasets" component="p" /> : <ResultsList />}
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

const ContentPanel = styled.div`
  background-color: ${p => p.theme.ui.search.resultsPanel.backgroundColor};
  padding: ${p => p.theme.ui.search.resultsPanel.padding};
  margin: ${p => p.theme.ui.search.resultsPanel.margin};
  /* Space between the hero search bar and results content */
  margin-top: ${p => p.theme.ui.search.resultsPanel.marginTop};
  width: ${p => p.theme.ui.search.resultsPanel.width};
  border-radius: ${p => p.theme.ui.search.resultsPanel.borderRadius};
`

Results.defaultProps = {
  query: '',
}

export default observer(Results)
