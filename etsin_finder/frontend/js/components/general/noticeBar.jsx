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

import { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { darken } from 'polished'
import Translate from '@/utils/Translate'
import checkColor from '../../styles/styledUtils'
import { TransparentButton } from './button'
import withCustomProps from '@/utils/withCustomProps'

export default class NoticeBar extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    bg: PropTypes.string,
    color: PropTypes.string,
    position: PropTypes.string,
    z: PropTypes.string,
    duration: PropTypes.number,
    className: PropTypes.string,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    color: 'white',
    bg: 'primary',
    position: 'relative',
    z: '0',
    duration: 0,
    className: '',
    onClose: null,
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
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    if (!this.state.open) {
      return null
    }
    return (
      <Bar
        z={this.props.z}
        position={this.props.position}
        bg={this.props.bg}
        color={this.props.color}
        open={this.state.open}
        className={this.props.className}
      >
        <NoticeText>{this.props.children}</NoticeText>
        {!this.props.duration && (
          <CloseButton onClick={this.close} role="button" aria-pressed={!this.state.open}>
            <Translate content="general.notice.SRhide" className="sr-only" />
            <FontAwesomeIcon icon={faTimes} aria-hidden />
          </CloseButton>
        )}
      </Bar>
    )
  }
}

const Bar = withCustomProps(styled.div)`
  width: 100%;
  z-index: ${p => p.z};
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
  a {
    color: #00284f;
    &:hover {
      color: ${darken(0.1, '#00284f')};
    }
  }
  display: flex;
  margin-bottom: 0.5rem;
`

const NoticeText = styled.h3`
  padding: 0.25em 0 0.25em 0.5em;
  margin-bottom: 0;
  text-align: center;
  flex-grow: 1;
`

const CloseButton = styled(TransparentButton)`
  color: white;
  &:hover {
    text-decoration: none;
  }
`
