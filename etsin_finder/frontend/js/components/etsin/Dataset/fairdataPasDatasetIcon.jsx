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

import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { withStores, useStores } from '@/utils/stores'

const FairdataPasDatasetIcon = () => {
  const {
    Etsin: {
      EtsinDataset: { catalogRecord, isPas },
    },
  } = useStores()

  if (`${catalogRecord.preservation_state}` > 0 && !isPas) {
    return (
      <Translate component={FairdataPasIconContainerEnteringPas} content="dataset.enteringPas" />
    )
  }
  return <Translate component={FairdataPasIconContainerInPas} content="dataset.fairdataPas" />
}

export default withStores(observer(FairdataPasDatasetIcon))
export const undecorated = FairdataPasDatasetIcon

const FairdataPasIconContainer = styled.div`
  padding: 0.2em 0.9em;
  border-radius: 1em;
  margin-right: 5px;
  display: flex;
  align-items: center;
  white-space: nowrap;
`

const FairdataPasIconContainerInPas = styled(FairdataPasIconContainer)`
  background-color: #b3efb0;
`

const FairdataPasIconContainerEnteringPas = styled(FairdataPasIconContainer)`
  background-color: #efe4b0;
`
