import React, { Component } from 'react';
import Translate from 'react-translate-component'
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
        <Translate component="p" content="qvain.files.external.help" />
        <FilePickerButtonInverse>
          <LinkIcon />
          <Translate component={FilePickerButtonText} content="qvain.files.external.button.label" />
          <ChevronIcon />
        </FilePickerButtonInverse>
      </div>
    )
  }
}

export default ExternalFiles
