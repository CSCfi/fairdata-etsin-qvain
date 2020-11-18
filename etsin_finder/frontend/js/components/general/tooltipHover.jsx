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

import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const TooltipHover = props => {
  const { position, children, ...restProps } = props
  return (
    <Tip position={position.toLowerCase()} {...restProps}>
      {children}
    </Tip>
  )
}

TooltipHover.defaultProps = {
  position: 'top',
}

TooltipHover.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
  position: PropTypes.oneOf(['top', 'right']),
}

export default TooltipHover

function getContainerPosition(position) {
  switch (position) {
    case 'top':
      return `
        transform: translate(-50%, -6px);
        bottom: 100%;
        left: 50%;`
    case 'right':
      return `
        transform: translate(10px, 0);
        bottom: 0%;
        left: 100%;
        `
    default:
      return null
  }
}

function getTipPosition(position) {
  switch (position) {
    case 'right':
      return `
        bottom: 50%;
        right: 0%;
        transform: translate(10px, 5px);`
    case 'top':
      return `
        bottom: 100%;
        left: 50%;
        transform: translate(-50%, 6px);`
    default:
      return null
  }
}

const Tip = styled.span.attrs(props => ({
  bg: props.theme.color.darkgray,
  fg: props.theme.color.white,
}))`
  display: inline-block;
  position: relative;
  color: inherit;
  background-color: transparent;
  &:before {
    font-size: 0.8em;
    transition: all 0.3s ease;
    opacity: 0;
    content: "${props => props.title}";
    padding: 0.1em 0.7em;
    position: absolute;
    ${props => getContainerPosition(props.position)}
    white-space: nowrap;
    color: ${props => props.fg};
    background-color: ${props => props.bg};
    border-radius: 5px;
  }
  &:after {
    transition: all 0.3s ease;
    opacity: 0;
    position: absolute;
    ${props => getTipPosition(props.position)}
    content: ' ';
    border: 6px solid transparent;
    border-${props => props.position}-color: ${props => props.bg};
  }
  &:hover {
    &:before,
    &:after {
      opacity: 1;
    }
  }
`
