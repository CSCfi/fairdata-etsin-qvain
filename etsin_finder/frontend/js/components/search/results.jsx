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

import React, { useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'

import HeightTransition from '../general/animations/heightTransition'
import SortResults from './sortResults'
import Pagination from './pagination'
import ResultsList from './resultslist'
import ResultsAmount from './resultsAmount'
import CurrentQuery from './currentQuery'
import FilterResults from './filterResults'
import FilterToggle from './filterResults/filterToggle'
import NoResults from './noResults'
import ClearFilters from './filterResults/clearFilters'

import { useStores } from '../../stores/stores'

const Results = () => {
  const { ElasticQuery } = useStores()
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleFilter = () => {
    setFilterOpen(!filterOpen)
  }

  return (
    <div className="container">
      <div className="regular-row">
        {ElasticQuery.results.total === 0 && !ElasticQuery.loading ? (
          <NoResults />
        ) : (
          <div>
            {ElasticQuery.results.total !== 0 ? (
              <div>
                <Header>
                  <AmountCont>
                    <ResultsAmount amount={ElasticQuery.results.total} />
                  </AmountCont>
                  <ResultsHeader>
                    <QueryCont>
                      <CurrentQuery />
                    </QueryCont>
                    <Settings>
                      <FilterToggle
                        margin="0em 0.5em 0em 0em"
                        onClick={toggleFilter}
                        active={filterOpen}
                      >
                        <FontAwesomeIcon icon={faFilter} />{' '}
                        <Translate content="search.filter.filter" />
                      </FilterToggle>
                      <SortResults />
                    </Settings>
                  </ResultsHeader>
                </Header>
                <Flex>
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
                  <ResultsCont>
                    <ResultsList />
                  </ResultsCont>
                </Flex>
                <Pagination
                  loading={ElasticQuery.loading}
                  totalResults={ElasticQuery.results.total}
                  perPage={ElasticQuery.perPage}
                  currentPage={ElasticQuery.pageNum}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8em;
`

const ResultsHeader = styled.div`
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
