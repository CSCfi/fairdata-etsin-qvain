import React, { useState } from 'react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import Tooltip from './tooltip'
import { HelpIcon } from './form'

const QvainTooltip = ({ tooltipAriaLabel, tooltipContent }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const TooltipContent = tooltipContent

  return (
    <Tooltip
      isOpen={tooltipOpen}
      close={() => setTooltipOpen(!tooltipOpen)}
      align="Right"
      text={<TooltipContent />}
    >
      <HelpIcon
        aria-label={translate(tooltipAriaLabel)}
        onClick={() => setTooltipOpen(!tooltipOpen)}
      />
    </Tooltip>
  )
}

QvainTooltip.propTypes = {
  tooltipAriaLabel: PropTypes.string.isRequired,
  tooltipContent: PropTypes.elementType.isRequired,
}

export default QvainTooltip
