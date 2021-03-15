import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { SaveButton, CancelButton } from '../../../general/buttons'
import { Label, Input, Textarea, CustomSelect } from '../../../general/modal/form'
import { FileContainer } from '../../../general/card'
import ValidationError from '../../../general/errors/validationError'
import { getLocalizedOptions } from '../../../utils/getReferenceData'
import {
  fileSchema,
  fileTitleSchema,
  fileDescriptionSchema,
  fileUseCategorySchema,
} from '../../../utils/formValidation'
import { withStores } from '../../../utils/stores'

class FileForm extends Component {
  inEdit = this.props.Stores.Qvain.inEdit

  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  state = {
    fileTypesEn: [],
    fileTypesFi: [],
    useCategoriesEn: [],
    useCategoriesFi: [],
    title: this.inEdit.title,
    description: this.inEdit.description,
    useCategory: undefined,
    fileType: undefined,
    fileError: undefined,
    titleError: undefined,
    descriptionError: undefined,
    useCategoryError: undefined,
  }

  componentDidMount = () => {
    this.promises.push(
      getLocalizedOptions('file_type')
        .then(translations => {
          this.setState((state, props) => ({
            fileTypesEn: translations.en,
            fileTypesFi: translations.fi,
            fileType: translations[props.Stores.Locale.lang].find(
              opt => opt.value === this.props.Stores.Qvain.inEdit.fileType
            ),
          }))
        })
        .catch(error => {
          console.error(error)
        })
    )
    this.promises.push(
      getLocalizedOptions('use_category')
        .then(translations => {
          this.setState({
            useCategoriesEn: translations.en,
            useCategoriesFi: translations.fi,
            useCategory: getUseCategory(translations.fi, translations.en, this.props.Stores),
          })
        })
        .catch(error => {
          console.error(error)
        })
    )
  }

  componentWillUnmount() {
    this.promises.forEach(promise => promise && promise.cancel && promise.cancel())
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

  handleChangeFileType = selectedOption => {
    this.setState({
      fileType: selectedOption,
    })
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
    fileSchema
      .validate(validationObj)
      .then(() => {
        this.setState({
          fileError: undefined,
          useCategoryError: undefined,
        })
        const file = this.props.Stores.Qvain.inEdit
        file.title = title
        file.description = description
        file.useCategory = useCategory.value
        file.fileType = fileType ? fileType.value : undefined
        this.props.Stores.Qvain.setInEdit(undefined) // close form after saving
      })
      .catch(err => {
        this.setState({
          fileError: err.errors,
        })
      })
  }

  handleEditMetadata = event => {
    event.preventDefault()
    this.props.Stores.Qvain.setMetadataModalFile(this.props.Stores.Qvain.inEdit)
  }

  handleOnBlur = (validator, value, errorSet) => {
    validator
      .validate(value)
      .then(() => errorSet(undefined))
      .catch(err => errorSet(err.errors))
  }

  handleTitleBlur = () => {
    this.handleOnBlur(fileTitleSchema, this.state.title, value =>
      this.setState({ titleError: value })
    )
  }

  handleDescriptionBlur = () => {
    this.handleOnBlur(fileDescriptionSchema, this.state.description, value =>
      this.setState({ descriptionError: value })
    )
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
    const { readonly, inEdit } = this.props.Stores.Qvain
    return (
      <>
        <FileContainer className={this.props.className}>
          <Label>
            <Translate content="qvain.files.selected.form.title.label" /> *
          </Label>
          <Translate
            component={Input}
            disabled={readonly}
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
            <Translate content="qvain.files.selected.form.description.label" /> *
          </Label>
          <Translate
            component={Textarea}
            disabled={readonly}
            value={this.state.description}
            onChange={event => this.setState({ description: event.target.value })}
            onBlur={this.handleDescriptionBlur}
            attributes={{ placeholder: 'qvain.files.selected.form.description.placeholder' }}
          />
          {descriptionError !== undefined && <ValidationError>{descriptionError}</ValidationError>}
          <Row>
            <div>
              <Label>
                <Translate content="qvain.files.selected.form.use.label" /> *
              </Label>
              <Translate
                component={CustomSelect}
                isDisabled={readonly}
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
              {useCategoryError !== undefined && (
                <ValidationError>{useCategoryError}</ValidationError>
              )}
            </div>
            <div>
              <Label>
                <Translate component={Label} content="qvain.files.selected.form.fileType.label" />
              </Label>
              <Translate
                component={CustomSelect}
                isDisabled={readonly}
                value={this.state.fileType}
                onChange={this.handleChangeFileType}
                options={
                  this.props.Stores.Locale.lang === 'en'
                    ? this.state.fileTypesEn
                    : this.state.fileTypesFi
                }
                attributes={{ placeholder: 'qvain.files.selected.form.fileType.placeholder' }}
              />
            </div>
          </Row>
          <Translate
            component={Label}
            style={{ textTransform: 'uppercase' }}
            content="qvain.files.selected.form.identifier.label"
          />
          <p style={{ marginLeft: '10px' }}>{inEdit.identifier}</p>
          {fileError !== undefined && <ValidationError>{fileError}</ValidationError>}
          <Buttons>
            <Translate
              component={CancelButton}
              onClick={this.handleCancel}
              content="qvain.common.cancel"
            />
            <Translate
              component={SaveButton}
              onClick={this.handleSave}
              content="qvain.common.save"
              disabled={readonly}
            />
            <Translate
              component={EditMetadataButton}
              onClick={this.handleEditMetadata}
              content="qvain.files.metadataModal.buttons.show"
            />
          </Buttons>
        </FileContainer>
      </>
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

const EditMetadataButton = styled(SaveButton)`
  border-radius: 4px;
  border: solid 1px #007fad;
  background-color: #007fad;
  &:hover {
    background-color: #00639a;
  }
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  flex-grow: 1;
  margin-left: 0.25rem;
  padding: 10px 25px;
`

export default withStores(observer(FileForm))
