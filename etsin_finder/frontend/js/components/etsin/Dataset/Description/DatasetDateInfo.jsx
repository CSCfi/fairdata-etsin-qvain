import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { useStores } from '@/utils/stores'

const DatasetDateInfo = () => {
  const {
    Etsin: {
      EtsinDataset: { datasetMetadata },
    },
    Locale: { dateFormat, getPreferredLang, getValueTranslation },
  } = useStores()

  return (
    <DateInfo>
      {datasetMetadata.releaseDate && (
        <p lang={getValueTranslation(datasetMetadata.releaseDate)}>
          <Translate
            content="dataset.issued"
            with={{
              date: dateFormat(getPreferredLang(datasetMetadata.releaseDate), { format: 'date' }),
            }}
          />
          <br />
          {datasetMetadata.modified && (
            <Translate
              content="dataset.modified"
              with={{
                date: dateFormat(getPreferredLang(datasetMetadata.modified), { format: 'date' }),
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
