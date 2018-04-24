import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

class Loader extends Component {
  render() {
    if (this.props.left) {
      return (
        <HolderLeft
          margin={this.props.margin}
          className={`${this.props.active ? 'loader-active' : ''}`}
        >
          <Spinner color={this.props.color} />
        </HolderLeft>
      )
    }
    return (
      <Holder margin={this.props.margin} className={`${this.props.active ? 'loader-active' : ''}`}>
        <Spinner color={this.props.color} />
      </Holder>
    )
  }
}

export default Loader

const Holder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  max-height: 0em;
  transition: all 0.2s ease;
  overflow: hidden;
  margin: ${props => props.margin};
  &.loader-active {
    max-height: 4em;
    div {
      border-width: 6px;
    }
  }
`

const Spinner = styled.div`
  height: 2.5em;
  width: 2.5em;
  animation: spinner 0.8s infinite linear;
  border: 0px solid ${props => (props.color ? props.color : props.theme.color.primary)};
  border-right-color: transparent;
  border-radius: 50%;
  transition: all 0.3s ease;
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const HolderLeft = Holder.extend`
  justify-content: left;
  padding: 0 0 0 1em;
`

Loader.defaultProps = {
  left: false,
  margin: '0',
  color: '',
}

Loader.propTypes = {
  left: PropTypes.bool,
  margin: PropTypes.string,
  active: PropTypes.bool.isRequired,
  color: PropTypes.string,
}
