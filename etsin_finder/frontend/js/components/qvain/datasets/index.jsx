import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import Translate from 'react-translate-component'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components';
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
import Title from '../general/title';

class Datasets extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    Stores: PropTypes.object.isRequired
  }

  render() {
    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderText>
            <Translate component={Title} content="qvain.datasets.title" />
          </SubHeaderText>
        </SubHeader>
        <ContainerLight className="container" style={{ paddingTop: '20px' }}>
          <ContainerSubsection>
            <DatasetHelp>
              <Translate content="qvain.datasets.help" />
              <Translate
                component={SaveButton}
                onClick={() => {
                  this.props.Stores.Qvain.resetQvainStore()
                  this.props.history.push('/qvain/dataset')
                }}
                content="qvain.datasets.createButton"
              />
            </DatasetHelp>
            <DatasetTable />
          </ContainerSubsection>
        </ContainerLight>
      </QvainContainer>
    )
  }
}

const DatasetHelp = styled.p`
  margin-bottom: 30px;
`;

export default inject('Stores')(observer(withRouter(Datasets)))
