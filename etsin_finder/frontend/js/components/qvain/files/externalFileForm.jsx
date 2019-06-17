import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Input, Label, CustomSelect } from '../general/form'
import { SaveButton, FileItem } from '../general/buttons'
import ValidationError from '../general/validationError'
import { externalResourceSchema, externalResourceUrlSchema } from '../utils/formValidation'
import { getLocalizedOptions } from '../utils/getReferenceData'

export class ExternalEditFormBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    isEditForm: PropTypes.bool,
  }

  static defaultProps = {
    isEditForm: false,
  }

  state = {
    useCategoriesEn: [],
    useCategoriesFi: [],
    title: '',
    url: '',
    useCategory: '',
    resourceError: undefined,
    urlError: undefined,
  }

  componentDidMount = () => {
    getLocalizedOptions('use_category').then(translations => {
      this.setState({
        useCategoriesEn: translations.en,
        useCategoriesFi: translations.fi,
      })
    })
  }

  getUseCategory = (fi, en, stores) => {
    let uc
    if (stores.Locale.lang === 'en') {
      uc = en.find(opt => opt.value === stores.Qvain.inEdit.useCategory)
    } else {
      uc = fi.find(opt => opt.value === stores.Qvain.inEdit.useCategory)
    }
    return uc
  }

  handleChangeUse = selectedOption => {
    this.setState({
      useCategory: selectedOption,
    })
  }

  handleOnUrlBlur = () => {
    const resource = this.props.Stores.Qvain.resourceInEdit
    externalResourceUrlSchema
      .validate(resource ? resource.url : this.state.url)
      .then(() => {
        this.setState({ urlError: undefined, resourceError: undefined })
      })
      .catch(err => {
        this.setState({ urlError: err.errors })
      })
  }

  handleAddResource = event => {
    event.preventDefault()
    const externalResource = {
      id: undefined,
      title: this.state.title,
      url: this.state.url,
      useCategory: this.state.useCategory,
    }
    return externalResourceSchema
      .validate(externalResource)
      .then(() => {
        this.props.Stores.Qvain.saveExternalResource(externalResource)
        this.setState({
          title: '',
          url: '',
          useCategory: '',
          urlError: undefined,
          resourceError: undefined,
        })
        // close IDA picker if it is open since after adding resources user
        // shouldn't be able to add IDA files or directories
        if (this.props.Stores.Qvain.idaPickerOpen) {
          this.props.Stores.Qvain.idaPickerOpen = false
        }
      })
      .catch(err => {
        this.setState({ resourceError: err.errors })
      })
  }

  handleCloseEdit = event => {
    event.preventDefault()
    this.props.Stores.Qvain.resetInEditResource()
  }

  render() {
    const resource = this.props.Stores.Qvain.resourceInEdit
    const { isEditForm } = this.props
    return (
      <Fragment>
        <Translate component={Label} content="qvain.files.external.form.title.label" />
        <Translate
          component={ResourceInput}
          type="text"
          id="titleInput"
          value={isEditForm ? resource.title : this.state.title}
          onChange={event => {
            if (isEditForm) {
              resource.title = event.target.value
            } else {
              this.setState({ title: event.target.value })
            }
          }}
          attributes={{ placeholder: 'qvain.files.external.form.title.placeholder' }}
        />
        <Translate component={Label} content="qvain.files.external.form.useCategory.label" />
        <Translate
          component={CustomSelect}
          value={this.state.useCategory}
          options={
            this.props.Stores.Locale.lang === 'en'
              ? this.state.useCategoriesEn
              : this.state.useCategoriesFi
          }
          onChange={this.handleChangeUse}
          attributes={{ placeholder: 'qvain.files.external.form.useCategory.placeholder' }}
        />
        <Translate component={Label} content="qvain.files.external.form.url.label" />
        <Translate
          component={ResourceInput}
          type="text"
          id="urlInput"
          value={isEditForm ? resource.url : this.state.url}
          onChange={event => {
            if (isEditForm) {
              resource.url = event.target.value
            } else {
              this.setState({ url: event.target.value })
            }
          }}
          onBlur={this.handleOnUrlBlur}
          attributes={{ placeholder: 'qvain.files.external.form.url.placeholder' }}
        />
        {this.state.urlError !== undefined && (
          <ValidationError>{this.state.urlError}</ValidationError>
        )}
        {this.state.resourceError !== undefined && (
          <ValidationError>{this.state.resourceError}</ValidationError>
        )}
        <Translate
          component={ResourceSave}
          onClick={isEditForm ? this.handleCloseEdit : this.handleAddResource}
          content={
            isEditForm
              ? 'qvain.files.external.form.save.label'
              : 'qvain.files.external.form.add.label'
          }
        />
      </Fragment>
    )
  }
}

export const ResourceInput = styled(Input)`
  width: 100%;
`

export const ResourceSave = styled(SaveButton)`
  margin-left: 0;
`

export const ResourceItem = styled(FileItem)`
  margin-bottom: ${props => (props.active ? '0' : '10px')};
`

export default inject('Stores')(observer(ExternalEditFormBase))
