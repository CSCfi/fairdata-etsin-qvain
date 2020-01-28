import React, { Component } from 'react';
import translate from 'counterpart'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Checkbox } from '../general/form'
import {
  FileIcon,
  FilePickerFileButton
} from '../general/buttons'

export class FileSelectorBase extends Component {
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

  drawFile = (f) => {
    const {
      toggleSelectedFile,
      setMetadataModalFile,
      canSelectFiles
    } = this.props.Stores.Qvain

    return (
      <li key={f.identifier} style={{ paddingLeft: '20px', display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={f.selected}
          id={`${f.id}Checkbox`}
          disabled={!canSelectFiles}
          type="checkbox"
          onChange={() => toggleSelectedFile(
            f,
            !f.selected
          )}
          style={{ marginRight: '8px' }}
        />

        <FileIcon />
        <label htmlFor={`${f.id}Checkbox`} style={{ flexGrow: 1, cursor: 'pointer', fontSize: '85%' }}>
          {f.fileName}
        </label>
        <FilePickerFileButton id={`${f.identifier}-open-metadata-modal`} type="button" onClick={() => setMetadataModalFile(f)}>
          {translate('qvain.files.metadataModal.buttons.show')}
        </FilePickerFileButton>
      </li>
    )
  }

  // recursive function to draw the entire file hierarchy, if so desired
  drawHierarchy = (h, root) => {
    const {
      toggleSelectedDirectory,
      canSelectFiles
    } = this.props.Stores.Qvain
    return (
      <li key={h.identifier} style={{ paddingLeft: '20px' }}>
        <LinkButton
          aria-label={h.open ? 'Close directory' : 'Open directory'}
          type="button"
          onKeyPress={this.handleOpenDirectory(h.id, root, !h.open)}
          onClick={this.handleOpenDirectory(h.id, root, !h.open)}
        >
          <FontAwesomeIcon icon={h.open ? faChevronDown : faChevronRight} />
        </LinkButton>
        <Checkbox
          aria-label={`${h.directoryName}`}
          checked={h.selected || false}
          disabled={!canSelectFiles}
          id={`${h.id}Checkbox`}
          type="checkbox"
          onChange={() => toggleSelectedDirectory(
            { ...h },
            !h.selected
          )}
        />
        <DirectoryIcon />
        {h.directoryName} ({h.original.file_count})
        <ul>
          {(h.directories && h.open) &&
            h.directories.map(dir => (this.drawHierarchy(dir, h)))
          }
          {(h.files && h.open) && h.files.map(this.drawFile)}
        </ul>
      </li>
    )
  }

  render() {
    const {
      hierarchy,
    } = this.props.Stores.Qvain
    return (
      <ul style={{ marginBottom: '20px' }}>
        {hierarchy.directories &&
          hierarchy.directories.map(dir => this.drawHierarchy(dir, hierarchy))
        }
        {hierarchy.files && hierarchy.files.map(this.drawFile)}
      </ul>
    )
  }
}

const DirectoryIconStyles = styled(FontAwesomeIcon)`
  margin-right: 8px;
`;

const DirectoryIcon = (props) => <DirectoryIconStyles {...props} icon={faFolder} />

const LinkButton = styled.button`
   background: none !important;
   color: inherit;
   border: none;
   padding: 0!important;
   font: inherit;
   cursor: pointer;
`;

export default inject('Stores')(observer(FileSelectorBase))
