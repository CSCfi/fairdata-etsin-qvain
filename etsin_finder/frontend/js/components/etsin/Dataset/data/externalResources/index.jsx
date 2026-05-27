{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import styled from 'styled-components'
import { observer } from 'mobx-react'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

import buildColumns from '@/utils/buildColumns'
import sizeParse from '@/utils/sizeParse'
import { useStores } from '@/stores/stores'
import { Header, HeaderTitle, HeaderStats } from '../common/dataHeader'
import Info from '../info'
import ResourceItem from './resourceItem'
import withCustomProps from '@/utils/withCustomProps'

const ExternalResources = () => {
  const {
    Etsin: {
      EtsinDataset: { remoteResources, inInfo, setInInfo, resolveDataServiceName },
    },
    Locale: { getValueTranslation },
  } = useStores()

  if (!remoteResources) {
    return null
  }

  const normalizeUrl = value => (typeof value === 'string' ? value : value?.identifier)
  const getResourceName = resource =>
    getValueTranslation(resource.title) ||
    normalizeUrl(resource.access_url) ||
    normalizeUrl(resource.download_url) ||
    resource.identifier ||
    '-'

  const totalCount = remoteResources.length
  const hasSize = !!remoteResources.some(resource => resource.byte_size ?? resource.file_size)
  // Hide data service from the remote resources table to reduce visual noise.
  // (The data service is still available in the dataset info modal.)
  const hasDataService = false
  const dataServiceTitle = resolveDataServiceName(inInfo?.data_service)

  const infoProps = inInfo && {
    open: true,
    name: getResourceName(inInfo),
    description: inInfo.description ? getValueTranslation(inInfo.description) : null,
    size: sizeParse(inInfo.byte_size ?? inInfo.file_size),
    dataService: dataServiceTitle,
    accessUrl: normalizeUrl(inInfo.access_url),
    downloadUrl: normalizeUrl(inInfo.download_url),
    category: getValueTranslation(inInfo.use_category?.pref_label),
    type: inInfo.file_type,
    checksum: inInfo.checksum,
    headerContent: `dataset.dl.infoHeaders.external`,
    headerIcon: faFile,
    closeModal: () => setInInfo(null),
  }

  return (
    <DataTable>
      <Header>
        <Translate component={HeaderTitle} content="dataset.dl.remote" />
        <HeaderStats>
          <Translate content="dataset.dl.objectCount" with={{ count: totalCount }} />
        </HeaderStats>
      </Header>
      {inInfo && <Info {...infoProps} />}
      <Grid hasSize={hasSize} hasDataService={hasDataService}>
        {remoteResources.map(resource => (
          <ResourceItem
            key={`resource-${resource.identifier}-${getResourceName(resource)}`}
            resource={resource}
            hideSize={!hasSize}
            hideDataService={!hasDataService}
          />
        ))}
      </Grid>
    </DataTable>
  )
}

const gridColumns = ({ hasSize, hasDataService, mobile }) => {
  // Make the name column slightly narrower so the actions area remains usable
  // even when the name contains long URLs.
  const columns = [['name', 'minmax(8rem, 1fr)']]
  if (mobile) {
    columns.push(['actions', 'min-content'])
    return buildColumns(columns)
  }
  if (hasSize) {
    columns.push(['size', 'minmax(6rem, 8rem)'])
  }
  if (hasDataService) {
    columns.push(['dataService', 'minmax(8rem, 12rem)'])
  }
  columns.push(['actions', 'min-content'])
  return buildColumns(columns)
}

export const Grid = withCustomProps(styled.ul)`
  display: grid;
  grid-template-columns: ${p => gridColumns({ ...p, mobile: false })};
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: ${p => gridColumns({ ...p, mobile: true })};
  }
  grid-auto-rows: 1.5rem;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`

const DataTable = styled.div`
  margin-top: 1em;
`

export default observer(ExternalResources)
