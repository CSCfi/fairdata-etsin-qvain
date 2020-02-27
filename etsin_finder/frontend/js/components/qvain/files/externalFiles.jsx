import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import Translate from 'react-translate-component'
import {
  ButtonGroup,
  SaveButton,
  FileItem,
  EditButton,
  DeleteButton,
  ButtonLabel,
  ButtonContainer
} from '../general/buttons'
import { EmptyExternalResource } from '../../../stores/view/qvain'
import { Input, SelectedFilesTitle } from '../general/form'
import { SlidingContent } from '../general/card'
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

  handleEditExternalResource = (externalResource) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.editExternalResource(externalResource)
  }

  handleRemoveExternalResource = (externalResourceId) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.removeExternalResource(externalResourceId)
    this.props.Stores.Qvain.editExternalResource(EmptyExternalResource)
  }

  render() {
    const { addedExternalResources } = this.props.Stores.Qvain
    return (
      <Fragment>
        <Translate component="p" content="qvain.files.external.help" />
        <SlidingContent open="true">
          <Translate tabIndex="0" component={SelectedFilesTitle} content="qvain.files.external.addedResources.title" />
          {addedExternalResources.length === 0 &&
            <Translate tabIndex="0" component="p" content="qvain.files.external.addedResources.none" />
          }
          {addedExternalResources.map((addedExternalResource) => (
            <ButtonGroup tabIndex="0" key={addedExternalResource.id}>
              <ButtonLabel>
                {addedExternalResource.title} / {addedExternalResource.url.length > 38 ? addedExternalResource.url.substring(0, 38).concat('... ') : addedExternalResource.url} / {addedExternalResource.downloadUrl.length > 38 ? addedExternalResource.downloadUrl.substring(0, 38).concat('... ') : addedExternalResource.downloadUrl}
              </ButtonLabel>
              <ButtonContainer>
                <EditButton
                  aria-label="Edit"
                  onClick={this.handleEditExternalResource(addedExternalResource)}
                />
                <DeleteButton
                  aria-label="Remove"
                  onClick={this.handleRemoveExternalResource(addedExternalResource.id)}
                />
              </ButtonContainer>
            </ButtonGroup>
          ))}
          <ExternalFileForm />
        </SlidingContent>
      </Fragment>
    )
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

export default inject('Stores')(observer(ExternalFilesBase));
