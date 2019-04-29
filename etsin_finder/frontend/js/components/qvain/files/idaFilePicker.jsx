import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFolder } from '@fortawesome/free-solid-svg-icons'
import {
  FilePickerButton,
  FileIcon,
  FilePickerButtonText,
  ChevronIcon
} from '../general/buttons'
import { Checkbox } from '../general/form'
import Modal from '../../general/modal'

class IDAFilePicker extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    idaModalOpen: false
  }

  componentDidMount() {
    this.props.Stores.Qvain.getInitialDirectories()
  }

  handleOpenModal = (event) => {
    event.preventDefault()
    this.setState({ idaModalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({ idaModalOpen: false })
  }

  handleChangeDirectory = (dirId) => () => {
    this.props.Stores.Qvain.changeDirectory(dirId)
  }

  render() {
    const {
      selected,
      toggleSelected,
      currentDirectory,
      directories,
      files,
      parentDirs
    } = this.props.Stores.Qvain
    return (
      <React.Fragment>
        <Translate component="p" content="qvain.files.ida.help" />
        <FilePickerButton onClick={this.handleOpenModal}>
          <FileIcon />
          <Translate component={FilePickerButtonText} content="qvain.files.ida.button.label" />
          <ChevronIcon />
        </FilePickerButton>
        <Modal contentLabel="IDA File Picker Modal" isOpen={this.state.idaModalOpen} onRequestClose={this.handleCloseModal}>
          <h2>IDA files</h2>
          <ul>
            {parentDirs.has(currentDirectory.id) && (
              <li>
                <LinkButton
                  type="button"
                  onClick={this.handleChangeDirectory(parentDirs.get(currentDirectory.id))}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </LinkButton>
              </li>
            )}
            {directories.map(dir => (
              <li key={dir.id}>
                <Checkbox
                  checked={selected.map(s => s.directory_name).includes(dir.directory_name)}
                  id={`${dir.id}Checkbox`}
                  type="checkbox"
                  title={`${dir.id}Checkbox`}
                  onChange={() => toggleSelected(dir)}
                />
                <LinkButton
                  type="button"
                  onKeyPress={this.handleChangeDirectory(dir.id)}
                  onClick={this.handleChangeDirectory(dir.id)}
                >
                  <DirectoryIcon />
                  {dir.directory_name}
                </LinkButton>
              </li>
            ))}
            {files.map(file => (
              <li key={file.id}>
                <Checkbox
                  checked={selected.map(s => s.file_name).includes(file.file_name)}
                  id={`${file.id}Checkbox`}
                  type="checkbox"
                  onChange={() => toggleSelected(file)}
                />
                <label htmlFor={`${file.id}Checkbox`}>
                  <FileIcon style={{ paddingLeft: '8px' }} />
                  {file.file_name}
                </label>
              </li>
            ))}
          </ul>
        </Modal>
      </React.Fragment>
    )
  }
}

const DirectoryIconStyles = styled(FontAwesomeIcon)`
  margin-right: 8px;
`;

const DirectoryIcon = (props) => <DirectoryIconStyles {...props} icon={faFolder} />

const LinkButton = styled.button`
   background: none!important;
   color: inherit;
   border: none;
   padding: 0!important;
   font: inherit;
   /*border is optional*/
   border-bottom: 1px solid #444;
   cursor: pointer;
`;

export default inject('Stores')(observer(IDAFilePicker))
