import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import checkColor from '../../utils/styledUtils'
import { TransparentButton } from './button'

export default class NoticeBar extends React.Component {
  state = {
    open: true,
  }

  close = () => {
    this.setState({
      open: false,
    })
  }

  render() {
    return (
      <Bar
        z={this.props.z}
        position={this.props.position}
        bg={this.props.bg}
        color={this.props.color}
        open={this.state.open}
      >
        <NoticeText>{this.props.text}</NoticeText>
        <CloseButton onClick={this.close} role="button" aria-pressed={!this.state.open}>
          <span className="sr-only">Hide notice</span>
          X
        </CloseButton>
      </Bar>
    )
  }
}

const Bar = styled.div`
  width: 100%;
  z-index: ${p => p.z};
  max-height: ${p => (p.open ? '4em' : '0em')};
  background-color: ${props => checkColor(props.bg)};
  ${p =>
    p.border &&
    `border: 2px solid ${p.border_color ? checkColor(p.border_color) : 'black'};`} display: flex;
  color: ${props => checkColor(props.color)};
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  position: ${p => p.position};
`

const NoticeText = styled.h3`
  padding: 0.5em 1em;
  margin-bottom: 0;
  text-align: center;
`

const CloseButton = styled(TransparentButton)`
  position: absolute;
  right: 1em;
  color: white;
`

NoticeBar.defaultProps = {
  color: 'white',
  bg: 'primary',
  position: 'inherit',
  z: '0',
}

NoticeBar.propTypes = {
  text: PropTypes.string.isRequired,
  bg: PropTypes.string,
  color: PropTypes.string,
  position: PropTypes.string,
  z: PropTypes.string,
}
