import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { useEtsinSearchNavigate } from '@/components/etsin/general/useQuery'
import { InvertedButton } from '@/components/etsin/general/button'
import { observer } from 'mobx-react'

const ClearFilters = () => {
  const {
    Matomo,
    Accessibility,
    Etsin: {
      Search: {
        resetTemporal,
        resetFacetSearches,
        MapSearch: {
          setResetLayers
        }
      },
    },
    Locale: { translate },
    Env: {
      Flags: { flagEnabled },
    },
  } = useStores()
  const navigateSearch = useEtsinSearchNavigate()

  const clear = () => {
    Matomo.recordEvent('CLEAR_FILTERS')
    Accessibility.announce(translate('search.filter.filtersCleared'))
    resetTemporal()
    resetFacetSearches()
    if (flagEnabled('ETSIN.GEOPORTTI_PROTO')) {
      setResetLayers(true)
    }
    navigateSearch(new URLSearchParams())
  }

  return (
    <Translate
      component={CustomButton}
      content="search.filter.clearFilter"
      onClick={clear}
      open
    />
  )
}

const CustomButton = styled(InvertedButton)`
  display: ${p => (p.open ? 'initial' : 'none')};
  width: 100%;
  transition: 0.2s ease;
  font-size: ${p => p.theme.ui.search.clearFiltersFontSize};
  margin: 0;
  margin-bottom: 0.5em;
`

export default observer(ClearFilters)
