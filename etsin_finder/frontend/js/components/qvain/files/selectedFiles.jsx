import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { ButtonGroup, ButtonLabel, EditButton, DeleteButton } from '../general/buttons'

class SelectedFiles extends Component {
  render() {
    return (
      <div>
        <ButtonGroup>
          <ButtonLabel>
            <FontAwesomeIcon icon={faCopy} style={{ marginRight: '8px' }} />
            Project 1 / Title 3
          </ButtonLabel>
          <EditButton />
          <DeleteButton />
        </ButtonGroup>
        <ButtonGroup>
          <ButtonLabel>
            <FontAwesomeIcon icon={faCopy} style={{ marginRight: '8px' }} />
            Project 2 / Title 4
          </ButtonLabel>
          <EditButton />
          <DeleteButton />
        </ButtonGroup>
      </div>
    )
  }
}

export default SelectedFiles
