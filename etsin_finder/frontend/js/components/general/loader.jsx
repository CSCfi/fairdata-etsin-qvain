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

const Loader = ({ color, size, margin, spinnerSize, active, left }) => {
  const spinner = <Spinner color={color} size={size} />

  if (left) {
    return (
      <HolderLeft size={size} margin={margin} className={`${active ? 'loader-active' : ''}`}>
        {spinner}
      </HolderLeft>
    )
  }
  return (
    <Holder
      spinnerSize={spinnerSize}
      margin={margin}
      className={`${active ? 'loader-active' : ''}`}
    >
      {spinner}
    </Holder>
  )
}

export default Loader

const Holder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  max-height: 0em;
  overflow: hidden;
  margin: 0;
  &.loader-active {
    margin: ${props => props.margin};
    max-height: 6em;
    div {
      border-width: ${p => p.spinnerSize};
    }
  }
`

/* prettier-ignore */
export const Spinner = styled.div`
  height: ${p => p.size};
  width: ${p => p.size};
  animation: spinner 0.8s infinite linear;
  border: ${p => p.spinnerSize} solid ${p => (p.color ? p.color : p.theme.color.primary)};
  border-right-color: transparent;
  border-radius: 50%;
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const HolderLeft = styled(Holder)`
  justify-content: left;
  padding: 0 0 0 1em;
`

Loader.defaultProps = {
  left: false,
  margin: '0',
  color: '',
  size: '2.5em',
  spinnerSize: '6px',
}

Loader.propTypes = {
  left: PropTypes.bool,
  margin: PropTypes.string,
  active: PropTypes.bool.isRequired,
  color: PropTypes.string,
  size: PropTypes.string,
  spinnerSize: PropTypes.string,
}
