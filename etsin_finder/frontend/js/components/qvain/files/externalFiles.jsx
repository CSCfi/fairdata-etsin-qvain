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
  SaveButton,
  FileItem,
  EditButton,
  DeleteButton,
  ButtonLabel
} from '../general/buttons'
import { Input, SelectedFilesTitle, Label } from '../general/form'
import { FileContainer, SlidingContent } from '../general/card'

export class ExternalFilesBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    title: '',
    url: '',
    inEdit: undefined
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

  handleAddResource = (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.saveExternalResource({
      id: undefined,
      title: this.state.title,
      url: this.state.url
    })
    this.setState({
      title: '',
      url: ''
    })
  }

  handleRemoveResource = (resourceId) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.removeExternalResource(resourceId)
  }

  handleEditResource = (resourceId) => (event) => {
    event.preventDefault()
    const inEdit = this.props.Stores.Qvain.externalResources.find(r => r.id === resourceId)
    this.setState({ inEdit })
  }

  handleCloseEdit = (event) => {
    event.preventDefault()
    this.setState({ inEdit: undefined })
  }

  editForm = (resource) => (
    <Fragment>
      <Translate
        component={Label}
        content="qvain.files.external.form.title.label"
      />
      <Translate
        component={ResourceInput}
        type="text"
        value={resource ? resource.title : this.state.title}
        onChange={(event) => {
          if (resource !== undefined) {
            resource.title = event.target.value
          } else {
            this.setState({
              title: event.target.value
            })
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
        value={resource ? resource.url : this.state.url}
        onChange={(event) => {
          if (resource !== undefined) {
            resource.url = event.target.value
          } else {
            this.setState({
              url: event.target.value
            })
          }
        }}
        attributes={{ placeholder: 'qvain.files.external.form.url.placeholder' }}
      />
      <Translate
        component={ResourceSave}
        onClick={resource ? this.handleCloseEdit : this.handleAddResource}
        content={resource ?
          'qvain.files.external.form.save.label' : 'qvain.files.external.form.add.label'
        }
      />
    </Fragment>
  )

  render() {
    const { inEdit } = this.state
    const { externalResources, extResFormOpen } = this.props.Stores.Qvain
    return (
      <Fragment>
        <Translate component="p" content="qvain.files.external.help" />
        <FilePickerButtonInverse onClick={this.handleToggleForm}>
          <LinkIcon />
          <Translate component={FilePickerButtonText} content="qvain.files.external.button.label" />
          {extResFormOpen ? <ChevronDown /> : <ChevronRight />}
        </FilePickerButtonInverse>
        <SlidingContent open={extResFormOpen}>
          <Translate component={SelectedFilesTitle} content="qvain.files.external.addedResources.title" />
          {externalResources.length === 0 &&
            <Translate component="p" content="qvain.files.external.addedResources.none" />
          }
          {externalResources.map(r => (
            <Fragment key={r.id}>
              <ResourceItem active={isInEdit(inEdit, r)}>
                <ButtonLabel><a target="_blank" rel="noopener noreferrer" href={r.url}>{r.title} / {r.url}</a></ButtonLabel>
                <EditButton
                  onClick={isInEdit(inEdit, r) ? this.handleCloseEdit : this.handleEditResource(r.id)}
                />
                <DeleteButton onClick={this.handleRemoveResource(r.id)} />
              </ResourceItem>
              {isInEdit(inEdit, r) && <ResourceContainer>{this.editForm(r)}</ResourceContainer>}
            </Fragment>
          ))}
          <ResourceForm>{this.editForm(undefined)}</ResourceForm>
        </SlidingContent>
      </Fragment>
    )
  }
}

const isInEdit = (inEdit, resource) => (inEdit !== undefined) && inEdit.url === resource.url

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
