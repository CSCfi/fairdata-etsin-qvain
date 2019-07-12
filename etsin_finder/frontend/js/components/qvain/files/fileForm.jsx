import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import {
  SaveButton,
  CancelButton
} from '../general/buttons'
import { Label, Input, Textarea, CustomSelect } from '../general/form'
import { FileContainer } from '../general/card'
import ValidationError from '../general/validationError'
import { getLocalizedOptions } from '../utils/getReferenceData'
import {
  fileSchema,
  fileTitleSchema,
  fileDescriptionSchema,
  fileUseCategorySchema
} from '../utils/formValidation'

class FileForm extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    fileTypesEn: [],
    fileTypesFi: [],
    useCategoriesEn: [],
    useCategoriesFi: [],
    title: this.props.Stores.Qvain.inEdit.title,
    description: this.props.Stores.Qvain.inEdit.description || '',
    useCategory: undefined,
    fileType: undefined,
    fileError: undefined,
    titleError: undefined,
    descriptionError: undefined,
    useCategoryError: undefined
  }

  componentDidMount = () => {
    getLocalizedOptions('file_type').then(translations => {
      this.setState((state, props) => ({
        fileTypesEn: translations.en,
        fileTypesFi: translations.fi,
        fileType: translations[props.Stores.Locale.lang].find(opt =>
          opt.value === this.props.Stores.Qvain.inEdit.fileType
        )
      }))
    })
    getLocalizedOptions('use_category').then(translations => {
      this.setState({
        useCategoriesEn: translations.en,
        useCategoriesFi: translations.fi,
        useCategory: getUseCategory(translations.fi, translations.en, this.props.Stores)
      })
    })
  }

  handleCancel = (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.setInEdit(undefined)
  }

  handleChangeUse = (selectedOption) => {
    this.setState({
      useCategory: selectedOption,
      useCategoryError: undefined
    })
  }

  handleChangeFileType = (selectedOption) => {
    this.setState({
      fileType: selectedOption
    })
  }

  handleSave = (event) => {
    event.preventDefault()
    const {
      title,
      description,
      useCategory,
      fileType
    } = this.state
    const validationObj = {
      title,
      description,
      useCategory,
      fileType
    }
    fileSchema.validate(validationObj).then(() => {
      this.setState({
        fileError: undefined,
        useCategoryError: undefined
      })
      const file = this.props.Stores.Qvain.inEdit
      file.title = title
      file.description = description
      file.useCategory = useCategory.value
      file.fileType = fileType ? fileType.value : undefined
      this.props.Stores.Qvain.setInEdit(undefined) // close form after saving
    }).catch(err => {
      this.setState({
        fileError: err.errors
      })
    })
  }

  getFormatVersions = (fileFormat) => {
    if (fileFormat !== undefined) {
      return this.state.formatVersions.get(fileFormat.value)
    }
    return []
  }

  handleOnBlur = (validator, value, errorSet) => {
    validator.validate(value).then(() => errorSet(undefined)).catch(err => errorSet(err.errors))
  }

  handleTitleBlur = () => {
    this.handleOnBlur(fileTitleSchema, this.state.title, value => this.setState({ titleError: value }))
  }

  handleDescriptionBlur = () => {
    this.handleOnBlur(fileDescriptionSchema, this.state.description, value => this.setState({ descriptionError: value }))
  }

  handleUseCategoryBlur = () => {
    this.handleOnBlur(
      fileUseCategorySchema,
      this.state.useCategory ? this.state.useCategory.value : undefined,
      value => this.setState({ useCategoryError: value })
    )
  }

  render() {
    const { fileError, titleError, descriptionError, useCategoryError } = this.state
    return (
      <Fragment>
        <FileContainer>
          <Label><Translate content="qvain.files.selected.form.title.label" /> *</Label>
          <Translate
            component={Input}
            value={this.state.title}
            onChange={(event) => this.setState({
              title: event.target.value
            })}
            onBlur={this.handleTitleBlur}
            attributes={{ placeholder: 'qvain.files.selected.form.title.placeholder' }}
          />
          {titleError !== undefined && <ValidationError>{titleError}</ValidationError>}
          <Label><Translate content="qvain.files.selected.form.description.label" /> *</Label>
          <Translate
            component={Textarea}
            value={this.state.description}
            onChange={(event) => this.setState({ description: event.target.value })}
            onBlur={this.handleDescriptionBlur}
            attributes={{ placeholder: 'qvain.files.selected.form.description.placeholder' }}
          />
          {descriptionError !== undefined && <ValidationError>{descriptionError}</ValidationError>}
          <Label><Translate content="qvain.files.selected.form.use.label" /> *</Label>
          <Translate
            component={CustomSelect}
            value={this.state.useCategory}
            options={
              this.props.Stores.Locale.lang === 'en'
              ? this.state.useCategoriesEn
              : this.state.useCategoriesFi
            }
            onChange={this.handleChangeUse}
            onBlur={this.handleUseCategoryBlur}
            attributes={{ placeholder: 'qvain.files.selected.form.use.placeholder' }}
          />
          {useCategoryError !== undefined && <ValidationError>{useCategoryError}</ValidationError>}
          <Translate
            component={Label}
            content="qvain.files.selected.form.fileType.label"
          />
          <Translate
            component={CustomSelect}
            value={this.state.fileType}
            onChange={this.handleChangeFileType}
            options={
              this.props.Stores.Locale.lang === 'en'
              ? this.state.fileTypesEn
              : this.state.fileTypesFi
            }
            attributes={{ placeholder: 'qvain.files.selected.form.fileType.placeholder' }}
          />
          <Translate
            component={Label}
            style={{ textTransform: 'uppercase' }}
            content="qvain.files.selected.form.identifier.label"
          />
          <p style={{ marginLeft: '10px' }}>{this.props.Stores.Qvain.inEdit.identifier}</p>
          {fileError !== undefined && <ValidationError>{fileError}</ValidationError>}
          <Translate component={CancelButton} onClick={this.handleCancel} content="qvain.common.cancel" />
          <Translate component={SaveButton} onClick={this.handleSave} content="qvain.common.save" />
        </FileContainer>
      </Fragment>
    )
  }
}

const getUseCategory = (fi, en, stores) => {
  let uc
  if (stores.Locale.lang === 'en') {
    uc = en.find(opt => opt.value === stores.Qvain.inEdit.useCategory)
  } else {
    uc = fi.find(opt => opt.value === stores.Qvain.inEdit.useCategory)
  }
  return uc
}

export default inject('Stores')(observer(FileForm))
