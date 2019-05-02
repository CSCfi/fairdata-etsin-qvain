import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFolder } from '@fortawesome/free-solid-svg-icons'
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
      <Fragment>
        <List style={{ marginBottom: '20px' }}>
          {parentDirs.has(currentDirectory.id) && (
            <ListItem>
              <LinkButton
                type="button"
                onClick={this.handleChangeDirectory(parentDirs.get(currentDirectory.id))}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </LinkButton>
            </ListItem>
          )}
          {directories.map(dir => (
            <ListItem key={dir.id}>
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
            </ListItem>
          ))}
          {files.map(file => (
            <ListItem key={file.id}>
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
            </ListItem>
          ))}
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
   /*border is optional*/
   border-bottom: 1px solid #444;
   cursor: pointer;
`;

export default inject('Stores')(observer(FileSelector))
