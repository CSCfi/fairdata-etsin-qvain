import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Translate from 'react-translate-component'
import { withRouter } from 'react-router-dom'
import DatasetTable from './table'
import {
  ContainerLight,
  ContainerSubsection,
  QvainContainer,
  SubHeader,
  SubHeaderText
} from '../general/card'
import {
  SaveButton
} from '../general/buttons'

class Datasets extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  render() {
    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderText><Translate content="qvain.datasets.title" /> Your Datasets</SubHeaderText>
        </SubHeader>
        <ContainerLight className="container" style={{ paddingTop: '20px' }}>
          <ContainerSubsection>
            <p>
              Choose a dataset to edit or create a new dataset
              <SaveButton onClick={() => this.props.history.push('/qvain/dataset')}>Create dataset</SaveButton>
            </p>
            <DatasetTable />
          </ContainerSubsection>
        </ContainerLight>
      </QvainContainer>
    )
  }
}

export default withRouter(Datasets)
