import React, { Component } from 'react'
import styled from 'styled-components'
import Button from '../../general/button'

// prettier-ignore
const IdnLink = styled(Button)`
  background-color: ${props => props.theme.color.primary};
  border: ${props => props.theme.color.primary};
  width: unset;
  color: white;
  border-radius: 0.3em;
  display: flex;
  padding: 0;
  align-items: center;
  &:hover {
    color: white;
  }
`

const Prefix = styled.div`
  background-color: ${props => props.theme.color.dark};
  color: white;
  font-weight: 700;
  border-top-left-radius: 0.3em;
  margin: 0;
  border-bottom-left-radius: 0.3em;
  padding: 0.4em 0.5em 0.4em 0.7em;
  align-self: stretch;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  &:hover {
    background-color: ${props => props.theme.color.dark};
  }
`

const IDN = styled.div`
  font-size: 0.9em;
  padding: 0.4em 1em 0.4em 0.5em;
`

const IdnButton = styled(Button)`
  width: 100%;
  margin: 0;
`

export default class Identifier extends Component {
  constructor(props) {
    super(props)
    const url = this.makeLink(this.props.idn)
    const prefix = this.prefix(this.props.idn)
    this.state = { url, prefix }
  }

  makeLink(idn) {
    const sub3 = idn.substring(0, 3)
    const sub4 = idn.substring(0, 4)
    if (sub3 === 'urn' || sub3 === 'doi') {
      const page = sub3 === 'doi' ? 'https://doi.org' : 'https://urn.fi'
      return `${page}/${idn}`
    } else if (sub4 === 'http') {
      return idn
    }
    return false
  }

  parseIdn(idn) {
    console.log('idn', idn)
    const sub3 = idn.substring(0, 3)
    const sub4 = idn.substring(0, 4)
    if (sub3 === 'urn' || sub3 === 'doi') {
      return sub3
    }
    if (sub4 === 'http') {
      return new URL(idn).pathname.slice(1)
    }
    return idn
  }

  prefix(idn) {
    let id = idn
    const sub4 = id.substring(0, 4)
    if (sub4 === 'http') {
      id = new URL(idn).pathname.slice(1)
    }
    const sub3 = id.substring(0, 3)
    if (sub3 === 'urn' || sub3 === 'doi') {
      return sub3
    }
    return ''
  }

  render() {
    if (!this.state.url) {
      return this.props.children
    }
    if (this.props.button) {
      return <IdnButton {...this.props}>{this.props.children}</IdnButton>
    }
    return (
      <IdnLink href={this.state.url} {...this.props} title={this.state.url}>
        {this.state.prefix ? <Prefix>{this.state.prefix}</Prefix> : null}
        <IDN>{this.parseIdn(this.props.children)}</IDN>
      </IdnLink>
    )
  }
}
