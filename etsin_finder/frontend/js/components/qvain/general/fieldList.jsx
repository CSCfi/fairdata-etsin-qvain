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

const FieldList = ({ Field, lang, translationsRoot, elements }) => {
  const { remove, edit } = Field

  if (!elements.length) {
    return <Translate component="div" content={`${translationsRoot}.noItems`} />
  }


  const Elements = (
    <Observer>
      {() => (
    elements.map(item => (
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
    Field: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    translationsRoot: PropTypes.string.isRequired,
    elements: PropTypes.array
}

FieldList.defaultProps = {
  inEdit: false
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
