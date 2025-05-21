import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import ClearFilters from './clearFilters'

import FilterSection from './filterSection'
import { useStores } from '@/stores/stores'

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
    Etsin: {
      Search: { isLoading },
    },
  } = useStores()

  if (isLoading) return null

  return (
    <FilterContainer aria-labelledby="filterlabel">
      <ClearFilters />
      <span id="filterlabel" className="sr-only" aria-hidden>
        <Translate content="search.filter.filters" />
      </span>
      <FilterSection filterName="data_catalog" />
      <FilterSection filterName="access_type" />
      <FilterSection filterName="organization" onlyCurrentLanguage />
      <FilterSection filterName="creator" onlyCurrentLanguage />
      <FilterSection filterName="field_of_science" />
      <FilterSection filterName="keyword" />
      <FilterSection filterName="infrastructure" />
      <FilterSection filterName="project" onlyCurrentLanguage />
      <FilterSection filterName="file_type" />
    </FilterContainer>
  )
}

export default observer(FilterResults)
