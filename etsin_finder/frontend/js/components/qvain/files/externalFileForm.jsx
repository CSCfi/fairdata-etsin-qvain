import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Input, Label, CustomSelect } from '../general/form'
import { SaveButton, CancelButton, FileItem } from '../general/buttons'
import ValidationError from '../general/validationError'
import { externalResourceSchema } from '../utils/formValidation'
import { getLocalizedOptions } from '../utils/getReferenceData'
import { EmptyExternalResource } from '../../../stores/view/qvain'

export class ExternalFileFormBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    useCategories: {
      en: [],
      fi: [],
    },
    title: '',
    url: '',
    useCategory: '',
    externalResourceError: undefined,
  }

  componentDidMount = () => {
    getLocalizedOptions('use_category').then(translations => {
      this.setState({
          useCategories: {
            en: translations.en,
            fi: translations.fi
          }
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

  resetErrorMessages = () => {
    this.setState({
      externalResourceError: undefined,
    })
  }

  handleSaveExternalResource = (event) => {
    event.preventDefault()
    const { Qvain } = this.props.Stores
    const externalResource = toJS(Qvain.externalResourceInEdit)
    externalResourceSchema.validate(externalResource).then(() => {
      Qvain.saveExternalResource(Qvain.externalResourceInEdit)
      Qvain.editExternalResource(EmptyExternalResource)
      this.resetErrorMessages()

      // Close IDA picker if it is open since after adding an externalResources,
      // user shouldn't be able to add IDA files or directories
      if (this.props.Stores.Qvain.idaPickerOpen) {
        this.props.Stores.Qvain.idaPickerOpen = false
      }

    }).catch(err => {
      this.setState({ externalResourceError: err.errors })
    })
  }

  handleCancel = (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.editExternalResource(EmptyExternalResource)
    this.resetErrorMessages()
  }

  render() {
    const externalResource = this.props.Stores.Qvain.externalResourceInEdit
    const { lang } = this.props.Stores.Locale
    const {
      useCategories,
      externalResourceError
    } = this.state
    return (
      <Fragment>
        <Label htmlFor="titleInput">
          <Translate content="qvain.files.external.form.title.label" /> *
        </Label>
        <Translate
          component={ResourceInput}
          type="text"
          id="titleInput"
          value={externalResource.title}
          onChange={(event) => { externalResource.title = event.target.value }}
          attributes={{ placeholder: 'qvain.files.external.form.title.placeholder' }}
        />
        <Label htmlFor="useCategoryInput">
          <Translate content="qvain.files.external.form.useCategory.label" />
        </Label>
        <Translate
          component={CustomSelect}
          id="useCategoryInput"
          value={externalResource.useCategory}
          options={useCategories[lang]}
          onChange={(selection) => {externalResource.useCategory = selection}}
          attributes={{ placeholder: 'qvain.files.external.form.useCategory.placeholder' }}
        />
        <Label htmlFor="urlInput">
          <Translate content="qvain.files.external.form.url.label" /> *
        </Label>
        <Translate
          component={ResourceInput}
          type="text"
          id="urlInput"
          value={externalResource.url}
          onChange={(event) => { externalResource.url = event.target.value }}
          onBlur={this.handleOnUrlBlur}
          attributes={{ placeholder: 'qvain.files.external.form.url.placeholder' }}
        />
        {externalResourceError && <ValidationError>{externalResourceError}</ValidationError>}
        <Translate
          component={CancelButton}
          onClick={this.handleCancel}
          content="qvain.files.external.form.cancel.label"
        />
        <Translate
          component={SaveButton}
          onClick={this.handleSaveExternalResource}
          content={'qvain.files.external.form.save.label'}
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

export default inject('Stores')(observer(ExternalFileFormBase))
