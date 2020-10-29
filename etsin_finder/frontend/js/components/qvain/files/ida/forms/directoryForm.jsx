import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { SaveButton, CancelButton } from '../../../general/buttons'
import { Label, CustomSelect, Input, Textarea } from '../../../general/modal/form'
import { Container } from '../../../general/card'
import ValidationError from '../../../general/errors/validationError'
import { getLocalizedOptions } from '../../../utils/getReferenceData'
import {
  directorySchema,
  directoryTitleSchema,
  directoryDescriptionSchema,
  directoryUseCategorySchema,
} from '../../../utils/formValidation'
import { withStores } from '../../../utils/stores'

export class DirectoryFormBase extends Component {
  inEdit = this.props.Stores.Qvain.Files.inEdit

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    className: PropTypes.string,
    setChanged: PropTypes.func.isRequired,
    requestClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    className: '',
  }

  state = {
    title: this.inEdit.title || this.inEdit.name,
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
    const { inEdit } = this.props.Stores.Qvain.Files
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
    this.props.requestClose()
  }

  updateValues = values => {
    this.setState(values)
    this.props.setChanged(true)
  }

  handleChangeUse = selectedOption => {
    this.setState({
      useCategory: selectedOption,
      useCategoryError: undefined,
    })
    this.props.setChanged(true)
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
        this.props.Stores.Qvain.Files.applyInEdit({
          title,
          description,
          useCategory: useCategory.value,
        })
      })
      .catch(err => {
        this.setState({
          directoryError: err.errors,
        })
      })
  }

  handleOnBlur = (validator, value, errorSet) => {
    validator
      .validate(value)
      .then(() => errorSet(undefined))
      .catch(err => errorSet(err.errors))
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
    const { readonly } = this.props.Stores.Qvain
    const { titleError, descriptionError, directoryError, useCategoryError } = this.state
    return (
      <DirectoryContainer className={this.props.className}>
        <Label>
          <Translate content="qvain.files.selected.form.title.label" /> *
        </Label>
        <Translate
          component={Input}
          value={this.state.title}
          disabled={readonly}
          onChange={event =>
            this.updateValues({
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
          disabled={readonly}
          onChange={event =>
            this.updateValues({
              description: event.target.value,
            })
          }
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
          isDisabled={readonly}
          options={
            this.props.Stores.Locale.lang === 'en'
              ? this.state.useCategoriesEn
              : this.state.useCategoriesFi
          }
          onChange={this.handleChangeUse}
          onBlur={this.handleOnUseCategoryBlur}
          menuPlacement="auto"
          menuPosition="fixed"
          menuShouldScrollIntoView={false}
          attributes={{ placeholder: 'qvain.files.selected.form.use.placeholder' }}
        />
        {useCategoryError !== undefined && <ValidationError>{useCategoryError}</ValidationError>}
        {directoryError !== undefined && <ValidationError>{directoryError}</ValidationError>}
        <Buttons>
          <Translate
            component={CancelButton}
            onClick={this.handleCancel}
            content="qvain.common.cancel"
          />
          <Translate
            component={SaveButton}
            disabled={readonly}
            onClick={this.handleSave}
            content="qvain.common.save"
          />
        </Buttons>
      </DirectoryContainer>
    )
  }
}

const DirectoryContainer = styled(Container)`
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
`

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  * {
    margin: 0.25rem;
    flex-grow: 1;
  }
  margin: -0.25rem;
`

const getUseCategory = (directory, translations) =>
  translations.find(opt => opt.value === directory.useCategory)

export default withStores(observer(DirectoryFormBase))
