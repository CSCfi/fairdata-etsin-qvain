import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import counterpart from 'counterpart'

import Tooltip from '../../general/tooltipHover'
import Card from '../general/card'
import Label from '../general/card/label'
import ValidationError from '../general/errors/validationError'
import { LabelLarge, Input } from '../general/modal/form'
import { keywordsSchema } from '../utils/formValidation'
import { ButtonContainer, AddNewButton } from '../general/buttons'

class KeywordsField extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  handleChange = e => {
    const { setItemStr, setValidationError } = this.props.Stores.Qvain.Keywords
    if (e.target.value === ',') {
      return
    }
    setItemStr(e.target.value)
    setValidationError(null)
  }

  handleBlur = () => {
    const { storage, setValidationError } = this.props.Stores.Qvain.Keywords
    keywordsSchema
      .validate(storage)
      .then(() => {
        setValidationError(null)
      })
      .catch(err => {
        setValidationError(err.errors)
      })
  }

  handleKeyDown = e => {
    const { addKeyword, removeItemStr } = this.props.Stores.Qvain.Keywords
    if (e.keyCode === 188) {
      addKeyword()
      removeItemStr()
    }
  }

  render() {
    const {
      readonly,
      storage,
      itemStr,
      validationError,
      remove,
      addKeyword,
    } = this.props.Stores.Qvain.Keywords
    const { lang } = this.props.Stores.Locale
    const RenderedKeywords = storage.map(word => (
      <Label color="#007fad" margin="0 0.5em 0.5em 0" key={word}>
        <PaddedWord>{word}</PaddedWord>
        {!readonly && (
          <FontAwesomeIcon
            className="delete-keyword"
            size="xs"
            icon={faTimes}
            aria-label="remove"
            onClick={() => remove(word)}
          />
        )}
      </Label>
    ))
    return (
      <Card>
        <LabelLarge htmlFor="keywordsInput">
          <Tooltip
            title={counterpart('qvain.description.fieldHelpTexts.requiredToPublish', {
              locale: lang,
            })}
            position="right"
          >
            <Translate content="qvain.description.keywords.title" /> *
          </Tooltip>
        </LabelLarge>
        <Translate component="p" content="qvain.description.keywords.help" />
        {RenderedKeywords}
        <Translate
          component={Input}
          id="keywordsInput"
          disabled={readonly}
          value={itemStr}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          type="text"
          attributes={{ placeholder: 'qvain.description.keywords.placeholder' }}
        />
        <ValidationError>{validationError}</ValidationError>
        <ButtonContainer>
          <AddNewButton type="button" onClick={addKeyword} disabled={readonly}>
            <Translate content="qvain.description.keywords.addButton" />
          </AddNewButton>
        </ButtonContainer>
      </Card>
    )
  }
}

const PaddedWord = styled.span`
  padding-right: 10px;
`

export default inject('Stores')(observer(KeywordsField))
