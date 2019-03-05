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

const Tooltip = props => (
  <Tip {...props} aria-hidden="true">
    {props.children}
  </Tip>
)

export default Tooltip

const Tip = styled.div.attrs(props => ({
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
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, -6px);
    white-space: nowrap;
    color: ${props => props.fg};
    background-color: ${props => props.bg};
    border-radius: 5px;
  }
  &:after {
    transition: all 0.3s ease;
    opacity: 0;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, 6px);
    content: ' ';
    border: 6px solid transparent;
    border-top-color: ${props => props.bg};
  }
  &:hover {
    &:before,
    &:after {
      opacity: 1;
    }
  }
`

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
}
