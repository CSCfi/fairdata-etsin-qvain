import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'
import { useStores } from '@/stores/stores'

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

  return (
    <label>
      <input
        type="radio"
        id="rems-approval-type"
        name="rems-approval-type"
        checked={checked}
        value={value}
        onChange={handler}
      />
      {translate(label)}
    </label>
  )
}

REMSApprovalTypeChoice.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default observer(REMSApprovalTypeChoice)
