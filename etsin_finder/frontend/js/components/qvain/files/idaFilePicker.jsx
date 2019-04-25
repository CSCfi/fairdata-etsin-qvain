import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import axios from 'axios'
import Translate from 'react-translate-component'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import {
  FilePickerButton,
  FileIcon,
  FilePickerButtonText,
  ChevronIcon
} from '../general/buttons'
import Modal from '../../general/modal'

const DIR_URL = '/api/files/directory/'
const PROJECT_DIR_URL = '/api/files/project/'

const getProjectRootDirectory = (projectId) => (
  axios
    .get(PROJECT_DIR_URL + projectId)
    .then(res => {
      const { files, directories, id } = res.data
      return { files, directories, id }
    })
)

const getDirectory = (dirId) => (
  axios
    .get(DIR_URL + dirId)
    .then(res => {
      const { files, directories } = res.data
      return { files, directories }
    })
)

class IDAFilePicker extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    idaModalOpen: false,
    directories: [],
    files: [],
    currentDirectory: undefined
  }

  componentDidMount() {
    getProjectRootDirectory('project_x').then(results => {
      const { files, directories } = results
      this.setState({
        files,
        directories,
        currentDirectory: results
      })
    })
  }

  handleOpenModal = (event) => {
    event.preventDefault()
    this.setState({ idaModalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({ idaModalOpen: false })
  }

  handleChangeDirectory = (dirId) => () => {
    getDirectory(dirId).then(result => {
      const { files, directories } = result
      this.setState((state) => ({
        currentDirectory: state.directories.find(dir => dir.id === dirId),
        files,
        directories
      }))
    })
  }

  render() {
    const { selectedFiles, addSelectedFile } = this.props.Stores.Qvain
    const { currentDirectory } = this.state
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
            {(currentDirectory !== undefined && currentDirectory.parent_directory !== undefined) && (
              <li>
                <LinkButton
                  type="button"
                  onClick={this.handleChangeDirectory(this.state.currentDirectory.parent_directory.id)}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </LinkButton>
              </li>
            )}
            {this.state.directories.map(dir => (
              <li
                key={dir.id}
              >
                <LinkButton
                  type="button"
                  onKeyPress={this.handleChangeDirectory(dir.id)}
                  onClick={this.handleChangeDirectory(dir.id)}
                >
                  {dir.directory_name}
                </LinkButton>
              </li>
            ))}
            {this.state.files.map(file => (
              <li key={file.id}>
                <input
                  checked={selectedFiles.map(sf => sf.id).includes(file.id)}
                  id={`${file.id}Checkbox`}
                  type="checkbox"
                  onChange={() => addSelectedFile(file)}
                />
                <label htmlFor={`${file.id}Checkbox`}>{file.file_name}</label>
              </li>
            ))}
          </ul>
        </Modal>
      </React.Fragment>
    )
  }
}

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
