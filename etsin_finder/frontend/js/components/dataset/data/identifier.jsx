import React, { Component } from 'react'
import styled from 'styled-components'
import Button from '../../general/button'

// prettier-ignore
const IdnLink = styled(Button)`
  background-color: ${props => props.theme.color.lightgray};
  border: ${props => props.theme.color.lightgray};
  width: unset;
  color: black;
  border-radius: 1em;
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
  border-bottom-left-radius: 1em;
  border-top-left-radius: 1em;
  padding: 0.4em 0.5em 0.4em 1em;
  align-self: stretch;
  display: flex;
  align-items: center;
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
    // const url = this.makeLink(this.props.idn)
    const url = this.makeLink('doi')
    this.state = { url }
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

  render() {
    if (!this.state.url) {
      return this.props.children
    }
    if (this.props.button) {
      return <IdnButton {...this.props}>{this.props.children}</IdnButton>
    }
    return (
      <IdnLink href={this.state.url} {...this.props} title={this.state.url}>
        <Prefix>DOI</Prefix>
        <IDN>{this.props.children}</IDN>
      </IdnLink>
    )
  }
}
