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

import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { faFile } from '@fortawesome/free-solid-svg-icons'

import buildColumns from '@/utils/buildColumns'
import { useStores } from '@/stores/stores'
import { Header, HeaderTitle, HeaderStats } from '../common/dataHeader'
import Info from '../info'
import ResourceItem from './resourceItem'

const ExternalResources = () => {
  const {
    Etsin: {
      EtsinDataset: { remoteResources, inInfo, setInInfo },
    },
    Locale: { getValueTranslation },
  } = useStores()

  if (!remoteResources) {
    return null
  }

  const totalCount = remoteResources.length
  const accessUrls = new Set(remoteResources.map(resource => resource.access_url).filter(v => v))
  const hasAccess = accessUrls.size > 0
  const hasDownload = !!remoteResources.find(resource => resource.download_url)

  const infoProps = inInfo && {
    open: true,
    name: getValueTranslation(inInfo.title),
    description: inInfo.description ? getValueTranslation(inInfo.description) : null,
    accessUrl: inInfo.access_url,
    downloadUrl: inInfo.download_url,
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
      <Grid showAccess={hasAccess} hasDownload={hasDownload}>
        {remoteResources.map(resource => (
          <ResourceItem
            key={`resource-${resource.identifier}-${getValueTranslation(resource.title)}`}
            resource={resource}
            hideAccess={!hasAccess}
            noButtons={!hasAccess && !hasDownload}
          />
        ))}
      </Grid>
    </DataTable>
  )
}

const gridColumns = ({ showAccess, hasDownload, mobile }) => {
  const columns = [['name', '1fr']]
  if (!mobile) {
    columns.push(['info', 'min-content'])
  }
  if (showAccess) {
    columns.push(['access', '11rem'])
  }
  if (hasDownload) {
    columns.push(['download', '7rem'])
  }
  return buildColumns(columns)
}

export const Grid = styled.ul`
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
