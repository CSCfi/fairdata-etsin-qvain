import { observer } from 'mobx-react'
import { useEffect } from 'react'
import styled from 'styled-components'

import Loader from '@/components/general/loader'
import { useStores } from '@/utils/stores'
import PropTypes from 'prop-types'
import ApplicationState from './REMSApplicationState'
import REMSLicenseList from './REMSLicenseList'

const REMSApplication = ({ application }) => {
  const {
    Locale: { dateFormat, translate },
    Etsin: {
      EtsinDataset: {
        rems: { fetchApplicationDetails },
      },
    },
  } = useStores()

  const hasDetails = application.hasDetails
  useEffect(() => {
    if (!hasDetails) {
      fetchApplicationDetails(application)
    }
  }, [application, fetchApplicationDetails, hasDetails])

  let content = <Loader active />
  if (hasDetails) {
    const licenses = application['application/licenses'] || []
    content = (
      <Wrapper>
        <REMSLicenseList licenses={licenses} />
      </Wrapper>
    )
  }

  const created = dateFormat(application['application/created'], { format: 'date' })
  return (
    <>
      <TitleRow>
        <h1>{translate('dataset.access_modal.applicationCreated', { created })}</h1>
        <ApplicationState application={application} />
      </TitleRow>
      {content}
    </>
  )
}

REMSApplication.propTypes = {
  application: PropTypes.object.isRequired,
}

const TitleRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  // Move margin from h1 to TitleRow to make state button align better
  margin-bottom: 0.5rem;
  h1 {
    margin-bottom: 0;
  }
`

const Wrapper = styled.div`
  overflow-y: auto;
  flex-shrink: 99999;
`

export default observer(REMSApplication)
