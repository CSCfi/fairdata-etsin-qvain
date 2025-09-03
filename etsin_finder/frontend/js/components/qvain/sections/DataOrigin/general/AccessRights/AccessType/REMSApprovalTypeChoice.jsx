import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useStores } from '@/stores/stores'
import { RadioInput, Label, FormField } from '@/components/qvain/general/modal/form'

const REMSApprovalTypeChoice = ({ value, label }) => {
  const {
    Locale: { translate },
    Qvain: { DataAccess },
  } = useStores()

  const handler = e => {
    DataAccess.remsApprovalType.set(e.target.value || null)
  }

  // Use '' in the input to represent null/undefined value
  const checked =
    DataAccess.remsApprovalType.value === value ||
    (value === '' && !DataAccess.remsApprovalType.value)

  const id = `rems-approval-type-${value || 'disabled'}`

  return (
    <FormField>
      <RadioInput
        type="radio"
        id={id}
        name={id}
        checked={checked}
        value={value}
        onChange={handler}
      />
      <Label htmlFor={id}>{translate(label)}</Label>
    </FormField>
  )
}

REMSApprovalTypeChoice.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default observer(REMSApprovalTypeChoice)
