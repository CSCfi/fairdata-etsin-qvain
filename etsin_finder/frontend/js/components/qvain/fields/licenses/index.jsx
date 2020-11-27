import React, { useState } from 'react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import AccessType from './accessType'
import Licenses from './licenses'
import { SectionTitle } from '../../general/section'
import Tooltip from '../../general/section/tooltip'
import { HelpIcon } from '../../general/modal/form'
import LicensesInfo from './licensesInfo'

const RightsAndLicenses = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  return (
    <div className="container">
      <SectionTitle>
        <Translate content="qvain.rightsAndLicenses.title" />
        <Tooltip
          isOpen={tooltipOpen}
          close={() => setTooltipOpen(!tooltipOpen)}
          align="Right"
          text={<LicensesInfo />}
        >
          <HelpIcon
            aria-label={translate('qvain.rightsAndLicenses.infoTitle')}
            onClick={() => setTooltipOpen(!tooltipOpen)}
          />
        </Tooltip>
      </SectionTitle>
      <Licenses />
      <AccessType />
    </div>
  )
}

export default RightsAndLicenses
