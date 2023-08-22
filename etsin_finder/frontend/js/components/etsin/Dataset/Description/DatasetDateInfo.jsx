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
      EtsinDataset: { dataset },
    },
  } = useStores()

  return (
    <DateInfo>
      {dataset.issued && (
        <p lang={getDataLang(dataset.issued)}>
          <Translate
            content="dataset.issued"
            with={{ date: dateFormat(checkDataLang(dataset.issued), { format: 'date' }) }}
          />
          <br />
          {dataset.modified && (
            <Translate
              content="dataset.modified"
              with={{
                date: dateFormat(checkDataLang(dataset.modified), { format: 'date' }),
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
