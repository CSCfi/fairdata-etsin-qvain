import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import ClearFilters from './clearFilters'

import FilterSection from './filterSection'
import DataCatalogFilterSection from './dataCatalogFilterSection'
import Map from '../mapSearch/map'
import { useStores } from '@/stores/stores'
import TemporalSection from './TemporalSection'

const FilterContainer = styled.ul`
  padding: 1em;
  margin-bottom: 1em;
  border: 2px solid ${props => props.theme.color.lightgray};
  background-color: ${p => p.theme.ui.search.filterContainerBg};
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0em;
    border: none;
  }
`

const FilterResults = () => {
  const {
    Env: {
      etsinPortal,
      Flags: { flagEnabled },
    },
  } = useStores()

  return (
    <FilterContainer aria-labelledby="filterlabel">
      <ClearFilters />
      <span id="filterlabel" className="sr-only" aria-hidden>
        <Translate content="search.filter.filters" />
      </span>
      {!etsinPortal.hideDataCatalogFilterSection && <DataCatalogFilterSection />}
      <FilterSection filterName="access_type" />
      <FilterSection filterName="organization" onlyCurrentLanguage showInput />
      <FilterSection filterName="creator" onlyCurrentLanguage showInput />
      <FilterSection filterName="field_of_science" showInput />
      <FilterSection filterName="keyword" showInput />
      <FilterSection filterName="infrastructure" />
      <TemporalSection />
      {flagEnabled('ETSIN.GEOPORTTI_PROTO') && <Map />}
      <FilterSection filterName="project" onlyCurrentLanguage showInput />
      <FilterSection filterName="file_type" />
    </FilterContainer>
  )
}

export default observer(FilterResults)
