import React from 'react'
import { observer } from 'mobx-react'
import Select, { components } from 'react-select'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-solid-svg-icons'
import { useStores } from '@/stores/stores'
import urls from '@/utils/urls'
import Button, { Prefix } from '@/components/etsin/general/button'

import formatChangerStyles from './formatChangerStyles'

const FormatChanger = () => {
  const {
    Etsin: {
      EtsinDataset: { identifier, metadataFormats },
    },
  } = useStores()

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
    <Select
      id="metadataFormat"
      styles={formatChangerStyles()}
      value={selectLabel}
      onChange={chooseFormat}
      options={options}
      isClearable={false}
      isSearchable={false}
      components={{ Control }}
    />
  )
}

const Control = ({ children, ...props }) => (
  <components.Control {...props}>
    <MetadataControl>
      <ButtonPrefix>
        <FontAwesomeIcon icon={faFileLines} size="lg" />
      </ButtonPrefix>
      {children}
    </MetadataControl>
  </components.Control>
)

Control.propTypes = {
  children: PropTypes.node.isRequired,
}

const MetadataControl = styled(Button)`
  display: flex;
  border: none;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 100%;
  margin: 0;
`

const ButtonPrefix = styled(Prefix)`
  padding: 0.5rem 0.75rem;
`

export default observer(FormatChanger)
