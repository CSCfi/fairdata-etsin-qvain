import { observer } from 'mobx-react'
import styled from 'styled-components'

import ErrorBoundary from '@/components/general/errorBoundary'
import { useStores } from '@/utils/stores'

import Contact from '../contact'
import AskForAccess from './askForAccess'

const Controls = () => {
  const {
    Etsin: {
      EtsinDataset: { emailInfo, isHarvested },
    },
  } = useStores()

  function hasEmailAddresses() {
    for (const actor in emailInfo) if (emailInfo[actor]) return true
    return false
  }

  return (
    <Labels id="controls">
      <ErrorBoundary>{hasEmailAddresses() && !isHarvested && <Contact />}</ErrorBoundary>
      <AskForAccess />
    </Labels>
  )
}

const Labels = styled.div`
  margin-left: auto;
  > * {
    margin-bottom: 0.4rem;
    white-space: nowrap;
  }
`

export default observer(Controls)
