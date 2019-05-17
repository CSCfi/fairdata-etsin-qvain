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
import { getLocalizedOptions } from '../utils/getReferenceData';

class FileForm extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    fileTypesEn: [],
    fileTypesFi: [],
    useCategoriesEn: [],
    useCategoriesFi: [],
    title: this.props.Stores.Qvain.inEdit.fileCharacteristics.title || 'Couldn\'t get title',
    description: this.props.Stores.Qvain.inEdit.fileCharacteristics.description || 'Couldn\'t get description',
    useCategory: undefined,
    fileType: undefined
  }

  componentDidMount = () => {
    getLocalizedOptions('file_type').then(translations => {
      this.setState({
        fileTypesEn: translations.en,
        fileTypesFi: translations.fi,
        fileType: translations.en.find(opt =>
          opt.value === this.props.Stores.Qvain.inEdit.fileCharacteristics.fileType
        )
      })
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
      useCategory: selectedOption
    })
  }

  handleChangeFileType = (selectedOption) => {
    this.setState({
      fileType: selectedOption
    })
  }

  handleSave = (event) => {
    event.preventDefault()
    const fileCharacteristics = this.props.Stores.Qvain.inEdit.fileCharacteristics
    const {
      title,
      description,
      useCategory,
      fileType
    } = this.state
    fileCharacteristics.title = title
    fileCharacteristics.description = description
    fileCharacteristics.useCategory = useCategory.value
    fileCharacteristics.fileType = fileType ? fileType.value : ''
    this.props.Stores.Qvain.setInEdit(undefined) // close form after saving
  }

  getFormatVersions = (fileFormat) => {
    if (fileFormat !== undefined) {
      return this.state.formatVersions.get(fileFormat.value)
    }
    return []
  }

  render() {
    return (
      <Fragment>
        <FileContainer>
          <Label><Translate content="qvain.files.selected.form.title.label" /> *</Label>
          <Translate
            component={Input}
            value={this.state.title}
            onChange={(event) => this.setState({ title: event.target.value })}
            attributes={{ placeholder: 'qvain.files.selected.form.title.placeholder' }}
          />
          <Label><Translate content="qvain.files.selected.form.description.label" /> *</Label>
          <Translate
            component={Textarea}
            value={this.state.description}
            onChange={(event) => this.setState({ description: event.target.value })}
            attributes={{ placeholder: 'qvain.files.selected.form.description.placeholder' }}
          />
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
            attributes={{ placeholder: 'qvain.files.selected.form.use.placeholder' }}
          />
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
    uc = en.find(opt => opt.value === stores.Qvain.inEdit.fileCharacteristics.useCategory) ||
      en.find(opt => opt.value === 'use_category_outcome')
  } else {
    uc = fi.find(opt => opt.value === stores.Qvain.inEdit.fileCharacteristics.useCategory) ||
      fi.find(opt => opt.value === 'use_category_outcome')
  }
  return uc
}

export default inject('Stores')(observer(FileForm))
