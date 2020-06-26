import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Observer } from 'mobx-react'
import {
    ButtonGroup,
    ButtonLabel,
    EditButton,
    DeleteButton,
    ButtonContainer
} from './buttons'

const FieldList = ({ Store, Field, fieldIdentifier, lang }) => {
  const { remove, edit } = Field

  const Elements = (
    <Observer>
      {() => (
    Store[fieldIdentifier].map(item => (
      <FieldListContainer key={item.uiid}>
        <Label>{item.name[lang] || item.name.und || item.name}</Label>
        <ButtonContainer>
          <Translate
            component={EditButton}
            type="button"
            onClick={() => edit(item.uiid)}
            attributes={{ 'aria-label': 'qvain.general.buttons.edit' }}
          />
          <Translate
            component={DeleteButton}
            type="button"
            onClick={() => remove(item.uiid)}
            attribute={{ 'aria-label': 'qvain.general.buttons.remove' }}
          />
        </ButtonContainer>
      </FieldListContainer>
      )
  ))}
    </Observer>
)
  return Elements
}

FieldList.propTypes = {
    Store: PropTypes.object.isRequired,
    Field: PropTypes.object.isRequired,
    fieldIdentifier: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired
}

const FieldListContainer = styled(ButtonGroup)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Label = styled(ButtonLabel)`
  white-space: normal;
  overflow: hidden;
  height: auto;
  word-break: break-word;
`

export default FieldList
