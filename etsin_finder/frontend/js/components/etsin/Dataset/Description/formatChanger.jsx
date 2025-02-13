import React from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'

import EtsinTooltip from '../EtsinTooltip'
import formatChangerStyles from './formatChangerStyles'

const FormatChanger = () => {
  const {
    Env: { metaxV3Url },
    Etsin: {
      EtsinDataset: { identifier, metadataFormats },
    },
  } = useStores()

  const tooltip = metadataFormats.some(format => format.value === 'fairdata_datacite')
    ? {
        infoText: 'dataset.datasetAsFile.infoText',
        infoAriaLabel: 'dataset.datasetAsFile.infoLabel',
      }
    : null

  const selectLabel = { label: <Translate content="dataset.datasetAsFile.open" /> }

  const options = metadataFormats.map(single => ({
    label: <Translate content={`dataset.datasetAsFile.${single.value}`} />,
    value: single.value,
  }))

  const chooseFormat = format => {
    if (metadataFormats.some(field => field.value === format.value)) {
      const url = metaxV3Url('datasetFormat', identifier, format.value)
      window.open(url, '_blank').focus()
    } else {
      console.log(`Invalid value selected for dataset format: ${format.value}`)
    }
  }

  return (
    <Container>
      <Select
        id="metadataFormat"
        classNamePrefix="format"
        styles={formatChangerStyles()}
        value={selectLabel}
        onChange={chooseFormat}
        options={options}
        isClearable={false}
        isSearchable={false}
      />
      {tooltip ? <EtsinTooltip tooltip={tooltip} inverted withMargin /> : null}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 0.3em;
  > * {
    flex-basis: 50%;
  }
`

export default observer(FormatChanger)
