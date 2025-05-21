import { useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '../../utils/stores'
import DatasetGroup from './datasetGroup'
import Loader from '../../../general/loader'
import { InvertedButton } from '../../../general/button'
import withCustomProps from '@/utils/withCustomProps'

const Table = () => {
  const {
    QvainDatasets: {
      error,
      loadDatasets,
      isLoadingDatasets,
      reset,
      searchTerm,
      filteredGroups,
      showMore,
      moreAvailable,
    },
  } = useStores()

  useEffect(() => {
    loadDatasets()
    return () => {
      reset()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const noDatasets = !isLoadingDatasets && !error && filteredGroups.length === 0

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
        <Translate content={`qvain.datasets.${searchTerm ? 'noMatchingDatasets' : 'noDatasets'}`} />
      </PlaceholderWrapper>
    )
  }

  if (error) {
    return (
      <PlaceholderWrapper>
        <ErrorMessage>
          <Translate content="qvain.datasets.errorOccurred" />:{' '}
          {error.message || JSON.stringify(error)}
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
            <PadHeadCell />
            <Translate component={TitleCell} content="qvain.datasets.tableRows.title" />
            <Translate component={HeadCell} content="qvain.datasets.tableRows.state" />
            <Translate component={HeadCell} content="qvain.datasets.tableRows.owner" />
            <Translate component={HeadCell} content="qvain.datasets.tableRows.created" />
            <Translate component={IconHeadCell} content="qvain.datasets.tableRows.edit" />
            <Translate
              component={IconHeadCell}
              content="qvain.datasets.tableRows.preview"
              onlyWide
            />
            <Translate component={IconHeadCell} content="qvain.datasets.tableRows.share" onlyWide />
            <Translate component={IconHeadCell} content="qvain.datasets.moreActions" />
            <PadHeadCell />
          </Header>
        </thead>
        {filteredGroups.map(group => (
          <DatasetGroup key={group[0].id} group={group} />
        ))}
      </DatasetsTable>
      {moreAvailable && (
        <MoreButton onClick={showMore}>
          <Translate content="general.showMore" /> &gt;
        </MoreButton>
      )}
    </>
  )
}

export const MoreButton = styled.button`
  border: none;
  background: transparent;
  height: 3rem;
  font-size: 20px;
  text-effect: underline;
  cursor: pointer;
  color: ${props => props.theme.color.primary};
  margin-left: 2rem;
`

const Header = styled.tr`
  text-align: center;
`

const PadHeadCell = styled.th.attrs({ 'aria-hidden': true })`
  padding: 1rem;
`

const HeadCell = withCustomProps(styled.th)`
  vertical-align: middle;
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
    @media screen and (min-width: ${p.theme.breakpoints.lg}) {
      display: table-cell;
    }
  `}
`

const IconHeadCell = styled(HeadCell)`
  padding: 0.5rem 1rem;
`

const TitleCell = styled(HeadCell)`
  width: 100%;
`

const DatasetsTable = styled.table`
  font-size: 18px;
`

const PlaceholderWrapper = styled.div`
  min-height: 20rem;
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
