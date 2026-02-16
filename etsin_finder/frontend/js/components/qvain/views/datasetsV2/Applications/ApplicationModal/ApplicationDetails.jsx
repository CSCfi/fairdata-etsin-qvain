import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'

import ApplicationActions from './ApplicationActions'
import ApplicationInstructions from './ApplicationInstructions'
import ApplicationLicenses from './ApplicationLicenses'
import { ApplicationSection } from './styled'
import ApplicationFormValues from './ApplicationFormValues'

const ApplicationDetails = observer(() => {
  const {
    Locale: { translate },
    Qvain: {
      REMSApplications: { selectedApplication },
    },
  } = useStores()

  const applicant = selectedApplication['application/applicant']

  return (
    <>
      <ApplicationInstructions />
      <ApplicationSection>
        <h3>{translate('qvain.applications.modal.application')}</h3>
        <h4>{translate('qvain.applications.modal.applicant')}</h4>
        <div>
          {applicant['name']} ({applicant['email']})
        </div>
        <ApplicationFormValues />
        <ApplicationLicenses />
      </ApplicationSection>

      <ApplicationActions />
    </>
  )
})

export default ApplicationDetails
