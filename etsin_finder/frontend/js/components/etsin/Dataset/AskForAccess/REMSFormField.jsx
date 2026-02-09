import styled from 'styled-components'
import PropTypes from 'prop-types'

import { RequiredText } from '@/components/qvain/general/V2'
import { NarrowTextArea, Required } from '@/components/qvain/general/V3'
import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'

const REMSFormField = ({ applicationId, form, field, readOnly = false }) => {
  const {
    Locale: { getValueTranslation },
    Etsin: {
      EtsinDataset: {
        rems: { formValues, setFormValue },
      },
    },
  } = useStores()
  const title = getValueTranslation(field['field/title'])
  const required = field['field/optional'] ? null : true
  const formId = form['form/id']
  const fieldId = field['field/id']

  const fieldValue = formValues[applicationId]?.[formId]?.[fieldId] || ''

  const key = `${formId}-${fieldId}`

  const fieldType = field['field/type']
  if (fieldType != 'text') {
    console.warn(`Unsupported REMS form field type ${fieldType}`)
    return null
  }

  return (
    <StyledField>
      <h3>
        <label htmlFor={key}>
          {title}
          {required && <Required />}
        </label>
      </h3>
      <NarrowTextArea
        id={key}
        value={fieldValue}
        readOnly={readOnly}
        onChange={e => setFormValue(applicationId, formId, fieldId, e.target.value)}
      />
      {required && <RequiredText />}
    </StyledField>
  )
}

REMSFormField.propTypes = {
  applicationId: PropTypes.number.isRequired,
  form: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
}

const StyledField = styled.div`
  margin-top: 0.5rem;
`
export default observer(REMSFormField)
