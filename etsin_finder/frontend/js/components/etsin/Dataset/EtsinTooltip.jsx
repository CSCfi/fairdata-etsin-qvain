import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { HelpIcon } from '@/components/qvain/general/modal/form'
import etsinTheme from '@/styles/theme'

const EtsinTooltip = ({ tooltip }) => {
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
    <Wrapper ref={tooltipRef}>
      <Translate
        component={HelpIcon}
        attributes={{
          'aria-label': `${tooltip.infoAriaLabel}`,
        }}
        onClick={() => setTooltipOpen(!tooltipOpen)}
        align="Left"
      />
      <Tooltip isOpen={tooltipOpen}>
        <Translate component="span" content={tooltip.infoText} />
      </Tooltip>
    </Wrapper>
  )
}

export default EtsinTooltip

EtsinTooltip.propTypes = {
  tooltip: PropTypes.object.isRequired,
}

const Wrapper = styled.span``

const Tooltip = styled.div`
  z-index: 10;
  position: absolute;
  bottom: 2.1em;
  left: 5%;
  width: 90%;
  opacity: 90%;
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  background-color: ${etsinTheme.color.darker};
  padding: 0.5em;
  border-radius: 4px;

  > span {
    color: white;
    font-size: 0.9em;
    font-weight: normal;
  }
`
