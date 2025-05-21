import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

import Button, { Prefix } from '@/components/etsin/general/button'
import { useStores } from '@/utils/stores'

const CitationButton = props => {
  const {
    Etsin: {
      EtsinDataset: { setShowCitationModal },
    },
  } = useStores()

  return (
    <>
      <PrefixButton
        onClick={() => {
          setShowCitationModal(true)
        }}
        {...props}
      >
        <ButtonPrefix>
          <FontAwesomeIcon icon={faQuoteRight} />
        </ButtonPrefix>
        <Translate content="dataset.citation.buttonTitle" component={Content} />
      </PrefixButton>
    </>
  )
}

const ButtonPrefix = styled(Prefix)`
  padding: 0.5rem 0.75rem;
`

const Content = styled.div`
  margin: 0.5rem 1rem;
  justify-self: center;
  flex-grow: 1;
`

const PrefixButton = styled(Button)`
  display: flex;
  border: none;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 100%;
  margin: 0;
  max-width: 26rem;
`

export default observer(CitationButton)
