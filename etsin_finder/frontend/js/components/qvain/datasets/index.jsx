import React, { Component } from 'react';
import Translate from 'react-translate-component'
import DatasetTable from './table'
import {
  ContainerLight,
  ContainerSubsection,
  QvainContainer,
  SubHeader,
  SubHeaderText
} from '../general/card'

class Datasets extends Component {
  render() {
    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderText><Translate content="qvain.datasets.title" /> Your Datasets</SubHeaderText>
        </SubHeader>
        <ContainerLight className="container" style={{ paddingTop: '20px' }}>
          <ContainerSubsection>
            <p>Pick one to edit or delete</p>
            <DatasetTable />
            <p>Or create a new dataset</p>
          </ContainerSubsection>
        </ContainerLight>
      </QvainContainer>
    )
  }
}

export default Datasets
