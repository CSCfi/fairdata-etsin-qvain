import React, { Component } from 'react';
import Translate from 'react-translate-component'
import {
  FilePickerButton,
  FileIcon,
  FilePickerButtonText,
  ChevronIcon
} from '../general/buttons'

class IDAFilePicker extends Component {
  render() {
    return (
      <React.Fragment>
        <Translate component="p" content="qvain.files.ida.help" />
        <FilePickerButton>
          <FileIcon />
          <Translate component={FilePickerButtonText} content="qvain.files.ida.button.label" />
          <ChevronIcon />
        </FilePickerButton>
      </React.Fragment>
    )
  }
}

export default IDAFilePicker
