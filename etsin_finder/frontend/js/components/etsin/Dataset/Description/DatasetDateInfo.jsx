import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { useStores } from '@/utils/stores'

const DatasetDateInfo = () => {
  const {
    Etsin: {
      EtsinDataset: { datasetMetadata },
    },
    Locale: { dateFormat, lang },
  } = useStores()

  return (
    <DateInfo>
      {datasetMetadata.releaseDate && (
        <p lang={lang}>
          <Translate
            content="dataset.issued"
            with={{
              date: dateFormat(datasetMetadata.releaseDate, { format: 'date' }),
            }}
          />
          <br />
          {datasetMetadata.modified && (
            <Translate
              content="dataset.modified"
              with={{
                date: dateFormat(datasetMetadata.modified, { format: 'date' }),
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
