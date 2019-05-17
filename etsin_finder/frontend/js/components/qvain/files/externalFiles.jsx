import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components';
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
import { Input } from '../general/form'
import { FileContainer } from '../general/card'

class ExternalFiles extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    formOpen: false,
    title: '',
    url: '',
    showValidationError: false,
    validationMessage: '',
    inEdit: undefined
  }

  handleToggleForm = (event) => {
    event.preventDefault()
    this.setState((state) => ({
      formOpen: !state.formOpen
    }))
  }

  handleAddResource = (event) => {
    event.preventDefault()
    if (!this.state.url.includes('https://') &&
        !this.state.url.includes('http://')) {
      this.setState({
        showValidationError: true,
        validationMessage: 'URL is in wrong format. Remember to add the full URL (include http or https).'
      })
    } else {
      this.props.Stores.Qvain.saveExternalResource({
        id: undefined,
        title: this.state.title,
        url: this.state.url
      })
      this.setState({
        title: '',
        url: '',
        showValidationError: false,
        validationMessage: ''
      })
    }
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

  editForm = (resource) => {
    return (
      <Fragment>
        <ResourceInput
          type="text"
          placeholder="Title"
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
        />
        <ResourceInput
          type="text"
          placeholder="URL"
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
        />
        {resource === undefined && (<ValidationMessage validatable={undefined} />)}
        {resource === undefined && (<ResourceSave onClick={this.handleAddResource}>{resource ? 'Save' : 'Add'}</ResourceSave>)}
      </Fragment>
    )
  }

  render() {
    const { formOpen, inEdit } = this.state
    return (
      <Fragment>
        <Translate component="p" content="qvain.files.external.help" />
        <FilePickerButtonInverse onClick={this.handleToggleForm}>
          <LinkIcon />
          <Translate component={FilePickerButtonText} content="qvain.files.external.button.label" />
          {formOpen ? <ChevronDown /> : <ChevronRight />}
        </FilePickerButtonInverse>
        <SlidingContent open={formOpen}>
          <p>Added resources</p>
          {this.props.Stores.Qvain.externalResources.map(r => (
            <Fragment key={r.id}>
              <ResourceItem active={isInEdit(inEdit, r)}>
                <ButtonLabel><a target="_blank" rel="noopener noreferrer" href={r.url}>{r.title} / {r.url}</a></ButtonLabel>
                <EditButton onClick={this.handleEditResource(r.id)} />
                <DeleteButton onClick={this.handleRemoveResource(r.id)} />
              </ResourceItem>
              {isInEdit(inEdit, r) && <ResourceContainer>{this.editForm(r)}</ResourceContainer>}
            </Fragment>
          ))}
          {this.editForm(undefined)}
        </SlidingContent>
      </Fragment>
    )
  }
}

const isInEdit = (inEdit, resource) => (inEdit !== undefined) && inEdit.url === resource.url

const slide = keyframes`
  from {
    transform: translate(0, -100px);
    opacity: 0;
    z-index: -1;
  }
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
`;

const SlidingContent = styled.div`
  padding-top: 20px;
  position: relative;
  flex: auto;
  width: 100%;
  animation: ${slide} .2s ease-in;
  ${props => (
    props.open ?
      `
      display: inline-block;
      `
      :
      `
      display: none;
      `
  )}
`;

const ValidationMessage = styled.p`
  color: red;
  ${props => (props.show ? 'diplay: inherit;' : 'display: none;')}
`;

const ResourceInput = styled(Input)`
  width: 40%;
  margin-right: 20px;
`;

const ResourceSave = styled(SaveButton)`
  width: 10%;
`;

const ResourceItem = styled(FileItem)`
  margin-bottom: ${props => (props.active ? '0' : '30px')}
`

const ResourceContainer = styled(FileContainer)`
  margin-bottom: 20px;
`;

export default inject('Stores')(observer(ExternalFiles))
