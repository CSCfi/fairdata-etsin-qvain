import React, { Component } from 'react';
import Translate from 'react-translate-component'
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsection } from '../general/card'
import { HelpIcon } from '../general/form'
import IDAFilePicker from './idaFilePicker'
import ExternalFiles from './externalFiles'

class Files extends Component {
  render() {
    return (
      <ContainerLight className="container">
        <SectionTitle>
          <Translate content="qvain.files.title" />
          <Translate component={HelpIcon} attributes={{ title: 'qvain.files.help' }} />
        </SectionTitle>
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
