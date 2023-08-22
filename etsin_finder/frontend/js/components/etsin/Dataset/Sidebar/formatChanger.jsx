import React from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { useStores } from '@/stores/stores'
import urls from '@/utils/urls'

import EtsinTooltip from '../EtsinTooltip'
import formatChangerStyles from './formatChangerStyles'

const FormatChanger = () => {
  const {
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
      const url = urls.format(identifier, format.value)
      const win = window.open(url, '_blank')
      win.focus()
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
