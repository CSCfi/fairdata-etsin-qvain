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

import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'

const TooltipHoverOnSave = ({ isOpen, children, errors, description }) => {
  const wrapperTooltipButtonRef = useRef(null)
  const wrapperTooltipCardRef = useRef(null)

  if (!isOpen || errors.length === 0) {
    return children
  }

  return (
    <>
      <span ref={wrapperTooltipButtonRef}>{children}</span>
      <Wrapper ref={wrapperTooltipCardRef}>
        <TooltipDownV2>
          <TooltipArrowDown />
          <TooltipTextBold>
            <Translate content={description} component={TooltipText} />
            <TooltipText>{errors}</TooltipText>
          </TooltipTextBold>
        </TooltipDownV2>
      </Wrapper>
    </>
  )
}
TooltipHoverOnSave.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  errors: PropTypes.array.isRequired,
  children: PropTypes.element.isRequired,
  description: PropTypes.string.isRequired,
}

export default TooltipHoverOnSave
const Wrapper = styled.span`
  position: relative;
`

const TooltipDownV2 = styled.div`
  z-index: 10;
  text-align: left;
  text-align: start;
  text-transform: none;
  white-space: normal;
  word-break: normal;
  word-spacing: normal;
  word-wrap: normal;
  position: absolute;
  color: ${props => props.theme.color.white};
  border-radius: 5px;
  display: inline-block;
  margin-top: -5px;
  left: -15em;
  top: 30px;
`

const TooltipArrowDown = styled.div`
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #6e6e6e;
  margin-left: 150px;
  width: 0;
  height: 0;
`

const TooltipText = styled.div`
  display: block;
  white-space: pre-line;
  max-width: 400px;
  width: max-content;
  padding-top: 10px;
  background: #6e6e6e;
  font-size: initial;
  line-height: initial;
  font-weight: initial;
  @media (max-width: ${p => p.theme.breakpoints.sm}) {
    max-width: 200px;
  }
`

const TooltipTextBold = styled(TooltipText)`
  font-weight: bold;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.3);
  padding: 10px 15px;
  border-radius: 5px;
  min-width: 440px;
`
