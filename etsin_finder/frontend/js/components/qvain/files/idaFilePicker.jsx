import React, { Component } from 'react';
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
        <p>If you have files in Fairdata IDA you can link them from here:</p>
        <FilePickerButton>
          <FileIcon />
          <FilePickerButtonText>Link files from Fairdata IDA</FilePickerButtonText>
          <ChevronIcon />
        </FilePickerButton>
      </React.Fragment>
    )
  }
}

export default IDAFilePicker
