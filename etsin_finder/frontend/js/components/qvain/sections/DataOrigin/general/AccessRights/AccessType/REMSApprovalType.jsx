import { observer } from 'mobx-react'
import React from 'react'
import styled from 'styled-components'

import { FieldGroup, TitleSmall } from '@/components/qvain/general/V2'
import { useStores } from '@/stores/stores'
import REMSApprovalTypeChoice from './REMSApprovalTypeChoice'

const REMSApprovalType = () => {
  const {
    Locale: { translate },
  } = useStores()

  return (
    <fieldset>
      <TitleSmall as="legend">
        {translate('qvain.rightsAndLicenses.dataAccess.remsApprovalType.title')}
      </TitleSmall>
      <RadioRow data-cy="rems-approval-type">
        <REMSApprovalTypeChoice
          value=""
          label="qvain.rightsAndLicenses.dataAccess.remsApprovalType.disabled"
        />
        <REMSApprovalTypeChoice
          value="automatic"
          label="qvain.rightsAndLicenses.dataAccess.remsApprovalType.automatic"
        />
        <REMSApprovalTypeChoice
          value="manual"
          label="qvain.rightsAndLicenses.dataAccess.remsApprovalType.manual"
        />
      </RadioRow>
    </fieldset>
  )
}

const RadioRow = styled(FieldGroup)`
  flex-direction: row;
`

export default observer(REMSApprovalType)
