import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { inject, observer } from 'mobx-react'
import counterpart from 'counterpart'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { titleSchema, descriptionSchema } from '../utils/formValidation'

import ValidationError from '../general/validationError'
import Tooltip from '../../general/tooltipHover'
import { Input, Textarea, LabelLarge } from '../general/form'


class DescriptionField extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    active: 'FINNISH',
    titleError: null,
    descriptionError: null,
  }

  handleTitleChange = e => {
    const title = e.target.value
    this.props.Stores.Qvain.setTitle(title, this.state.active)
    this.setState({ titleError: null })
  }

  handleDescriptionChange = e => {
    const description = e.target.value
    this.props.Stores.Qvain.setDescription(description, this.state.active)
    this.setState({ descriptionError: null })
  }

  handleTitleBlur = () => {
    titleSchema
      .validate(this.props.Stores.Qvain.title)
      .then(() => {
        this.setState({ titleError: null })
      })
      .catch(err => {
        this.setState({ titleError: err.errors })
      })
  }

  handleDescriptionBlur = () => {
    descriptionSchema
      .validate(this.props.Stores.Qvain.description)
      .then(() => {
        this.setState({ descriptionError: null })
      })
      .catch(err => {
        this.setState({ descriptionError: err.errors })
      })
  }

  handleLanguageButtonClicks = (e) => {
    e.preventDefault()
    /* eslint-disable no-unused-expressions */
    this.state.active === 'FINNISH'
      ? this.setState({ active: 'ENGLISH' })
      : this.setState({ active: 'FINNISH' })
  }

  getLangButton = (activeLang, buttonLang) => (
    <LangButton active={activeLang === buttonLang} onClick={this.handleLanguageButtonClicks}>
      <Translate
        content={
          buttonLang === 'FINNISH'
            ? 'qvain.description.description.langFi'
            : 'qvain.description.description.langEn'
        }
      />
    </LangButton>
  )

  getPlaceholder = (field, activeLang) => {
    const stub = `qvain.description.description.${field}.`
    return activeLang === 'FINNISH' ? `${stub}placeholderFi` : `${stub}placeholderEn`
  }

  render() {
    const { lang } = this.props.Stores.Locale
    const { title, description, readonly } = this.props.Stores.Qvain
    const activeLang = this.state.active
    return (
      <React.Fragment>
        <LangButtonContainer>
          {this.getLangButton(this.state.active, 'FINNISH')}
          <EmptyBlock width="2%" />
          {this.getLangButton(this.state.active, 'ENGLISH')}
          <EmptyBlock width="48%" />
        </LangButtonContainer>
        <DescriptionCard>
          <LabelLarge htmlFor="titleInput">
            <Tooltip
              title={counterpart('qvain.description.fieldHelpTexts.requiredForAll', { locale: lang })}
              position="right"
            >
              <Translate content="qvain.description.description.title.label" /> *
            </Tooltip>
          </LabelLarge>
          {activeLang === 'FINNISH' && (
            <Translate
              component={Input}
              type="text"
              id="titleInput"
              disabled={readonly}
              value={title.fi}
              onChange={this.handleTitleChange}
              onBlur={this.handleTitleBlur}
              attributes={{ placeholder: this.getPlaceholder('title', 'FINNISH') }}
            />
          )}
          {activeLang === 'ENGLISH' && (
            <Translate
              component={Input}
              type="text"
              id="titleInput"
              disabled={readonly}
              value={title.en}
              onChange={this.handleTitleChange}
              onBlur={this.handleTitleBlur}
              attributes={{ placeholder: this.getPlaceholder('title', 'ENGLISH') }}
            />
          )}
          {this.state.titleError ? <Translate component={ValidationError} content={'qvain.description.error.title'} /> : null}
          <LabelLarge htmlFor="descriptionInput">
            <Tooltip
              title={counterpart('qvain.description.fieldHelpTexts.requiredForAll', { locale: lang })}
              position="right"
            >
              <Translate content="qvain.description.description.description.label" /> *
            </Tooltip>
          </LabelLarge>
          {activeLang === 'FINNISH' && (
            <Translate
              component={Textarea}
              id="descriptionInput"
              rows="8"
              disabled={readonly}
              value={description.fi}
              onChange={this.handleDescriptionChange}
              onBlur={this.handleDescriptionBlur}
              attributes={{ placeholder: this.getPlaceholder('description', this.state.active) }}
            />
          )}
          {activeLang === 'ENGLISH' && (
            <Translate
              component={Textarea}
              id="descriptionInput"
              rows="8"
              disabled={readonly}
              value={description.en}
              onChange={this.handleDescriptionChange}
              onBlur={this.handleDescriptionBlur}
              attributes={{ placeholder: this.getPlaceholder('description', this.state.active) }}
            />
          )}
          {this.state.descriptionError ? <Translate component={ValidationError} content={'qvain.description.error.description'} /> : null}
          <Translate component="div" content="qvain.description.description.instructions" />
        </DescriptionCard>
      </React.Fragment>
    )
  }
}

const DescriptionCard = styled.div`
  margin-bottom: 15px;
  padding: 25px 44px;
  border: 1px solid #007fad;
  border-top: none;
  min-height: 150px;
  background-color: #fff;
  overflow: auto;
`

const LangButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`
const LangButton = styled.button`
  width: 25%;
  padding: 5px 20px;
  background-color: #fff;
  border: 1px solid ${props => (props.active ? '#007fad' : '#cccccc')};
  border-bottom: ${props => (props.active ? 'none' : '1px solid #007fad')};
  border-radius: 4px 4px 0 0;
`
const EmptyBlock = styled.div`
  width: ${props => props.width};
  border-bottom: 1px solid #007fad;
`

export default inject('Stores')(observer(DescriptionField))
