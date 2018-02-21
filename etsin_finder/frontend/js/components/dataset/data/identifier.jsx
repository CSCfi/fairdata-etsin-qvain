import React, { Component } from 'react'
import styled from 'styled-components'

const IdnLink = styled.a``

const IdnPlain = styled.span``

export default class Identifier extends Component {
  constructor(props) {
    super(props)
    this.state = { url: '' }
    this.makeLink = this.makeLink.bind(this)
    this.makeLink(this.props.idn)
  }

  makeLink(idn) {
    const sub3 = idn.substring(0, 3)
    const sub4 = idn.substring(0, 4)
    if (sub3 === 'urn' || sub3 === 'doi') {
      const page = sub3 === 'doi' ? 'https://doi.org' : 'https://urn.fi'
      this.setState({ url: `${page}/${idn}` })
    } else if (sub4 === 'http') {
      this.setState({ url: idn })
    }
  }

  render() {
    console.log(this.props.idn)
    if (!this.state.url) {
      return <IdnPlain {...this.props}>{this.props.children}</IdnPlain>
    }
    return (
      <IdnLink href={this.state.url} {...this.props} title={this.state.url}>
        {this.props.children}
      </IdnLink>
    )
  }
}
