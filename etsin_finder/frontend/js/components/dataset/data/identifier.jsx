import React, { Component } from 'react'
import styled from 'styled-components'
import { Link } from '../../general/button'

// prettier-ignore
const IdnLink = styled(Link)`
  background-color: ${props => props.theme.color.primary};
  border: ${props => props.theme.color.primary};
  width: max-content;
  max-width: 100%;
  color: white;
  border-radius: 0.3em;
  display: flex;
  padding: 0;
  align-items: center;
  font-size: 0.875em;
  &:hover {
    color: white;
  }
  &:active {
    transition: 0.1s ease;
    box-shadow: 0px 2px 5px -2px rgba(0,0,0,0.7) inset;
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
      const page = sub3 === 'doi' ? 'https://doi.org' : 'http://urn.fi'
      return `${page}/${idn}`
    } else if (sub4 === 'http') {
      return idn
    }
    return false
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
    // display as text if not of type doi or urn
    if (!this.state.url) {
      return this.props.idn
    }

    // return styled link
    return (
      <IdnLink
        noMargin
        href={this.state.url}
        target="_blank"
        {...this.props}
        title={this.state.url}
      >
        {this.state.prefix ? <Prefix>{this.state.prefix}</Prefix> : null}
        <IDN>{this.props.idn}</IDN>
      </IdnLink>
    )
  }
}
