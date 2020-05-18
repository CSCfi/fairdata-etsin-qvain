import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import Tooltip from './tooltip'
import { HelpIcon } from './form'

class QvainTooltip extends PureComponent {
  static propTypes = {
    tooltipAriaLabel: PropTypes.string.isRequired,
    tooltipContent: PropTypes.elementType.isRequired,
  }

  state = {
    tooltipOpen: false,
  }

  render() {
    const { tooltipContent, tooltipAriaLabel } = this.props
    const TooltipContent = tooltipContent
    return (
      <Tooltip
        isOpen={this.state.tooltipOpen}
        close={() => this.setState((prevState) => ({ tooltipOpen: !prevState.tooltipOpen }))}
        align="Right"
        text={<TooltipContent />}
      >
        <HelpIcon
          aria-label={translate(tooltipAriaLabel)}
          onClick={() => this.setState((prevState) => ({ tooltipOpen: !prevState.tooltipOpen }))}
        />
      </Tooltip>
    )
  }
}

export default QvainTooltip
