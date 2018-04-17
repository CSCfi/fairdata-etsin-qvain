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
          height: '474px',
        },
      },
    }
    this.heightRef = React.createRef()
  }

  getHeight = () => {
    const height = this.heightRef.current.scrollHeight
    this.setState({
      transitionStyles: {
        entering: {
          height: '0px',
        },
        entered: {
          height: `${height}px`,
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
      },
    })
  }

  render() {
    return (
      <Transition
        in={this.props.in}
        timeout={0}
        onExit={this.getHeight}
        onEnter={this.getHeight}
        addEndListener={node => {
          node.addEventListener('transitionend', this.resetHeight, false)
        }}
      >
        {state => (
          <div
            ref={this.heightRef}
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
