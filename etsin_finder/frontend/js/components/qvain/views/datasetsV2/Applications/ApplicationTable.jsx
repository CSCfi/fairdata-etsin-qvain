import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'
import { useEffect } from 'react'

import Loader from '@/components/general/loader'
import styled from 'styled-components'
import { PlaceholderWrapper } from '../styled'
import ApplicationModal from './ApplicationModal'
import ApplicationRow from './ApplicationRow'

const ApplicationTable = () => {
  const {
    Locale: { translate },
    Qvain: {
      REMSApplications: {
        applications,
        fetchApplications,
        filter,
        isLoadingApplications,
        selectedApplication,
      },
    },
  } = useStores()

  useEffect(() => {
    fetchApplications() // Fetch applications when filter changes
  }, [filter, fetchApplications])

  if (isLoadingApplications) {
    return (
      <PlaceholderWrapper>
        <Loader active size="6rem" />
      </PlaceholderWrapper>
    )
  }

  if (applications.length === 0) {
    return <NotFound>{translate('qvain.applications.notFound')}</NotFound>
  }

  return (
    <StyledTable>
      <thead>
        <tr>
          <th>{translate('qvain.applications.table.application')}</th>
          <th>{translate('qvain.applications.table.dataset')}</th>
          <th>{translate('qvain.applications.table.applicant')}</th>
          <th>{translate('qvain.applications.table.status')}</th>
          <th>{translate('qvain.applications.table.view')}</th>
        </tr>
      </thead>
      <tbody>
        {applications.map(app => (
          <ApplicationRow key={app['application/external-id']} application={app} />
        ))}
        {selectedApplication && <ApplicationModal />}
      </tbody>
    </StyledTable>
  )
}

const NotFound = styled.div`
  padding-top: 2rem;
  min-height: 20rem;
`

const StyledTable = styled.table`
  margin-top: 0.5rem;
  width: 100%;
  tr {
    height: 3rem;
    font-size: 16px;
  }
  th {
    font-size: 18px;
    text-align: center;
    vertical-align: middle;
  }
  td {
    border-top: 1px solid #cecece;
    vertical-align: middle;
    padding: 0.25rem 0.25rem;
    text-align: center;
  }
`

export default observer(ApplicationTable)
