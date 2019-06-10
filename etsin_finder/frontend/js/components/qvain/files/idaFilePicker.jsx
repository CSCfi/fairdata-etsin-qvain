import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
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
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  handleToggleForm = (event) => {
    event.preventDefault()
    const { idaPickerOpen } = this.props.Stores.Qvain
    if (idaPickerOpen) {
      this.props.Stores.Qvain.idaPickerOpen = false
    } else {
      this.props.Stores.Qvain.idaPickerOpen = true
      this.props.Stores.Qvain.extResFormOpen = false
    }
  }

  render() {
    const { idaPickerOpen } = this.props.Stores.Qvain
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
