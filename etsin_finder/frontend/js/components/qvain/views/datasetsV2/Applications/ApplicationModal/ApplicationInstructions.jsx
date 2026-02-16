import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'

import { ApplicationSection } from './styled'

const ApplicationInstructions = () => {
  const {
    Locale: { getValueTranslation, translate },
    Qvain: {
      REMSApplications: { selectedApplication },
    },
  } = useStores()

  const dataset = selectedApplication.dataset

  const instructionValues = []
  const instructionFields = {
    data_access_application_instructions: 'applicationInstructions',
    data_access_reviewer_instructions: 'reviewerInstructions',
  }
  for (const field in instructionFields) {
    const value = dataset.access_rights[field]
    if (value) {
      instructionValues.push({
        key: instructionFields[field],
        label: translate(`qvain.rightsAndLicenses.dataAccess.${instructionFields[field]}`),
        value: getValueTranslation(value),
      })
    }
  }
  let instructions = null
  if (instructionValues.length > 0) {
    instructions = (
      <>
        <h3>{translate('qvain.applications.modal.instructions')}</h3>
        {instructionValues.map(v => (
          <div key={v.key}>
            <h4>{v.label}</h4>
            <p>{v.value}</p>
          </div>
        ))}
      </>
    )
  }
  if (!instructions) {
    return null
  }

  return <ApplicationSection>{instructions}</ApplicationSection>
}

export default observer(ApplicationInstructions)
