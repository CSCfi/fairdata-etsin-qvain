import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { InvertedButton } from '@/components/etsin/general/button'

const ClearFilters = () => {
  const {
    Matomo,
    Accessibility,
    Etsin: {
      Search: { isLoading },
    },
    Locale: { translate },
  } = useStores()
  const navigate = useNavigate()

  const clear = () => {
    Matomo.recordEvent('CLEAR_FILTERS')
    Accessibility.announce(translate('search.filter.filtersCleared'))
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

export default ClearFilters
