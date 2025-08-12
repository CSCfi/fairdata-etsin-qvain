import { useEffect } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Translate from '@/utils/Translate'

import { useStores } from '../../utils/stores'
import { QvainContainer, PageTitle } from '../../general/card'
import { SaveButton } from '../../general/buttons'
import NoticeBar from '../../../general/noticeBar'
import Tabs from './tabs'
import Table from './table'
import RemoveModal from './removeModal'
import ShareModal from './ShareModal'
import Search from './search'

export const Datasets = () => {
  const navigate = useNavigate()

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
          <Translate
            content={
              publishedDataset.isNew
                ? 'qvain.submitStatus.success'
                : 'qvain.submitStatus.editMetadataSuccess'
            }
          />
        </PublishSuccess>
      )}

      <DatasetsContainer>
        <DatasetsHeader>
          <Translate content="qvain.datasets.help" />
          <Translate
            component={SaveButton}
            onClick={() => {
              resetQvainStore()
              navigate(getQvainUrl('/dataset'))
            }}
            content="qvain.datasets.createButton"
            data-cy="create-dataset"
          />
        </DatasetsHeader>
        <Tabs />
        <DatasetsContent>
          <Search />
          <Table />
        </DatasetsContent>
        <RemoveModal />
        <ShareModal />
      </DatasetsContainer>
    </QvainContainer>
  )
}

const PublishSuccess = styled(NoticeBar).attrs({
  bg: 'success',
})`
  margin: 0.5rem 0;
`

const DatasetsHeader = styled.div`
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 16px;
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
  padding: 1rem 0rem;
  font-size: 16px;
`

export default observer(Datasets)
