import React, { Component } from 'react';
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsection } from '../general/card'
import IDAFilePicker from './idaFilePicker'
import ProjectSelector from './projectSelector'
import FileForm from './fileForm'
import SelectedFiles from './selectedFiles'
import ExternalFiles from './externalFiles'

class Files extends Component {
  render() {
    return (
      <ContainerLight className="container">
        <SectionTitle>Files</SectionTitle>
        <ContainerSubsection>
          <IDAFilePicker />
          <ProjectSelector />
          <FileForm />
          <SelectedFiles />
        </ContainerSubsection>
        <ContainerSubsection>
          <ExternalFiles />
        </ContainerSubsection>
      </ContainerLight>
    )
  }
}

export default Files
