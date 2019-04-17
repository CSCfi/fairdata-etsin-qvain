import React, { Component } from 'react';
import { SectionTitle } from '../general/section'
import Card from '../general/card'
import IDAFilePicker from './idaFilePicker'
import ProjectSelector from './projectSelector'

class Files extends Component {
  render() {
    return (
      <div className="container">
        <SectionTitle>Files</SectionTitle>
        <Card>
          <IDAFilePicker />
          <ProjectSelector />
        </Card>
      </div>
    )
  }
}

export default Files
