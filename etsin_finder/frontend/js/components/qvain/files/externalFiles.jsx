import React, { Component } from 'react';
import {
  FilePickerButtonInverse,
  FilePickerButtonText,
  LinkIcon,
  ChevronIcon
} from '../general/buttons'

class ExternalFiles extends Component {
  render() {
    return (
      <div>
        <p>Add link to external files from here:</p>
        <FilePickerButtonInverse>
          <LinkIcon />
          <FilePickerButtonText>Add link to external files</FilePickerButtonText>
          <ChevronIcon />
        </FilePickerButtonInverse>
      </div>
    )
  }
}

export default ExternalFiles
