import { observer } from 'mobx-react'
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
        {/* <REMSApprovalTypeChoice
          value=""
          label="qvain.rightsAndLicenses.dataAccess.remsApprovalType.disabled"
        /> */}
        <REMSApprovalTypeChoice
          value="manual"
          disabled
          label="qvain.rightsAndLicenses.dataAccess.remsApprovalType.manual"
        />
        <REMSApprovalTypeChoice
          value="automatic"
          label="qvain.rightsAndLicenses.dataAccess.remsApprovalType.automatic"
        />
      </RadioRow>
    </fieldset>
  )
}

const RadioRow = styled(FieldGroup)`
  flex-direction: column;
  gap: 0.25rem;
`

export default observer(REMSApprovalType)
