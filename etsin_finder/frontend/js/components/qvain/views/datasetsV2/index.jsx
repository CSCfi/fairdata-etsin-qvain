import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { useStores } from '../../utils/stores'
import { QvainContainer, PageTitle } from '../../general/card'
import { SaveButton } from '../../general/buttons'
import NoticeBar from '../../../general/noticeBar'
import Tabs from './tabs'
import Table from './table'
import RemoveModal from '../datasets/removeModal'

export const Datasets = () => {
  const history = useHistory()

  const {
    Qvain: { resetQvainStore },
    QvainDatasets: { publishedDataset, setPublishedDataset },
    Env: { getQvainUrl },
    Matomo: { recordEvent },
  } = useStores()

  useEffect(() => {
    recordEvent('DATASETS')
  })

  return (
    <QvainContainer>
      <Translate component={PageTitle} content="qvain.datasets.title" />
      {publishedDataset && (
        <PublishSuccess onClose={() => setPublishedDataset(null)}>
          <Translate content="qvain.submitStatus.success" />
        </PublishSuccess>
      )}

      <DatasetsContainer>
        <DatasetsHeader>
          <Translate content="qvain.datasets.help" />
          <Translate
            component={SaveButton}
            onClick={() => {
              resetQvainStore()
              history.push(getQvainUrl('/dataset'))
            }}
            content="qvain.datasets.createButton"
          />
        </DatasetsHeader>
        <Tabs />
        <DatasetsContent>
          <Table />
        </DatasetsContent>
        <RemoveModal />
      </DatasetsContainer>
    </QvainContainer>
  )
}

const PublishSuccess = styled(NoticeBar).attrs(() => ({
  bg: 'success',
}))`
  margin: 0.5rem 0;
`

const DatasetsHeader = styled.div`
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 20px;
`

const DatasetsContainer = styled.div.attrs({
  className: 'container',
})`
  box-shadow: 0px 3px 8px #bcdbe6;
  background: white;
  margin-top: 1.5rem;
  padding: 0;
  margin-bottom: 1rem;
`

const DatasetsContent = styled.div`
  padding: 1rem 2rem;
  font-size: 16px;
`

export default observer(Datasets)
