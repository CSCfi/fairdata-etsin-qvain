import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
import { SaveButton, CancelButton } from '../../../../../general/buttons'
import { Label, CustomSelect, Input, Textarea } from '../../../../../general/modal/form'

import { Checkbox } from '@/components/qvain/general/modal/form'
import Loader from '@/components/general/loader'

import { Container } from '../../../../../general/card'
import { ValidationErrors } from '../../../../../general/errors/validationError'
import { withStores } from '../../../../../utils/stores'

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
    shouldApplyUseCategoryToChildren: false,
    applyingUseCategory: false,
  }

  componentDidMount = () => {
    const { inEdit } = this.props.Stores.Qvain.Files
    this.props.Stores.Qvain.ReferenceData.getLocalizedOptions('use_category').then(translations => {
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
    const { directorySchema } = this.props.Stores.Qvain.Files

    directorySchema
      .validate(validationObj, { strict: true })
      .then(async () => {
        this.setState(state => ({
          directoryError: undefined,
          useCategoryError: undefined,
          applyingUseCategory: state.shouldApplyUseCategoryToChildren,
        }))
        await this.props.Stores.Qvain.Files.applyInEdit(
          {
            title,
            description,
            useCategory: useCategory.value,
          },
          { applyToChildren: this.state.shouldApplyUseCategoryToChildren }
        )
        this.props.setChanged(false)
      })
      .catch(err => {
        this.setState({
          directoryError: err.errors,
          applyingUseCategory: false,
        })
      })
  }

  handleOnBlur = (validator, value, errorSet) => {
    validator
      .validate(value, { strict: true })
      .then(() => errorSet(undefined))
      .catch(err => errorSet(err.errors))
  }

  handleTitleBlur = () => {
    const { directoryTitleSchema } = this.props.Stores.Qvain.Files
    this.handleOnBlur(directoryTitleSchema, this.state.title, value =>
      this.setState({ titleError: value })
    )
  }

  handleDescriptionBlur = () => {
    const { directoryDescriptionSchema } = this.props.Stores.Qvain.Files
    this.handleOnBlur(directoryDescriptionSchema, this.state.description, value =>
      this.setState({ descriptionError: value })
    )
  }

  handleOnUseCategoryBlur = () => {
    const { directoryUseCategorySchema } = this.props.Stores.Qvain.Files
    const { useCategory } = this.state
    directoryUseCategorySchema
      .validate(useCategory, { strict: true })
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

  toggleShouldApplyUseCategoryToChildren = () => {
    this.setState(state => ({
      shouldApplyUseCategoryToChildren: !state.shouldApplyUseCategoryToChildren,
    }))
  }

  render() {
    const { readonly } = this.props.Stores.Qvain
    const { titleError, descriptionError, directoryError, useCategoryError } = this.state

    return (
      <DirectoryContainer className={this.props.className}>
        <Label htmlFor="directory-form-title">
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
          id="directory-form-title"
        />
        {titleError !== undefined && <ValidationErrors errors={titleError} />}
        <Label htmlFor="directory-form-description">
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
          id="directory-form-description"
        />
        {descriptionError !== undefined && <ValidationErrors errors={descriptionError} />}
        <Label htmlFor="directory-form-use-category">
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
          inputId="directory-form-use-category"
        />

        <CheckboxRow>
          <Checkbox
            id="applyToChildrenCheckbox"
            onChange={this.toggleShouldApplyUseCategoryToChildren}
            disabled={readonly}
            checked={this.state.shouldApplyUseCategoryToChildren}
          />
          <Translate
            content="qvain.files.selected.form.applyUseCategoryToChildren"
            component={CheckboxLabel}
            htmlFor="applyToChildrenCheckbox"
          />
          {this.state.applyingUseCategory && <Loader active size="1.1em" spinnerSize="3px" />}
        </CheckboxRow>

        {useCategoryError !== undefined && <ValidationErrors errors={useCategoryError} />}
        {directoryError !== undefined && <ValidationErrors errors={directoryError} />}
        <Buttons>
          <Translate
            component={CancelButton}
            onClick={this.handleCancel}
            content="qvain.common.cancel"
            disabled={this.state.applyingUseCategory}
          />
          <Translate
            component={SaveButton}
            disabled={readonly || this.state.applyingUseCategory}
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

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: -0.5rem;
  margin-bottom: 1.25rem;
`

const CheckboxLabel = styled.label`
  margin-right: auto;
  padding-left: 4px;
  display: inline-block;
`

const getUseCategory = (directory, translations) =>
  translations.find(opt => opt.value === directory.useCategory)

export default withStores(observer(DirectoryFormBase))
