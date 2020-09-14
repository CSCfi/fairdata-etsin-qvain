import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Translate from 'react-translate-component'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import DatasetTable from './table'
import {
  ContainerLight,
  ContainerSubsection,
  QvainContainer,
  SubHeader,
  SubHeaderText,
} from '../general/card'
import { SaveButton } from '../general/buttons'
import Title from '../general/title'
import Tracking from '../../../utils/tracking'
import NoticeBar from '../../general/noticeBar'

class Datasets extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    Stores: PropTypes.object.isRequired,
  }

  componentDidMount() {
    Tracking.newPageView('Qvain View Datasets', this.props.location.pathname)
  }

  render() {
    const { publishedDataset, setPublishedDataset } = this.props.Stores.QvainDatasets
    const { getQvainUrl } = this.props.Stores.Env

    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderText>
            <Translate component={Title} content="qvain.datasets.title" />
          </SubHeaderText>
        </SubHeader>
        {publishedDataset && (
          <PublishSuccess onClose={() => setPublishedDataset(null)}>
            <Translate content="qvain.submitStatus.success" />
          </PublishSuccess>
        )}
        <ContainerLight className="container" style={{ paddingTop: '20px' }}>
          <ContainerSubsection>
            <DatasetHelp>
              <Translate content="qvain.datasets.help" />
              <Translate
                component={SaveButton}
                onClick={() => {
                  this.props.Stores.Qvain.resetQvainStore()
                  this.props.history.push(getQvainUrl('/dataset'))
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

const PublishSuccess = styled(NoticeBar).attrs(() => ({
  bg: 'success',
}))`
  margin: 0.5rem 0;
`

const DatasetHelp = styled.p`
  margin-bottom: 30px;
`

export default inject('Stores')(observer(withRouter(Datasets)))
