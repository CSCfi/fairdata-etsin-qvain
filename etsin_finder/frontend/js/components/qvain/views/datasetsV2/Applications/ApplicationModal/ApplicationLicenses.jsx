import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import ApplicationLicense from './ApplicationLicense'

const ApplicationLicenses = observer(() => {
  const {
    Locale: { translate },
    Qvain: {
      REMSApplications: { selectedApplication },
    },
  } = useStores()

  const application = selectedApplication

  const applicant = application['application/applicant']
  const acceptedLicenseIds = application['application/accepted-licenses'][applicant['userid']] || []
  const acceptedLicenses = []
  const licenses = application['application/licenses']
  for (const lic of licenses) {
    if (acceptedLicenseIds.includes(lic['license/id'])) {
      acceptedLicenses.push(lic)
    }
  }

  return (
    <>
      <h3>{translate('qvain.applications.modal.terms')}</h3>
      <TermsList>
        {acceptedLicenses.map(lic => (
          <ApplicationLicense key={lic['license/id']} license={lic} />
        ))}
      </TermsList>
    </>
  )
})

const TermsList = styled.ul`
  margin-left: 1rem;
`

export default ApplicationLicenses
