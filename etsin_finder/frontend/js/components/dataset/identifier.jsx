{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ClipboardIcon from 'react-clipboard-icon'
import translate from 'counterpart'

import { Link } from '../general/button'
import idnToLink from '../../utils/idnToLink'

export default class Identifier extends Component {
  cliboardStyle = {
    verticalAlign: 'bottom',
    marginLeft: '3px',
    display: 'inline-block',
    cursor: 'pointer',
  }

  constructor(props) {
    super(props)
    const url = idnToLink(this.props.idn)
    const prefix = this.prefix(this.props.idn)
    const text = prefix === 'doi' ? this.props.idn.substring(4) : this.props.idn
    this.state = { url, prefix, text }
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
      <IdnSpan>
        <IdnLink
          noMargin
          href={this.state.url}
          target="_blank"
          rel="noopener noreferrer"
          {...this.props}
          title={this.state.url}
        >
          {this.state.prefix ? (
            <Prefix>
              <span aria-hidden>{this.state.prefix}</span>
              <span className="sr-only">{`${this.state.prefix}: `}</span>
            </Prefix>
          ) : null}
          <IDN>{this.state.text}</IDN>
        </IdnLink>
        <CopyToClipboard text={this.state.url} style={this.cliboardStyle}>
          <ClipboardIcon title={translate('dataset.copyToClipboard')} size={18} />
        </CopyToClipboard>
      </IdnSpan>
    )
  }
}

const IdnSpan = styled.div`
  display: -webkit-box;
  width: 100%;
`

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
  min-width: max-content;
  &:hover {
    background-color: ${props => props.theme.color.dark};
  }
`

const IDN = styled.div`
  font-size: 0.9em;
  padding: 0.4em 1em 0.4em 0.5em;
  text-align: left;
`

Identifier.propTypes = {
  idn: PropTypes.string.isRequired,
}
