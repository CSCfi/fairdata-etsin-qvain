import { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { HelpIcon } from '@/components/qvain/general/modal/form'
import withCustomProps from '@/utils/withCustomProps'

const EtsinTooltip = ({ tooltip, inverted, withMargin }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const tooltipRef = useRef(null)

  useEffect(() => {
    document.addEventListener('mousedown', handleClickToClose)
    return () => {
      document.removeEventListener('mousedown', handleClickToClose)
    }
  })

  const handleClickToClose = useCallback(
    event => {
      if (!tooltipRef.current.contains(event.target)) {
        setTooltipOpen(false)
      }
    },
    [setTooltipOpen]
  )

  return (
    <Wrapper ref={tooltipRef} inverted={inverted} withMargin={withMargin}>
      <Translate
        component={HelpIcon}
        attributes={{
          'aria-label': `${tooltip.infoAriaLabel}`,
        }}
        onClick={() => setTooltipOpen(!tooltipOpen)}
        align="Left"
      />
      <Tooltip isOpen={tooltipOpen}>
        <Translate component="span" content={tooltip.infoText} unsafe />
      </Tooltip>
    </Wrapper>
  )
}

export default EtsinTooltip

EtsinTooltip.propTypes = {
  tooltip: PropTypes.object.isRequired,
  inverted: PropTypes.bool,
  withMargin: PropTypes.bool,
}

EtsinTooltip.defaultProps = {
  inverted: false,
  withMargin: false,
}

// reaching for the tooltip help icon here
const Wrapper = withCustomProps(styled.span)`
  > * {
    > * {
      height: 1rem;
      cursor: pointer;
      margin: ${p => (p.withMargin ? '0 0 0 0.2em' : '0')};
      color: ${p => (p.inverted ? p.theme.color.primary : 'black')};
      &:hover {
        color: ${p => (p.inverted ? 'black' : p.theme.color.primary)};
      }
    }
  }
`

const Tooltip = withCustomProps(styled.div)`
  z-index: 10;
  position: absolute;
  bottom: 2.1em;
  left: 5%;
  width: 90%;
  visibility: ${p => (p.isOpen ? 'visible' : 'hidden')};
  background-color: white;
  padding: 0.7em;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.3);
  border-radius: 4px;

  > span {
    color: ${p => p.theme.color.darker};
    font-size: 0.9em;
    font-weight: normal;
  }
  > span:hover {
    color: ${p => p.theme.color.darker};
  }
`
