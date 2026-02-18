import { observer } from 'mobx-react'
import { useEffect } from 'react'
import styled from 'styled-components'

import Loader from '@/components/general/loader'
import { SaveButton } from '@/components/qvain/general/buttons'
import { useStores } from '@/utils/stores'
import PropTypes from 'prop-types'
import ApplicationState from './REMSApplicationState'
import REMSForms from './REMSForms'
import REMSLicenseList from './REMSLicenseList'
import REMSComments from './REMSComments'

const REMSApplication = ({ application }) => {
  const {
    Locale: { dateFormat, translate },
    Etsin: {
      EtsinDataset: {
        rems: { fetchApplicationDetails, isEditable, submitApplication, readyForSubmit },
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
  const readOnly = !isEditable(application)

  if (hasDetails) {
    const licenses = application['application/licenses'] || []
    const forms = application?.['application/forms'] || []
    content = (
      <Wrapper>
        <REMSLicenseList licenses={licenses} />
        <REMSForms
          applicationId={application['application/id']}
          forms={forms}
          readOnly={readOnly}
        />
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
      <REMSComments application={application} />
      {content}
      {!readOnly && (
        <Buttons>
          <SaveButton
            component={SaveButton}
            data-testid="submit-access-application"
            onClick={() => submitApplication(application)}
            disabled={!readyForSubmit(application)}
          >
            {translate('dataset.access_modal.submit')}
          </SaveButton>
        </Buttons>
      )}
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

const Buttons = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`

export default observer(REMSApplication)
