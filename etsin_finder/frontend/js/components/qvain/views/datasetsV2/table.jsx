import React, { useEffect } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { observer } from 'mobx-react'
import { useStores } from '../../utils/stores'
import DatasetGroup from './datasetGroup'
import Loader from '../../../general/loader'
import { InvertedButton } from '../../../general/button'

const Table = () => {
  const {
    QvainDatasets: { count, error, loadDatasets, isLoadingDatasets, reset },
    QvainDatasetsV2: { datasetGroups, showMore, moreAvailable, reset: resetV2 },
    Env: {
      Flags: { flagEnabled },
    },
  } = useStores()

  useEffect(() => {
    loadDatasets({ shared: flagEnabled('PERMISSIONS.SHARE_PROJECT') })
    return () => {
      reset()
      resetV2()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const noDatasets = !isLoadingDatasets && !error && count === 0

  if (isLoadingDatasets) {
    return (
      <PlaceholderWrapper>
        <Loader active size="6rem" />
      </PlaceholderWrapper>
    )
  }

  if (noDatasets) {
    return (
      <PlaceholderWrapper>
        <Translate content="qvain.datasets.noDatasets" />
      </PlaceholderWrapper>
    )
  }

  if (error) {
    return (
      <PlaceholderWrapper>
        <ErrorMessage>
          <Translate content="qvain.datasets.errorOccurred" />: {error.message || JSON.stringify(error)}
        </ErrorMessage>
        <Translate
          content="qvain.datasets.reload"
          component={InvertedButton}
          onClick={() => loadDatasets()}
        />
      </PlaceholderWrapper>
    )
  }

  return (
    <>
      <DatasetsTable>
        <thead>
          <Header>
            <Translate component={TitleCell} content="qvain.datasets.tableRows.title" />
            <Translate component={HeadCell} content="qvain.datasets.tableRows.state" />
            <Translate component={HeadCell} content="qvain.datasets.tableRows.owner" />
            <Translate component={HeadCell} content="qvain.datasets.tableRows.created" />
            <Translate component={HeadCell} content="qvain.datasets.tableRows.edit" />
            <Translate component={HeadCell} content="qvain.datasets.tableRows.preview" onlyWide />
            <Translate component={HeadCell} content="qvain.datasets.tableRows.share" onlyWide />
            <Translate component={HeadCell} content="qvain.datasets.moreActions" />
          </Header>
        </thead>
        {datasetGroups.map(group => (
          <DatasetGroup key={group[0].id} group={group} />
        ))}
      </DatasetsTable>
      {moreAvailable && <MoreButton onClick={showMore}>Show more &gt;</MoreButton>}
    </>
  )
}

const MoreButton = styled.button`
  border: none;
  background: transparent;
  height: 3rem;
  font-size: 20px;
  text-effect: underline;
  cursor: pointer;
  color: ${props => props.theme.color.primary};
`

const Header = styled.tr`
  border-bottom: 1px solid #cecece;
  text-align: center;
`

const HeadCell = styled.th`
  padding: 0.5rem 0.5rem;
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0.5rem 1rem;
  }

  ${p =>
    p.onlyWide &&
    `
    display: none;
    @media screen and (min-width: ${p.theme.breakpoints.md}) {
      display: table-cell;
    }
  `}
`

const TitleCell = styled(HeadCell)`
  width: 100%;
`

const DatasetsTable = styled.table`
  font-size: 18px;
`

const PlaceholderWrapper = styled.div`
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const ErrorMessage = styled.span`
  color: ${props => props.theme.color.redText};
  margin-left: 10px;
`

export default observer(Table)
