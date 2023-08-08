import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useStores } from '@/utils/stores'

const PreservationInfo = () => {
  const {
    Etsin: {
      EtsinDataset: { catalogRecord, isPas },
    },
  } = useStores()

  return (
    <>
      {isPas && (
        <PasInfo>
          <Translate content="dataset.storedInPas" />
        </PasInfo>
      )}
      {catalogRecord.preservation_dataset_origin_version && (
        <PasInfo>
          <Translate content="dataset.originalDatasetVersionExists" />
          <Link to={`/dataset/${catalogRecord.preservation_dataset_origin_version.identifier}`}>
            <Translate content="dataset.linkToOriginalDataset" />
          </Link>
        </PasInfo>
      )}
      {catalogRecord.preservation_dataset_version && (
        <PasInfo>
          <Translate content="dataset.pasDatasetVersionExists" />
          <Link to={`/dataset/${catalogRecord.preservation_dataset_version.identifier}`}>
            <Translate content="dataset.linkToPasDataset" />
          </Link>
        </PasInfo>
      )}
    </>
  )
}

const PasInfo = styled.div`
  color: ${p => p.theme.color.gray};
  font-size: 0.9em;
  padding-top: 5px;
  padding-bottom: 5px;
`

export default observer(PreservationInfo)
