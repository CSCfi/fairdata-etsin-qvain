import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { SaveButton, CancelButton } from '../../../../../general/buttons'
import { Label, Input, Textarea, CustomSelect } from '../../../../../general/modal/form'
import { Container } from '../../../../../general/card'
import { ValidationErrors } from '../../../../../general/errors/validationError'
import { withStores } from '../../../../../utils/stores'

class FileForm extends Component {
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
    fileTypesEn: [],
    fileTypesFi: [],
    useCategoriesEn: [],
    useCategoriesFi: [],
    title: this.inEdit.title || this.inEdit.name,
    description: this.inEdit.description,
    useCategory: undefined,
    fileType: undefined,
    fileError: undefined,
    titleError: undefined,
    descriptionError: undefined,
    useCategoryError: undefined,
  }

  componentDidMount = () => {
    this.props.Stores.Qvain.ReferenceData.getLocalizedOptions('file_type').then(translations => {
      this.setState((state, props) => ({
        fileTypesEn: translations.en,
        fileTypesFi: translations.fi,
        fileType: translations[props.Stores.Locale.lang].find(
          opt => opt.value === this.props.Stores.Qvain.Files.inEdit.fileType
        ),
      }))
    })
    this.props.Stores.Qvain.ReferenceData.getLocalizedOptions('use_category').then(translations => {
      this.setState({
        useCategoriesEn: translations.en,
        useCategoriesFi: translations.fi,
        useCategory: getUseCategory(translations.fi, translations.en, this.props.Stores),
      })
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

  handleChangeFileType = selectedOption => {
    this.setState({
      fileType: selectedOption,
    })
    this.props.setChanged(true)
  }

  handleSave = event => {
    event.preventDefault()
    const { title, description, useCategory, fileType } = this.state
    const validationObj = {
      title,
      description,
      useCategory,
      fileType,
    }
    const { fileSchema } = this.props.Stores.Qvain.Files

    fileSchema
      .validate(validationObj, { strict: true })
      .then(() => {
        this.setState({
          fileError: undefined,
          useCategoryError: undefined,
        })
        this.props.Stores.Qvain.Files.applyInEdit({
          title,
          description,
          useCategory: useCategory.value,
          fileType: (fileType && fileType.value) || undefined,
        })
      })
      .catch(err => {
        this.setState({
          fileError: err.errors,
        })
      })
  }

  getFormatVersions = fileFormat => {
    if (fileFormat !== undefined) {
      return this.state.formatVersions.get(fileFormat.value)
    }
    return []
  }

  handleOnBlur = (validator, value, errorSet) => {
    validator
      .validate(value, { strict: true })
      .then(() => errorSet(undefined))
      .catch(err => errorSet(err.errors))
  }

  handleTitleBlur = () => {
    const { fileTitleSchema } = this.props.Stores.Qvain.Files
    this.handleOnBlur(fileTitleSchema, this.state.title, value =>
      this.setState({ titleError: value })
    )
  }

  handleDescriptionBlur = () => {
    const { fileDescriptionSchema } = this.props.Stores.Qvain.Files
    this.handleOnBlur(fileDescriptionSchema, this.state.description, value =>
      this.setState({ descriptionError: value })
    )
  }

  handleUseCategoryBlur = () => {
    const { fileUseCategorySchema } = this.props.Stores.Qvain.Files
    this.handleOnBlur(
      fileUseCategorySchema,
      this.state.useCategory ? this.state.useCategory : undefined,
      value => this.setState({ useCategoryError: value })
    )
  }

  render() {
    const { inEdit } = this.props.Stores.Qvain.Files
    if (!inEdit) {
      return null
    }

    const { readonly } = this.props.Stores.Qvain
    const { fileError, titleError, descriptionError, useCategoryError } = this.state

    return (
      <FileContainer className={this.props.className}>
        <Translate
          component={Label}
          disabled={readonly}
          style={{ textTransform: 'uppercase' }}
          content="qvain.files.selected.form.identifier.label"
        />
        <p style={{ marginLeft: '10px' }}>{inEdit.identifier}</p>
        <Label htmlFor="file-form-title">
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
          id="file-form-title"
        />
        {titleError !== undefined && <ValidationErrors errors={titleError} />}
        <Label htmlFor="file-form-description">
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
          id="file-form-description"
        />
        {descriptionError !== undefined && <ValidationErrors errors={descriptionError} />}
        <Row>
          <div>
            <Label htmlFor="file-form-use-category">
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
              onBlur={this.handleUseCategoryBlur}
              menuPlacement="auto"
              menuPosition="fixed"
              menuShouldScrollIntoView={false}
              attributes={{ placeholder: 'qvain.files.selected.form.use.placeholder' }}
              inputId="file-form-use-category"
            />
            {useCategoryError !== undefined && <ValidationErrors errors={useCategoryError} />}
          </div>
          <div>
            <Label htmlFor="file-form-file-type">
              <Translate content="qvain.files.selected.form.fileType.label" />
            </Label>
            <Translate
              component={CustomSelect}
              value={this.state.fileType}
              isDisabled={readonly}
              onChange={this.handleChangeFileType}
              options={
                this.props.Stores.Locale.lang === 'en'
                  ? this.state.fileTypesEn
                  : this.state.fileTypesFi
              }
              menuPlacement="auto"
              menuPosition="fixed"
              menuShouldScrollIntoView={false}
              attributes={{ placeholder: 'qvain.files.selected.form.fileType.placeholder' }}
              inputId="file-form-file-type"
            />
          </div>
        </Row>
        {fileError !== undefined && <ValidationErrors errors={fileError} />}
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
      </FileContainer>
    )
  }
}

const getUseCategory = (fi, en, stores) => {
  let uc
  if (stores.Locale.lang === 'en') {
    uc = en.find(opt => opt.value === stores.Qvain.Files.inEdit.useCategory)
  } else {
    uc = fi.find(opt => opt.value === stores.Qvain.Files.inEdit.useCategory)
  }
  return uc
}

const FileContainer = styled(Container)`
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

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 0.5rem;
`

export default withStores(observer(FileForm))
