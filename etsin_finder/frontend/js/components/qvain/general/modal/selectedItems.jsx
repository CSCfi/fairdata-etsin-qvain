import React from 'react'
import PropTypes from 'prop-types'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Label from '../card/label'
import { useStores } from '../../utils/stores'

const SelectedItems = ({ getter, handleClick, noItems }) => {
  const {
    Locale: { lang },
  } = useStores()
  const generateComponents = () => {
    if (!getter.length) {
      return <Translate component="div" content={noItems} />
    }

    return getter.map(item => (
      <Label color="primary" margin="0 0.5em 0.5em 0" key={`selected_${item.url}`}>
        <PaddedWord>{item.name[lang] || item.name.und}</PaddedWord>
        <FontAwesomeIcon onClick={() => handleClick(item)} icon={faTimes} size="xs" />
      </Label>
    ))
  }

  return <>{generateComponents()}</>
}

SelectedItems.propTypes = {
  getter: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired,
  noItems: PropTypes.string.isRequired,
}

const PaddedWord = styled.span`
  padding-right: 10px;
`
export default observer(SelectedItems)
