import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Input, Label } from '../general/form'
import {
  SaveButton,
  FileItem
} from '../general/buttons'
import ValidationError from '../general/validationError'
import { externalResourceSchema, externalResourceUrlSchema } from '../utils/formValidation'

export class ExternalEditFormBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    isEditForm: PropTypes.bool
  }

  static defaultProps = {
    isEditForm: false
  }

  state = {
    title: '',
    url: '',
    resourceError: undefined,
    urlError: undefined
  }

  handleOnUrlBlur = () => {
    const resource = this.props.Stores.Qvain.resourceInEdit
    externalResourceUrlSchema.validate(resource ? resource.url : this.state.url).then(() => {
      this.setState({ urlError: undefined, resourceError: undefined })
    }).catch(err => {
      this.setState({ urlError: err.errors })
    })
  }

  handleAddResource = (event) => {
    event.preventDefault()
    const externalResource = {
      id: undefined,
      title: this.state.title,
      url: this.state.url
    }
    return externalResourceSchema.validate(externalResource).then(() => {
      this.props.Stores.Qvain.saveExternalResource(externalResource)
      this.setState({
        title: '',
        url: '',
        urlError: undefined,
        resourceError: undefined
      })
      // close IDA picker if it is open since after adding resources user
      // shouldn't be able to add IDA files or directories
      if (this.props.Stores.Qvain.idaPickerOpen) {
        this.props.Stores.Qvain.idaPickerOpen = false
      }
    }).catch(err => {
      this.setState({ resourceError: err.errors })
    })
  }

  handleCloseEdit = (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.resetInEditResource()
  }

  render() {
    const resource = this.props.Stores.Qvain.resourceInEdit
    const { isEditForm } = this.props
    return (
      <Fragment>
        <Translate
          component={Label}
          content="qvain.files.external.form.title.label"
        />
        <Translate
          component={ResourceInput}
          type="text"
          id="titleInput"
          value={isEditForm ? resource.title : this.state.title}
          onChange={(event) => {
            if (isEditForm) {
              resource.title = event.target.value
            } else {
              this.setState({ title: event.target.value })
            }
          }}
          attributes={{ placeholder: 'qvain.files.external.form.title.placeholder' }}
        />
        <Translate
          component={Label}
          content="qvain.files.external.form.url.label"
        />
        <Translate
          component={ResourceInput}
          type="text"
          id="urlInput"
          value={isEditForm ? resource.url : this.state.url}
          onChange={(event) => {
            if (isEditForm) {
              resource.url = event.target.value
            } else {
              this.setState({ url: event.target.value })
            }
          }}
          onBlur={this.handleOnUrlBlur}
          attributes={{ placeholder: 'qvain.files.external.form.url.placeholder' }}
        />
        {this.state.urlError !== undefined && <ValidationError>{this.state.urlError}</ValidationError>}
        {this.state.resourceError !== undefined && <ValidationError>{this.state.resourceError}</ValidationError>}
        <Translate
          component={ResourceSave}
          onClick={isEditForm ? this.handleCloseEdit : this.handleAddResource}
          content={isEditForm ?
            'qvain.files.external.form.save.label' : 'qvain.files.external.form.add.label'
          }
        />
      </Fragment>
    );
  }
}

export const ResourceInput = styled(Input)`
  width: 100%;
`;

export const ResourceSave = styled(SaveButton)`
  margin-left: 0;
`;

export const ResourceItem = styled(FileItem)`
  margin-bottom: ${props => (props.active ? '0' : '10px')}
`

export default inject('Stores')(observer(ExternalEditFormBase))
