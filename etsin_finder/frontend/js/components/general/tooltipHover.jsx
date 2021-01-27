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

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const TooltipHover = props => {
  const { position, children, showOnClick, ...restProps } = props
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    setClicked(false)
  }, [props.title])

  const hide = e => {
    setClicked(false)
    document.removeEventListener('click', hide)
    e.preventDefault()
  }

  const toggle = e => {
    if (clicked) {
      document.removeEventListener('click', hide)
      setClicked(false)
    } else {
      document.addEventListener('click', hide)
      setClicked(true)
    }
    e.preventDefault()
  }

  return (
    <Tip
      forceShow={clicked && showOnClick}
      onClick={toggle}
      position={position.toLowerCase()}
      {...restProps}
    >
      {children}
    </Tip>
  )
}

TooltipHover.defaultProps = {
  position: 'top',
  title: '',
  showOnHover: true,
  showOnClick: false,
}

TooltipHover.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
  position: PropTypes.oneOf(['top', 'right']),
  title: PropTypes.string,
  showOnHover: PropTypes.bool,
  showOnClick: PropTypes.bool,
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
    ${props => !props.title && 'display: none;'}
    pointer-events: none;
    font-size: 0.8em;
    transition: all 0.3s ease;
    opacity: 0;
    content: "${props => props.title}";
    padding: 0.1em 0.7em;
    position: absolute;
    ${props => getContainerPosition(props.position)}
    max-width: 12rem;
    width: max-content;
    text-align: center;
    color: ${props => props.fg};
    background-color: ${props => props.bg};
    border-radius: 5px;
  }
  &:after {
    ${props => !props.title && 'display: none;'}
    transition: all 0.3s ease;
    opacity: 0;
    position: absolute;
    ${props => getTipPosition(props.position)}
    content: ' ';
    border: 6px solid transparent;
    border-${props => props.position}-color: ${props => props.bg};
  }
  ${props =>
    props.showOnHover &&
    `
  &:hover {
    &:before,
    &:after {
      opacity: 1;
    }
  }
  `}

  ${props =>
    props.forceShow &&
    `
  &:before,
  &:after {
    opacity: 1;
  }`}
`
