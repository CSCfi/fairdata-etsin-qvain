import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Checkbox } from '../general/form'
import {
  FileIcon,
} from '../general/buttons'
import { List, ListItem } from '../general/list'

class FileSelector extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  handleChangeDirectory = (dirId) => () => {
    this.props.Stores.Qvain.changeDirectory(dirId)
  }

  handleOpenDirectory = (dirId, root) => () => {
    if (root.directories.find(dir => dir.id === dirId).directories === undefined) {
      const { openDirectory } = this.props.Stores.Qvain
      openDirectory(dirId, root)
    } else {
      const theDir = root.directories.find(dir => dir.id === dirId)
      theDir.directories = undefined
      theDir.files = undefined
    }
  }

  isDirectorySelected = (dir, selectedFiles, selectedDirectories) => (
    selectedFiles.map(sf => sf.parent_directory.id).includes(dir.id) ||
    selectedDirectories.map(sd => sd.id).includes(dir.id)
  )

  // recursive function to draw the entire file hierarchy, if so desired
  drawHierarchy = (h, root) => {
    const {
      toggleSelectedDirectory,
      toggleSelectedFile,
      selectedFiles,
      selectedDirectories
    } = this.props.Stores.Qvain
    return (
      <Fragment key={h.identifier}>
        <li style={{ paddingLeft: '20px' }}>
          <LinkButton
            type="button"
            onKeyPress={this.handleOpenDirectory(h.id, root)}
            onClick={this.handleOpenDirectory(h.id, root)}
          >
            <FontAwesomeIcon icon={h.directories ? faChevronDown : faChevronRight} />
          </LinkButton>
          <Checkbox
            checked={this.isDirectorySelected(h, selectedFiles, selectedDirectories)}
            id={`${h.id}Checkbox`}
            type="checkbox"
            onChange={() => toggleSelectedDirectory(
              h,
              !this.isDirectorySelected(h, selectedFiles, selectedDirectories)
            )}
          />
          <DirectoryIcon />
          {h.directory_name}
          <ul>
            {h.directories && (
              <Fragment>{h.directories.map(dir => (this.drawHierarchy(dir, h)))}</Fragment>
            )}
            {h.files && (
              <Fragment>
                {h.files.map(f => (
                  <li key={f.identifier} style={{ paddingLeft: '20px' }}>
                    <Checkbox
                      checked={selectedFiles.map(s => s.file_name).includes(f.file_name)}
                      id={`${f.id}Checkbox`}
                      type="checkbox"
                      onChange={() => toggleSelectedFile(f)}
                    />
                    <FileIcon style={{ paddingLeft: '8px' }} />
                    {f.file_name}
                  </li>
                ))}
              </Fragment>
            )}
          </ul>
        </li>
      </Fragment>
    )
  }

  render() {
    const {
      selectedFiles,
      toggleSelectedFile,
      hierarchy,
    } = this.props.Stores.Qvain
    return (
      <Fragment>
        <List style={{ marginBottom: '20px' }}>
          {hierarchy.directories && (
            <Fragment>
              {hierarchy.directories.map(dir => this.drawHierarchy(dir, hierarchy))}
            </Fragment>
          )}
          {hierarchy.files && (
            <Fragment>
              {hierarchy.files.map(file => (
                <ListItem key={file.id}>
                  <Checkbox
                    checked={selectedFiles.map(s => s.file_name).includes(file.file_name)}
                    id={`${file.id}Checkbox`}
                    type="checkbox"
                    onChange={() => toggleSelectedFile(file)}
                  />
                  <label htmlFor={`${file.id}Checkbox`}>
                    <FileIcon style={{ paddingLeft: '8px' }} />
                    {file.file_name}
                  </label>
                </ListItem>
              ))}
            </Fragment>
          )}
        </List>
      </Fragment>
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
   cursor: pointer;
`;

export default inject('Stores')(observer(FileSelector))
