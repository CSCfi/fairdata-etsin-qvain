import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useStores } from '@/stores/stores'
import { RadioInput, Label, FormField } from '@/components/qvain/general/modal/form'

const REMSApprovalTypeChoice = ({ value, label, disabled = false }) => {
  const {
    Locale: { translate },
    Qvain: { DataAccess: { remsApprovalType } },
  } = useStores()

  const handler = e => {
    remsApprovalType.set(e.target.value || null)
    remsApprovalType.validate()
  }

  // Use '' in the input to represent null/undefined value
  const checked =
    remsApprovalType.value === value ||
    (value === '' && !remsApprovalType.value)

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
        disabled={disabled}
      />
      <Label disabled={disabled} htmlFor={id}>{translate(label)}</Label>
    </FormField>
  )
}

REMSApprovalTypeChoice.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

export default observer(REMSApprovalTypeChoice)
