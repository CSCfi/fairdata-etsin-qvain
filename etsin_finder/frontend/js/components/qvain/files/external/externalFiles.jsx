import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import {
  ButtonGroup,
  SaveButton,
  FileItem,
  EditButton,
  DeleteButton,
  ButtonLabel,
  ButtonContainer,
} from '../../general/buttons'
import { EmptyExternalResource } from '../../../../stores/view/qvain'
import { Input, SelectedFilesTitle } from '../../general/modal/form'
import { SlidingContent } from '../../general/card'
import ExternalFileForm from './externalFileForm'
import { externalResourceAccessUrlSchema } from '../../utils/formValidation'

export class ExternalFilesBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  handleToggleForm = () => {
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
    externalResourceAccessUrlSchema
      .validate(resource.accessUrl)
      .then(() => {
        this.props.Stores.Qvain.resetInEditResource()
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleEditExternalResource = externalResource => () => {
    this.props.Stores.Qvain.editExternalResource(externalResource)
  }

  handleRemoveExternalResource = externalResourceId => () => {
    this.props.Stores.Qvain.removeExternalResource(externalResourceId)
    this.props.Stores.Qvain.editExternalResource(EmptyExternalResource)
  }

  parseUrl(resource) {
    // Disable lint rule because this syntax is more readable using concatenation
    /* eslint-disable prefer-template */
    return typeof resource !== 'undefined'
      ? ' / ' + (' / ' + resource.length > 40 ? resource.substring(0, 40).concat('... ') : resource)
      : null
  }

  render() {
    const { addedExternalResources } = this.props.Stores.Qvain
    return (
      <Fragment>
        <Translate component="p" content="qvain.files.external.help" />
        <SlidingContent open>
          <Translate
            tabIndex="0"
            component={SelectedFilesTitle}
            content="qvain.files.external.addedResources.title"
          />
          {addedExternalResources.length === 0 && (
            <Translate
              tabIndex="0"
              component="p"
              content="qvain.files.external.addedResources.none"
            />
          )}
          {addedExternalResources.map(addedExternalResource => (
            <ButtonGroup tabIndex="0" key={addedExternalResource.id}>
              <ButtonLabel>
                {addedExternalResource.title}
                {this.parseUrl(addedExternalResource.accessUrl)}
                {this.parseUrl(addedExternalResource.downloadUrl)}
              </ButtonLabel>
              <ButtonContainer>
                <EditButton
                  aria-label="Edit"
                  type="button"
                  onClick={this.handleEditExternalResource(addedExternalResource)}
                />
                <DeleteButton
                  aria-label="Remove"
                  type="button"
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
`

export const ResourceSave = styled(SaveButton)`
  margin-left: 0;
`

export const ResourceItem = styled(FileItem)`
  margin-bottom: ${props => (props.active ? '0' : '10px')};
`

export default inject('Stores')(observer(ExternalFilesBase))
