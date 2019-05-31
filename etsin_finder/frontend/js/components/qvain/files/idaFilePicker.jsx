import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import ProjectSelector from './projectSelector'
import SelectedFiles from './selectedFiles'
import FileSelector from './fileSelector'
import {
  FilePickerButton,
  FileIcon,
  FilePickerButtonText,
  ChevronRight,
  ChevronDown
} from '../general/buttons'

export class IDAFilePickerBase extends Component {
  state = {
    idaPickerOpen: false
  }

  handleToggleForm = (event) => {
    event.preventDefault()
    this.setState((state) => ({
      idaPickerOpen: !state.idaPickerOpen
    }))
  }

  render() {
    const { idaPickerOpen } = this.state
    return (
      <Fragment>
        <Translate component="p" content="qvain.files.ida.help" />
        <FilePickerButton onClick={this.handleToggleForm}>
          <FileIcon />
          <Translate component={FilePickerButtonText} content="qvain.files.ida.button.label" />
          {idaPickerOpen ? <ChevronDown /> : <ChevronRight />}
        </FilePickerButton>
        {idaPickerOpen && (
          <Fragment>
            <ProjectSelector />
            <FileSelector />
            <SelectedFiles />
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default inject('Stores')(observer(IDAFilePickerBase))
