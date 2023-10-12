import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { useStores } from '@/utils/stores'
import dateFormat from '@/utils/dateFormat'
import checkDataLang, { getDataLang } from '@/utils/checkDataLang'

const DatasetDateInfo = () => {
  const {
    Etsin: {
      EtsinDataset: { datasetMetadata },
    },
  } = useStores()

  return (
    <DateInfo>
      {datasetMetadata.issued && (
        <p lang={getDataLang(datasetMetadata.issued)}>
          <Translate
            content="dataset.issued"
            with={{ date: dateFormat(checkDataLang(datasetMetadata.issued), { format: 'date' }) }}
          />
          <br />
          {datasetMetadata.modified && (
            <Translate
              content="dataset.modified"
              with={{
                date: dateFormat(checkDataLang(datasetMetadata.modified), { format: 'date' }),
              }}
            />
          )}
        </p>
      )}
    </DateInfo>
  )
}

const DateInfo = styled.div`
  margin-top: 0.3rem;
`

export default observer(DatasetDateInfo)
