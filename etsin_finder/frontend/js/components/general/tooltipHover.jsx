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

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import withCustomProps from '@/utils/withCustomProps'

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
      onClick={showOnClick ? toggle : undefined}
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
  flexGrow: 0,
}

TooltipHover.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'right', 'left']),
  title: PropTypes.string,
  showOnHover: PropTypes.bool,
  showOnClick: PropTypes.bool,
  flexGrow: PropTypes.number,
}

export default TooltipHover

function getContainerPosition(position) {
  switch (position) {
    case 'left':
      return `
        transform: translate(-6px, 50%);
        bottom: 50%;
        right: 100%;`
    case 'right':
      return `
        transform: translate(6px, 50%);
        bottom: 50%;
        left: 100%;`
    case 'top':
      return `
        transform: translate(-50%, -6px);
        bottom: 100%;
        left: 50%;`
    default:
      return null
  }
}

function getTipPosition(position) {
  switch (position) {
    case 'left':
      return `
        bottom: 50%;
        right: 100%;
        transform: translate(6px, 50%);`
    case 'right':
      return `
        bottom: 50%;
        right: 0%;
        transform: translate(6px, 50%);`
    case 'top':
      return `
        bottom: 100%;
        left: 50%;
        transform: translate(-50%, 6px);`
    default:
      return null
  }
}

const Tip = withCustomProps(styled.span).attrs(props => ({
  bg: props.theme.color.darkgray,
  fg: props.theme.color.white,
}))`
  flex-grow: ${props => props.flexGrow};
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
