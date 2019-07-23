import React, { useState } from 'react'
import Translate from 'react-translate-component'
import AccessType from './accessType'
import Licenses from './licenses'
import { SectionTitle } from '../general/section'
import Tooltip from '../general/tooltip'
import { HelpIcon } from '../general/form'
import LicensesInfo from './licensesInfo'

const RightsAndLicenses = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  return (
    <div className="container">
      <SectionTitle>
        <Translate content="qvain.rightsAndLicenses.title" />
        <Tooltip
          isOpen={tooltipOpen}
          align="Right"
          text={<LicensesInfo />}
        >
          <HelpIcon
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
