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

  handleOpenDirectory = (dirId, root, open) => () => {
    if (open) {
      const theDir = root.directories.find(dir => dir.id === dirId)
      if (theDir.directories.length === 0) {
        const { loadDirectory } = this.props.Stores.Qvain
        loadDirectory(dirId, root)
      }
      theDir.open = true
    } else {
      root.directories.find(dir => dir.id === dirId).open = false
    }
  }

  // recursive function to draw the entire file hierarchy, if so desired
  drawHierarchy = (h, root, disabled) => {
    const {
      toggleSelectedDirectory,
      toggleSelectedFile
    } = this.props.Stores.Qvain
    return (
      <Fragment key={h.identifier}>
        <li style={{ paddingLeft: '20px' }}>
          <LinkButton
            type="button"
            onKeyPress={this.handleOpenDirectory(h.id, root, !h.open)}
            onClick={this.handleOpenDirectory(h.id, root, !h.open)}
          >
            <FontAwesomeIcon icon={h.open ? faChevronDown : faChevronRight} />
          </LinkButton>
          <Checkbox
            checked={h.selected || false}
            disabled={disabled || root.selected}
            id={`${h.id}Checkbox`}
            type="checkbox"
            onChange={() => toggleSelectedDirectory(
              { ...h },
              !h.selected
            )}
          />
          <DirectoryIcon />
          {h.directoryName}
          <ul>
            {(h.directories && h.open) && (
              <Fragment>{h.directories.map(dir => (this.drawHierarchy(dir, h, disabled || root.selected)))}</Fragment>
            )}
            {(h.files && h.open) && (
              <Fragment>
                {h.files.map(f => (
                  <li key={f.identifier} style={{ paddingLeft: '20px' }}>
                    <Checkbox
                      disabled={disabled || h.selected || root.selected}
                      checked={f.selected}
                      id={`${f.id}Checkbox`}
                      type="checkbox"
                      onChange={() => toggleSelectedFile(
                        f,
                        !f.selected
                      )}
                    />
                    <FileIcon style={{ paddingLeft: '8px' }} />
                    {f.fileName}
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
                    checked={file.selected || false}
                    id={`${file.id}Checkbox`}
                    type="checkbox"
                    onChange={() => toggleSelectedFile(file, !file.selected)}
                  />
                  <label htmlFor={`${file.id}Checkbox`}>
                    <FileIcon style={{ paddingLeft: '8px' }} />
                    {file.fileName}
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
