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
import Translate from 'react-translate-component'

import checkColor from '../../styles/styledUtils'
import { TransparentButton } from './button'

export default class NoticeBar extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    bg: PropTypes.string,
    color: PropTypes.string,
    position: PropTypes.string,
    z: PropTypes.string,
    duration: PropTypes.number,
  }

  static defaultProps = {
    color: 'white',
    bg: 'primary',
    position: 'relative',
    z: '0',
    duration: 0,
  }

  state = {
    open: true,
  }

  componentDidMount() {
    if (this.props.duration) {
      setTimeout(() => {
        this.close()
      }, this.props.duration)
    }
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
        <NoticeText>{this.props.children}</NoticeText>
        {!this.props.duration && (
          <CloseButton onClick={this.close} role="button" aria-pressed={!this.state.open}>
            <Translate content="general.notice.SRhide" className="sr-only" />
            X
          </CloseButton>
        )}
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
  overflow: hidden;
  position: ${p => p.position};
  top: 0;
  left: 0;
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
