import React, { Component } from 'react'
import Transition from 'react-transition-group/Transition'
import PropTypes from 'prop-types'

export default class HeightTransition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultStyle: {
        width: '100%',
        transition: `height ${this.props.duration}ms ease-in-out`,
        height: '0px',
        display: 'initial',
      },
      transitionStyles: {
        entering: {
          height: '0px',
          display: 'initial',
        },
        entered: {
          height: 'auto',
          display: 'initial',
        },
        exiting: {
          height: 'auto',
          display: 'initial',
        },
        exited: {
          height: '0px',
          display: 'hidden',
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
          display: 'initial',
        },
        entered: {
          height: `${height}px`,
          display: 'initial',
        },
        exiting: {
          height: `${height}px`,
          display: 'initial',
        },
        exited: {
          height: '0px',
          display: 'hidden',
        },
      },
    })
  }

  resetHeight = () => {
    this.setState({
      transitionStyles: {
        entering: {
          height: '0px',
          display: 'initial',
        },
        entered: {
          height: 'auto',
          display: 'initial',
        },
        exiting: {
          height: 'auto',
          display: 'initial',
        },
        exited: {
          height: '0px',
          display: 'hidden',
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
          <div
            style={{
              ...this.state.defaultStyle,
              ...this.state.transitionStyles[state],
            }}
          >
            {this.props.children}
          </div>
        )}
      </Transition>
    )
  }
}

HeightTransition.propTypes = {
  duration: PropTypes.number.isRequired,
  in: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
}
