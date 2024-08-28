import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { ACCESS_TYPE_URL } from '@/utils/constants'

import ErrorBoundary from '@/components/general/errorBoundary'
import { useStores } from '@/stores/stores'

const DatasetMetrics = () => {
  const {
    Etsin: {
      EtsinDataset: { dataset, accessRights, hasFiles },
    },
  } = useStores()

  const showDownloadMetrics =
    accessRights.access_type.url === ACCESS_TYPE_URL.OPEN
      ? hasFiles
      : Boolean(dataset.metrics.downloads_total_successful)

  return (
    <ErrorBoundary title={`Error in metrics`}>
      <Metrics>
        <tbody>
          {/* Views */}
          <tr>
            <Translate component="td" content="dataset.metrics.totalViews" />
            <Statistic>{dataset.metrics.views_total_views}</Statistic>
          </tr>
          {/* Downloads */}
          {showDownloadMetrics && (
            <tr>
              <Translate component="td" content="dataset.metrics.totalDownloads" />
              <Statistic>{dataset.metrics.downloads_total_successful}</Statistic>
            </tr>
          )}
        </tbody>
      </Metrics>
    </ErrorBoundary>
  )
}

const Metrics = styled.table`
  border: none;
  width: 100%;
`

const Statistic = styled.td`
  text-align: right;
  padding: 0.2rem 0;
`

export default DatasetMetrics
