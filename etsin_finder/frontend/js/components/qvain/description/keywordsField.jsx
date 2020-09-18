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

  state = {
    keywordsValidationError: null,
  }

  handleChange = e => {
    const { setKeywordString } = this.props.Stores.Qvain
    setKeywordString(e.target.value)
    this.setState({ keywordsValidationError: null })
  }

  handleBlur = () => {
    const { keywordsArray } = this.props.Stores.Qvain
    keywordsSchema
      .validate(keywordsArray)
      .then(() => {
        this.setState({ keywordsValidationError: null })
      })
      .catch(err => {
        this.setState({ keywordsValidationError: err.errors })
      })
  }

  handleKeywordAdd = e => {
    e.preventDefault()
    const { addKeywordToKeywordArray } = this.props.Stores.Qvain
    addKeywordToKeywordArray()
  }

  handleKeywordRemove = word => {
    const { removeKeyword } = this.props.Stores.Qvain
    removeKeyword(word)
  }

  handleKeyDown = e => {
    if (e.keyCode === 188 || e.keyCode === 13) {
      this.handleKeywordAdd(e)
    }
  }

  render() {
    const { readonly, keywordsArray, keywordString } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    const RenderedKeywords = keywordsArray.map(word => (
      <Label color="#007fad" margin="0 0.5em 0.5em 0" key={word}>
        <PaddedWord>{word}</PaddedWord>
        {!readonly && (
          <FontAwesomeIcon
            className="delete-keyword"
            size="xs"
            icon={faTimes}
            aria-label="remove"
            onClick={() => this.handleKeywordRemove(word)}
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
          value={keywordString}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          type="text"
          attributes={{ placeholder: 'qvain.description.keywords.placeholder' }}
        />
        <ValidationError>{this.state.keywordsValidationError}</ValidationError>
        <ButtonContainer>
          <AddNewButton type="button" onClick={this.handleKeywordAdd} disabled={readonly}>
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
