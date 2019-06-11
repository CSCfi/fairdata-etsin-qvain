import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import Translate from 'react-translate-component'
import {
  SaveButton,
  CancelButton
} from '../general/buttons'
import { Label, CustomSelect } from '../general/form'
import { Container } from '../general/card'
import ValidationError from '../general/validationError'
import { getLocalizedOptions } from '../utils/getReferenceData';
import { directorySchema, directoryUseCategorySchema } from '../utils/formValidation'

export class DirectoryFormBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    fileTypesEn: [],
    fileTypesFi: [],
    useCategoriesEn: [],
    useCategoriesFi: [],
    useCategory: undefined,
    fileType: undefined,
    directoryError: undefined,
    useCategoryError: undefined
  }

  componentDidMount = () => {
    const { fileCharacteristics } = this.props.Stores.Qvain.inEdit
    getLocalizedOptions('file_type').then(translations => {
      this.setState((state, props) => ({
        fileTypesEn: translations.en,
        fileTypesFi: translations.fi,
        fileType: props.Stores.Locale.lang === 'en' ?
          getFileType(fileCharacteristics, translations.en) :
          getFileType(fileCharacteristics, translations.fi)
      }))
    })
    getLocalizedOptions('use_category').then(translations => {
      this.setState((state, props) => ({
        useCategoriesEn: translations.en,
        useCategoriesFi: translations.fi,
        useCategory: props.Stores.Locale.lang === 'en' ?
          getUseCategory(fileCharacteristics, translations.en) :
          getUseCategory(fileCharacteristics, translations.fi)
      }))
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
    const validationObj = {
      useCategory: this.state.useCategory ? this.state.useCategory.value : undefined,
      fileType: this.state.fileType ? this.state.fileType.value : undefined
    }
    directorySchema.validate(validationObj).then(() => {
      this.setState({
        directoryError: undefined,
        useCategoryError: undefined
      })
      const { inEdit, setDirFileSettings } = this.props.Stores.Qvain
      setDirFileSettings(inEdit, this.state.useCategory.value, this.state.fileType ? this.state.fileType.value : undefined)
      this.props.Stores.Qvain.setInEdit(undefined) // close form after saving
    }).catch(err => {
      this.setState({
        directoryError: err.errors
      })
    })
  }

  handleOnUseCategoryBlur = () => {
    const { useCategory } = this.state
    directoryUseCategorySchema.validate(useCategory).then(() => {
      this.setState({
        useCategoryError: undefined,
        directoryError: undefined
      })
    }).catch(err => {
      this.setState({
        useCategoryError: err.errors
      })
    })
  }

  render() {
    const { directoryError, useCategoryError } = this.state
    return (
      <Fragment>
        <FileContainer>
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
            onBlur={this.handleOnUseCategoryBlur}
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
          {directoryError !== undefined && <ValidationError>{directoryError}</ValidationError>}
          <Translate component={CancelButton} onClick={this.handleCancel} content="qvain.common.cancel" />
          <Translate component={SaveButton} onClick={this.handleSave} content="qvain.common.save" />
        </FileContainer>
      </Fragment>
    )
  }
}

const getUseCategory = (fileCharacteristics, translations) => {
  if (fileCharacteristics !== undefined && fileCharacteristics.useCategory !== undefined) {
    return translations.find(t => t.value === fileCharacteristics.useCategory)
  }
  return translations.find(t => t.value === 'use_category_outcome')
}

const getFileType = (fileCharacteristics, translations) => {
  if (fileCharacteristics !== undefined && fileCharacteristics.fileType !== undefined) {
    return translations.find(t => t.value === fileCharacteristics.fileType)
  }
  return undefined
}

const FileContainer = styled(Container)`
  padding: 35px 24px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  margin-bottom: 69px;
  margin-top: 0px;
`;

export default inject('Stores')(observer(DirectoryFormBase))
