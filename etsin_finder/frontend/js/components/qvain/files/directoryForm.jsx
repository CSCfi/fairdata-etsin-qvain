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
import { getLocalizedOptions } from '../utils/getReferenceData';

class DirectoryForm extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    fileTypesEn: [],
    fileTypesFi: [],
    useCategoriesEn: [],
    useCategoriesFi: [],
    useCategory: undefined,
    fileType: undefined
  }

  componentDidMount = () => {
    getLocalizedOptions('file_type').then(translations => {
      this.setState({
        fileTypesEn: translations.en,
        fileTypesFi: translations.fi
      })
    })
    getLocalizedOptions('use_category').then(translations => {
      this.setState((state, props) => ({
        useCategoriesEn: translations.en,
        useCategoriesFi: translations.fi,
        useCategory: props.Stores.Locale.lang === 'en' ?
          translations.en.find(opt => opt.value === 'use_category_outcome') :
          translations.fi.find(opt => opt.value === 'use_category_outcome')
      }))
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
    const { inEdit, setDirFileSettings } = this.props.Stores.Qvain
    setDirFileSettings(inEdit, this.state.useCategory.value, this.state.fileType.value)
    this.props.Stores.Qvain.setInEdit(undefined) // close form after saving
  }

  render() {
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
          <Translate component={CancelButton} onClick={this.handleCancel} content="qvain.common.cancel" />
          <Translate component={SaveButton} onClick={this.handleSave} content="qvain.common.save" />
        </FileContainer>
      </Fragment>
    )
  }
}

const FileContainer = styled(Container)`
  padding: 35px 24px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  margin-bottom: 69px;
  margin-top: 0px;
`;

export default inject('Stores')(observer(DirectoryForm))
