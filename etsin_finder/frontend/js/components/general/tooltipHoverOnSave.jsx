{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

/**
 * This file contains functionality copied from qvain/general/tooltip.jsx
 *
 * This is, until further notice, done to keep Etsin and Qvain Light separate, as two modules in the same app.
 */

import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TooltipHoverOnSave = ({ isOpen, text, children }) => {
  const wrapperTooltipButtonRef = useRef(null)
  const wrapperTooltipCardRef = useRef(null)

  let tooltip = (
        <>
          <span ref={wrapperTooltipButtonRef}>
            {children}
          </span>
          <Wrapper ref={wrapperTooltipCardRef}>
            <TooltipDown>
              <TooltipArrowDown />
              <TooltipText>
                {"Publishing requires the following fields:"}
                <br></br>
                {text}
                {"And the following actor(s) must be defined:"}
              </TooltipText>
            </TooltipDown>
          </Wrapper>
        </>
      )
  return isOpen ? tooltip : children
}

TooltipHoverOnSave.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  text: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
}

export default TooltipHoverOnSave

const Wrapper = styled.span`
  position: relative;
`

const TooltipStyle = styled.div`
  z-index: 10;
  text-align: left;
  text-align: start;
  text-shadow: none;
  text-transform: none;
  white-space: normal;
  word-break: normal;
  word-spacing: normal;
  word-wrap: normal;
  position: absolute;
  border: 6px solid transparent;
  border-${props => props.position}-color: ${props => props.bg};
`

const TooltipDown = styled(TooltipStyle)`
  display: inline-block;
  margin-top: -5px;
  left: -1em;
  top: 30px;
`
const TooltipArrow = styled.div`
  width: 0;
  height: 0;
`

const TooltipArrowDown = styled(TooltipArrow)`
  -webkit-filter: drop-shadow(0px -1px 1px rgba(0, 0, 0, 0.3));
  filter: drop-shadow(0px -1px 1px rgba(0, 0, 0, 0.3));
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
  margin-left: 10px;
`

const TooltipText = styled.div`
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: max-content;
  padding: 10px 15px;
  color: ${p => p.theme.color.dark};
  font-size: initial;
  line-height: initial;
  font-weight: initial;
  text-align: inherit;
  background-color: ${p => p.theme.color.white};
  @media (max-width: ${p => p.theme.breakpoints.sm}) {
    max-width: 200px;
  }
`
