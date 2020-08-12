import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import Tooltip from '../../general/tooltipHover'
import Card from '../general/card'
import AddedValue from '../general/addedValue'
import Button from '../../general/button'
import { keywordsSchema } from '../utils/formValidation'
import ValidationError from '../general/validationError'
import { LabelLarge } from '../general/form'

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
    const RenderedKeywords = keywordsArray.map(word => (
      <AddedValue
        key={word}
        readonly={readonly}
        id={word}
        text={word}
        remove={this.handleKeywordRemove}
      />
    ))
    return (
      <Card>
        <LabelLarge htmlFor="keywordsInput">
          <Tooltip
            title={counterpart('qvain.description.fieldHelpTexts.requiredToPublish', { locale: lang })}
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

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  border: 1px solid #cccccc;
  padding: 8px;
  color: #808080;
  margin-bottom: 20px;
`
const ButtonContainer = styled.div`
  text-align: right;
`
const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 11px;
`

export default inject('Stores')(observer(KeywordsField))
