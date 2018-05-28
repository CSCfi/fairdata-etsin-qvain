import React, { Component } from 'react'
import Transition from 'react-transition-group/Transition'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class HeightTransition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transitionStyles: {
        entering: {
          height: '0px',
          visibility: 'inherit',
        },
        entered: {
          height: 'auto',
          visibility: 'inherit',
        },
        exiting: {
          height: 'auto',
          visibility: 'inherit',
        },
        exited: {
          height: '0px',
          visibility: 'hidden',
        },
      },
    }
  }

  getHeight = node => {
    const height = node.scrollHeight
    this.setState({
      transitionStyles: {
        entering: {
          height: '0px',
          visibility: 'inherit',
        },
        entered: {
          height: `${height}px`,
          visibility: 'inherit',
        },
        exiting: {
          height: `${height}px`,
          visibility: 'inherit',
        },
        exited: {
          height: '0px',
          visibility: 'hidden',
        },
      },
    })
  }

  resetHeight = () => {
    this.setState({
      transitionStyles: {
        entering: {
          height: '0px',
          visibility: 'inherit',
        },
        entered: {
          height: 'auto',
          visibility: 'inherit',
        },
        exiting: {
          height: 'auto',
          visibility: 'inherit',
        },
        exited: {
          height: '0px',
          visibility: 'hidden',
        },
      },
    })
  }

  render() {
    return (
      <Transition
        in={this.props.in}
        timeout={0}
        onExit={node => this.getHeight(node)}
        onEnter={node => this.getHeight(node)}
        addEndListener={node => {
          node.addEventListener('transitionend', this.resetHeight, false)
        }}
      >
        {state => (
          <TransitionDiv
            visibility={this.state.transitionStyles[state].visibility}
            height={this.state.transitionStyles[state].height}
            duration={this.props.duration}
            onlyMobile={this.props.onlyMobile}
          >
            {this.props.children}
          </TransitionDiv>
        )}
      </Transition>
    )
  }
}

const TransitionDiv = styled.div.attrs({
  height: props => (props.height ? props.height : '0px'),
  visibility: props => (props.visibility ? props.visibility : 'inherit'),
})`
  visibility: ${props => props.visibility};
  height: ${props => props.height};
  width: 100%;
  transition: height ${props => props.duration}ms ease-in-out;
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    visibility: ${props => (props.onlyMobile ? 'inherit' : props.visibility)};
    height: ${props => (props.onlyMobile ? 'auto' : props.height)};
  }
`

HeightTransition.defaultProps = {
  onlyMobile: false,
}

HeightTransition.propTypes = {
  duration: PropTypes.number.isRequired,
  in: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onlyMobile: PropTypes.bool,
}
