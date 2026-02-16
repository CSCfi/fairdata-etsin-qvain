import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'

const ApplicationFormValues = observer(() => {
  const {
    Locale: { getValueTranslation },
    Qvain: {
      REMSApplications: { selectedApplication },
    },
  } = useStores()

  const fieldValues = []
  const forms = selectedApplication['application/forms']
  for (const form of forms) {
    const formId = form['form/id']
    const fields = form['form/fields']
    for (const field of fields) {
      const fieldId = field['field/id']
      const key = `${formId}-${fieldId}`
      fieldValues.push({
        key,
        label: getValueTranslation(field['field/title']),
        value: field['field/value'] || '–',
      })
    }
  }

  return (
    <ul>
      {fieldValues.map(f => (
        <div key={f.key}>
          <h4>{f.label}</h4>
          <div>{f.value}</div>
        </div>
      ))}
    </ul>
  )
})

export default ApplicationFormValues
