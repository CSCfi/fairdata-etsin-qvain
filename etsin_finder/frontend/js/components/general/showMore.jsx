import React, { Component } from 'react'
import PropTypes from 'prop-types'

import HeightTransition from './animations/heightTransition'
import Button from './button'

export default class ShowMore extends Component {
  static propTypes = {
    open: PropTypes.bool,
    less: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    more: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    min: PropTypes.number.isRequired,
  }

  static defaultProps = {
    open: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: props.open,
    }
    this.toggle = this.toggle.bind(this)
    this.contentHeight = this.contentHeight.bind(this)
  }

  contentHeight(height) {
    this.setState({
      height,
    })
  }

  toggle() {
    this.setState({
      open: !this.state.open,
    })
  }

  render() {
    return (
      <div>
        <HeightTransition
          contentHeight={this.contentHeight}
          initialHeight={`${this.props.min}px`}
          endVisibility="initial"
          duration={200}
          in={this.state.open}
        >
          {console.log(this.state.height)}
          {this.props.children}
        </HeightTransition>
        {this.state.height < this.props.min && (
          <Button onClick={this.toggle}>
            {this.state.open ? this.props.less : this.props.more}
          </Button>
        )}
      </div>
    )
  }
}
