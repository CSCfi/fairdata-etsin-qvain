import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import ErrorBoundary from '@/components/general/errorBoundary'
import { PAS_CODE } from '@/utils/constants'
import { useStores } from '@/utils/stores'

import Contact from '../contact'
import FairdataPasDatasetIcon from '../fairdataPasDatasetIcon'
import AskForAccess from './askForAccess'

const Controls = () => {
  const {
    Etsin: {
      EtsinDataset: { catalogRecord, emailInfo, isHarvested, isPas },
    },
  } = useStores()

  function hasEmailAddresses() {
    for (const actor in emailInfo) if (emailInfo[actor]) return true
    return false
  }

  return (
    <Labels id="controls">
      {(isPas || catalogRecord.preservation_state === PAS_CODE.ACCEPTED_FOR_DPS) && (
        <FairdataPasDatasetIcon />
      )}
      <Flex>
        <ErrorBoundary>{hasEmailAddresses() && !isHarvested && <Contact />}</ErrorBoundary>
        <AskForAccess />
      </Flex>
    </Labels>
  )
}

const Flex = styled.div`
  display: flex;
  align-items: stretch;
  > * {
    margin: 0.25rem;
  }
`

const Labels = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  margin: -0.25rem;
  > * {
    margin: 0.25rem;
  }
  > ${Flex} {
    margin: 0;
    margin-left: auto;
  }
`

export default observer(Controls)
