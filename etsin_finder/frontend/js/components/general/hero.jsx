import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class HeroBanner extends Component {
  constructor(props) {
    super(props)
    this.state = { classes: '' }
  }
  componentWillMount() {
    if (this.props.className) {
      this.setState({ classes: this.props.className })
    }
  }
  render() {
    return <div className={`hero ${this.state.classes}`}>{this.props.children}</div>
  }
}

HeroBanner.defaultProps = {
  className: '',
}

HeroBanner.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}
