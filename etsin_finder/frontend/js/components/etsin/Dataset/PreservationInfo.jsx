import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Translate from '@/utils/Translate'
import { useStores } from '@/utils/stores'

const PreservationInfo = () => {
  const {
    Etsin: {
      EtsinDataset: { isPas, preservation },
    },
  } = useStores()

  return isPas || preservation.useCopy || preservation.preservedCopy ? (
    <Container>
      {isPas && (
        <PasInfo>
          <Translate content="dataset.storedInPas" />
        </PasInfo>
      )}
      {preservation.useCopy && (
        <PasInfo>
          <Translate content="dataset.originalDatasetVersionExists" />
          <Link to={`/dataset/${preservation.useCopy.id}`}>
            <Translate content="dataset.linkToOriginalDataset" />
          </Link>
        </PasInfo>
      )}
      {preservation.preservedCopy && (
        <PasInfo>
          <Translate content="dataset.pasDatasetVersionExists" />
          <Link to={`/dataset/${preservation.preservedCopy.id}`}>
            <Translate content="dataset.linkToPasDataset" />
          </Link>
        </PasInfo>
      )}
    </Container>
  ) : null
}

const PasInfo = styled.div`
  color: ${p => p.theme.color.gray};
  font-size: 0.9em;
  padding: 0.3em 0;
  > a {
    color: ${p => p.theme.color.linkColorUIV2};
  }
`

const Container = styled.div`
  margin: 0.7em 0;
`

export default observer(PreservationInfo)
