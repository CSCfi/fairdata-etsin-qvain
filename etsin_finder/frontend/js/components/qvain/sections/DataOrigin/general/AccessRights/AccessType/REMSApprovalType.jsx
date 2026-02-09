import { observer } from 'mobx-react'
import styled from 'styled-components'

import { FieldGroup, TitleSmall } from '@/components/qvain/general/V2'
import { Required } from '@/components/qvain/general/V3'
import ValidationError from '@/components/qvain/general/errors/validationError'
import { useStores } from '@/stores/stores'
import REMSApprovalTypeChoice from './REMSApprovalTypeChoice'

const REMSApprovalType = () => {
  const {
    Locale: { translate },
    Qvain: {
      DataAccess: {
        remsApprovalType: { validationError, validate },
      },
      isManualREMSApprovalAllowed,
    },
  } = useStores()

  const disabledText = isManualREMSApprovalAllowed
    ? ''
    : 'qvain.rightsAndLicenses.dataAccess.remsApprovalType.manualDisabled'

  return (
    <fieldset onBlur={validate}>
      <TitleSmall as="legend">
        {translate('qvain.rightsAndLicenses.dataAccess.remsApprovalType.title')}
        <Required />
      </TitleSmall>
      <RadioRow data-cy="rems-approval-type">
        <REMSApprovalTypeChoice
          value="manual"
          disabled={!isManualREMSApprovalAllowed}
          label="qvain.rightsAndLicenses.dataAccess.remsApprovalType.manual"
          extra={disabledText}
        />
        <REMSApprovalTypeChoice
          value="automatic"
          label="qvain.rightsAndLicenses.dataAccess.remsApprovalType.automatic"
        />
      </RadioRow>
      {validationError && <ValidationError>{validationError}</ValidationError>}
    </fieldset>
  )
}

const RadioRow = styled(FieldGroup)`
  flex-direction: column;
  gap: 0.25rem;
`

export default observer(REMSApprovalType)
