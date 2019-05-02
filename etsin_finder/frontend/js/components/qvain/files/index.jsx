import React, { Component } from 'react';
import Translate from 'react-translate-component'
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsection } from '../general/card'
import IDAFilePicker from './idaFilePicker'
import ProjectSelector from './projectSelector'
import SelectedFiles from './selectedFiles'
import ExternalFiles from './externalFiles'

class Files extends Component {
  render() {
    return (
      <ContainerLight className="container">
        <Translate component={SectionTitle} content="qvain.files.title" />
        <ContainerSubsection>
          <IDAFilePicker />
        </ContainerSubsection>
        <ContainerSubsection>
          <ExternalFiles />
        </ContainerSubsection>
      </ContainerLight>
    )
  }
}

export default Files
