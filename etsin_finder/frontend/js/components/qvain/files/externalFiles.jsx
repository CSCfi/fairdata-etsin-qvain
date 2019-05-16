import React, { Component, Fragment } from 'react';
import Translate from 'react-translate-component'
import {
  FilePickerButtonInverse,
  FilePickerButtonText,
  LinkIcon,
  ChevronIcon
} from '../general/buttons'

class ExternalFiles extends Component {
  state = {
    formOpen: false
  }

  handleToggleForm = (event) => {
    event.preventDefault()
    this.setState((state) => ({
      formOpen: !state.formOpen
    }))
  }

  render() {
    return (
      <Fragment>
        <Translate component="p" content="qvain.files.external.help" />
        <FilePickerButtonInverse onClick={this.handleToggleForm}>
          <LinkIcon />
          <Translate component={FilePickerButtonText} content="qvain.files.external.button.label" />
          <ChevronIcon />
        </FilePickerButtonInverse>
        {this.state.formOpen &&
          (<p>No content</p>)
        }
      </Fragment>
    )
  }
}

export default ExternalFiles
