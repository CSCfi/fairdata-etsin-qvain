import React, { Component } from 'react'
import Transition from 'react-transition-group/Transition'

export default class HeightTransition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultStyle: {
        width: '100%',
        transition: `height ${this.props.duration}ms ease-in-out`,
        height: '0px',
      },
      transitionStyles: {
        entering: {
          height: '0px',
        },
        entered: {
          height: 'auto',
        },
        exiting: {
          height: 'auto',
        },
        exited: {
          height: '0px',
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
        },
        entered: {
          height: `${height}px`,
        },
        exiting: {
          height: `${height}px`,
        },
        exited: {
          height: '0px',
        },
      },
    })
  }

  resetHeight = () => {
    this.setState({
      transitionStyles: {
        entering: {
          height: '0px',
        },
        entered: {
          height: 'auto',
        },
        exiting: {
          height: 'auto',
        },
        exited: {
          height: '0px',
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
