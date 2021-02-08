import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { useStores } from '../../utils/stores'

import DatasetTable from './table'
import { ContainerLight, ContainerSubsection, QvainContainer, PageTitle } from '../../general/card'
import { SaveButton } from '../../general/buttons'
import Tracking from '../../../../utils/tracking'
import NoticeBar from '../../../general/noticeBar'

const Datasets = ({ history, location }) => {
  const {
    Qvain: { resetQvainStore },
    QvainDatasets: { publishedDataset, setPublishedDataset },
    Env: { getQvainUrl },
  } = useStores()

  useEffect(() => {
    Tracking.newPageView('Qvain View Datasets', location.pathname)
  })

  return (
    <QvainContainer>
      <Translate component={PageTitle} content="qvain.datasets.title" />
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
                resetQvainStore()
                history.push(getQvainUrl('/dataset'))
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

Datasets.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}

const PublishSuccess = styled(NoticeBar).attrs(() => ({
  bg: 'success',
}))`
  margin: 0.5rem 0;
`

const DatasetHelp = styled.p`
  margin-bottom: 30px;
`

export default observer(withRouter(Datasets))
