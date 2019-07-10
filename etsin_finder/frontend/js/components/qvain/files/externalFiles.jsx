import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import Translate from 'react-translate-component'
import {
  FilePickerButtonInverse,
  FilePickerButtonText,
  LinkIcon,
  ChevronRight,
  ChevronDown,
  ButtonGroup,
  SaveButton,
  FileItem,
  EditButton,
  DeleteButton,
  ButtonLabel
} from '../general/buttons'
import { EmptyExternalResource } from '../../../stores/view/qvain'
import { Input, SelectedFilesTitle } from '../general/form'
import { FileContainer, SlidingContent } from '../general/card'
import ExternalFileForm from './externalFileForm'
import { externalResourceUrlSchema } from '../utils/formValidation'

export class ExternalFilesBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  handleToggleForm = (event) => {
    event.preventDefault()
    const { extResFormOpen } = this.props.Stores.Qvain
    if (extResFormOpen) {
      this.props.Stores.Qvain.extResFormOpen = false
    } else {
      this.props.Stores.Qvain.extResFormOpen = true
      this.props.Stores.Qvain.idaPickerOpen = false
    }
  }

  verifyURL = () => {
    const resource = this.props.Stores.Qvain.externalResourceInEdit
    externalResourceUrlSchema
      .validate(resource.url)
      .then(() => {
        this.props.Stores.Qvain.resetInEditResource()  
      })
      .catch(err => {
        console.log(err)
      }) 
  }

  /* handleRemoveResource = (resourceId) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.removeExternalResource(resourceId)
  }

  handleEditResource = (resourceId) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.setResourceInEdit(resourceId)
  } */

  /* handleCloseEdit = (event) => {
    event.preventDefault()
    this.verifyURL();
  } */

  handleEditExternalResource = (externalResource) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.editExternalResource(externalResource)
  }

  handleRemoveExternalResource = (externalResource) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.removeExternalResource(externalResource)
    this.props.Stores.Qvain.editExternalResource(EmptyExternalResource)
  }

  render() {
    const { externalResourceInEdit } = this.props.Stores.Qvain
    const { externalResources, extResFormOpen, selectedFiles, selectedDirectories } = this.props.Stores.Qvain
    const hasIDAItems = [...selectedFiles, ...selectedDirectories].length > 0
    return (
      <Fragment>
        <Translate component="p" content="qvain.files.external.help" />
        <FilePickerButtonInverse disabled={hasIDAItems} onClick={this.handleToggleForm}>
          <LinkIcon />
          <Translate component={FilePickerButtonText} content="qvain.files.external.button.label" />
          {extResFormOpen ? <ChevronDown /> : <ChevronRight />}
        </FilePickerButtonInverse>
        <SlidingContent open={extResFormOpen}>
          <Translate component={SelectedFilesTitle} content="qvain.files.external.addedResources.title" />
          {this.props.Stores.Qvain.addedExternalResources.length === 0 &&
            <Translate component="p" content="qvain.files.external.addedResources.none" />
          }
          {this.props.Stores.Qvain.addedExternalResources.map((addedExternalResource) => (
            <ButtonGroup key={addedExternalResource.id}>
              <ButtonLabel>
                {addedExternalResource.title} / {addedExternalResource.url}
              </ButtonLabel>
              <EditButton
                // onClick={isInEdit(externalResourceInEdit, r) ? this.handleCloseEdit : this.handleEditExternalResource(r.id)}
                onClick={this.handleEditExternalResource(addedExternalResource)}
              />
              <DeleteButton
              // onClick={this.handleRemoveResource(r.id)}
                onClick={this.handleRemoveExternalResource(addedExternalResource)}
              />
            </ButtonGroup>
            ))}
            <ExternalFileForm />
        </SlidingContent>
      </Fragment>
    )
  }
}

const isInEdit = (inEdit, resource) => (inEdit !== undefined) && inEdit.id === resource.id

export const ResourceInput = styled(Input)`
  width: 100%;
`;

export const ResourceSave = styled(SaveButton)`
  margin-left: 0;
`;

export const ResourceItem = styled(FileItem)`
  margin-bottom: ${props => (props.active ? '0' : '10px')}
`

const ResourceContainer = styled(FileContainer)`
  margin-bottom: 20px;
`;

const ResourceForm = styled.div`
  padding-top: 20px;
`;

export default inject('Stores')(observer(ExternalFilesBase))
