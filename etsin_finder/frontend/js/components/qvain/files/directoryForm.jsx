import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { SaveButton, CancelButton } from '../general/buttons'
import { Label, CustomSelect, Input, Textarea } from '../general/form'
import { Container } from '../general/card'
import ValidationError from '../general/validationError'
import { getLocalizedOptions } from '../utils/getReferenceData'
import {
  directorySchema,
  directoryTitleSchema,
  directoryDescriptionSchema,
  directoryUseCategorySchema,
} from '../utils/formValidation'

export class DirectoryFormBase extends Component {
  inEdit = this.props.Stores.Qvain.inEdit

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    title: this.inEdit.title,
    description: this.inEdit.description,
    useCategoriesEn: [],
    useCategoriesFi: [],
    useCategory: undefined,
    directoryError: undefined,
    titleError: undefined,
    descriptionError: undefined,
    useCategoryError: undefined,
  }

  componentDidMount = () => {
    const { inEdit } = this.props.Stores.Qvain
    getLocalizedOptions('use_category').then(translations => {
      this.setState((state, props) => ({
        useCategoriesEn: translations.en,
        useCategoriesFi: translations.fi,
        useCategory:
          props.Stores.Locale.lang === 'en'
            ? getUseCategory(inEdit, translations.en)
            : getUseCategory(inEdit, translations.fi),
      }))
    })
  }

  handleCancel = event => {
    event.preventDefault()
    this.props.Stores.Qvain.setInEdit(undefined)
  }

  handleChangeUse = selectedOption => {
    this.setState({
      useCategory: selectedOption,
      useCategoryError: undefined,
    })
  }

  handleSave = event => {
    event.preventDefault()
    const { title, description, useCategory } = this.state
    const validationObj = {
      title,
      description,
      useCategory,
    }
    directorySchema
      .validate(validationObj)
      .then(() => {
        this.setState({
          directoryError: undefined,
          useCategoryError: undefined,
        })
        const { inEdit, setDirFileSettings } = this.props.Stores.Qvain
        setDirFileSettings(inEdit, this.state.title, this.state.description, this.state.useCategory.value)
        this.props.Stores.Qvain.setInEdit(undefined) // close form after saving
      })
      .catch(err => {
        this.setState({
          directoryError: err.errors,
        })
      })
  }

  handleOnBlur = (validator, value, errorSet) => {
    validator.validate(value).then(() => errorSet(undefined)).catch(err => errorSet(err.errors))
  }

  handleTitleBlur = () => {
    this.handleOnBlur(directoryTitleSchema, this.state.title, value =>
      this.setState({ titleError: value })
    )
  }

  handleDescriptionBlur = () => {
    this.handleOnBlur(directoryDescriptionSchema, this.state.description, value =>
      this.setState({ descriptionError: value })
    )
  }

  handleOnUseCategoryBlur = () => {
    const { useCategory } = this.state
    directoryUseCategorySchema
      .validate(useCategory)
      .then(() => {
        this.setState({
          useCategoryError: undefined,
          directoryError: undefined,
        })
      })
      .catch(err => {
        this.setState({
          useCategoryError: err.errors,
        })
      })
  }

  render() {
    const { titleError, descriptionError, directoryError, useCategoryError } = this.state
    return (
      <Fragment>
        <FileContainer>
          <Label>
            <Translate content="qvain.files.selected.form.title.label" /> *
          </Label>
          <Translate
            component={Input}
            value={this.state.title}
            onChange={event =>
              this.setState({
                title: event.target.value,
              })
            }
            onBlur={this.handleTitleBlur}
            attributes={{ placeholder: 'qvain.files.selected.form.title.placeholder' }}
          />
          {titleError !== undefined && <ValidationError>{titleError}</ValidationError>}
          <Label>
            <Translate content="qvain.files.selected.form.description.label" />
          </Label>
          <Translate
            component={Textarea}
            value={this.state.description}
            onChange={event => this.setState({ description: event.target.value })}
            onBlur={this.handleDescriptionBlur}
            attributes={{ placeholder: 'qvain.files.selected.form.description.placeholder' }}
          />
          {descriptionError !== undefined && <ValidationError>{descriptionError}</ValidationError>}
          <Label>
            <Translate content="qvain.files.selected.form.use.label" /> *
          </Label>
          <Translate
            component={CustomSelect}
            value={this.state.useCategory}
            options={
              this.props.Stores.Locale.lang === 'en'
                ? this.state.useCategoriesEn
                : this.state.useCategoriesFi
            }
            onChange={this.handleChangeUse}
            onBlur={this.handleOnUseCategoryBlur}
            attributes={{ placeholder: 'qvain.files.selected.form.use.placeholder' }}
          />
          {useCategoryError !== undefined && <ValidationError>{useCategoryError}</ValidationError>}
          {directoryError !== undefined && <ValidationError>{directoryError}</ValidationError>}
          <Translate
            component={CancelButton}
            onClick={this.handleCancel}
            content="qvain.common.cancel"
          />
          <Translate component={SaveButton} onClick={this.handleSave} content="qvain.common.save" />
        </FileContainer>
      </Fragment>
    )
  }
}

const getUseCategory = (directory, translations) =>
  translations.find(opt => opt.value === directory.useCategory)

const FileContainer = styled(Container)`
  padding: 35px 24px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  margin-bottom: 69px;
  margin-top: 0px;
`

export default inject('Stores')(observer(DirectoryFormBase))
