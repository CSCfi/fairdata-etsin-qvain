import { observer } from 'mobx-react'
import REMSFormField from './REMSFormField'
import type { ApplicationForm } from '@/stores/view/etsin/etsin.rems'

type REMSFormsProps = {
  applicationId: number
  forms: ApplicationForm[]
  readOnly?: boolean
}

const REMSForms = ({ applicationId, forms, readOnly = false }: REMSFormsProps) => {
  const fields = []
  for (const form of forms) {
    const formId = form['form/id']
    for (const field of form['form/fields']) {
      const fieldId = field['field/id']
      const key = `${formId}-${fieldId}`
      fields.push(
        <REMSFormField
          key={key}
          applicationId={applicationId}
          form={form}
          field={field}
          readOnly={readOnly}
        />
      )
    }
  }
  return fields
}

export default observer(REMSForms)
