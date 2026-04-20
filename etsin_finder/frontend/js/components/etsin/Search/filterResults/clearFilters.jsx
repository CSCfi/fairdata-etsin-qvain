import styled from 'styled-components'
import { useNavigate } from 'react-router'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { InvertedButton } from '@/components/etsin/general/button'
import { observer } from 'mobx-react'

const ClearFilters = () => {
  const {
    Matomo,
    Accessibility,
    Etsin: {
      Search: {
        isLoading,
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
  const navigate = useNavigate()

  const clear = () => {
    Matomo.recordEvent('CLEAR_FILTERS')
    Accessibility.announce(translate('search.filter.filtersCleared'))
    resetTemporal()
    resetFacetSearches()
    if (flagEnabled('ETSIN.GEOPORTTI_PROTO')) {
      setResetLayers(true)
    }
    navigate('/datasets')
  }

  if (isLoading) return null

  return (
    <Translate
      component={CustomButton}
      content="search.filter.clearFilter"
      onClick={clear}
      color="primary"
      open
    />
  )
}

const CustomButton = styled(InvertedButton)`
  display: ${p => (p.open ? 'initial' : 'none')};
  width: 100%;
  transition: 0.2s ease;
  margin: 0;
  margin-bottom: 0.5em;
`

export default observer(ClearFilters)
