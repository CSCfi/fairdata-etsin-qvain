import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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
    return <Hero className={this.state.classes}>{this.props.children}</Hero>
  }
}

const Hero = styled.div`
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    min-height: 300px;
  }
  &.hero-primary {
    background-color: ${props => props.theme.color.primary};
    color: white;
  }
  &.hero-full {
    width: 100%;
  }
`

HeroBanner.defaultProps = {
  className: '',
}

HeroBanner.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}
