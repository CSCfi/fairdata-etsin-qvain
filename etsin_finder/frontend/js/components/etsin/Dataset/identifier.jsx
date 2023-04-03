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

import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Link, Prefix } from '../general/button'
import idnToLink from '@/utils/idnToLink'
import CopyToClipboard from './copyToClipboard'

const Identifier = ({ idn }) => {
  const setPrefix = idnText => {
    let id = idnText
    const sub4 = id.substring(0, 4)
    if (sub4 === 'http') {
      id = new URL(idnText).pathname.slice(1)
    }
    const sub3 = id.substring(0, 3)
    if (sub3 === 'urn' || sub3 === 'doi') {
      return sub3
    }
    return ''
  }

  const url = idnToLink(idn)
  const prefix = setPrefix(idn)
  const text = prefix === 'doi' ? idn.substring(4) : idn

  // display as text if not of type doi or urn
  if (!url) {
    return idn
  }
  // return styled link
  return (
    <IdnSpan>
      <IdnLink noMargin href={url} target="_blank" rel="noopener noreferrer" {...idn} title={url}>
        {prefix ? (
          <Prefix>
            <span aria-hidden>{prefix}</span>
            <span className="sr-only">{`${prefix}: `}</span>
          </Prefix>
        ) : null}
        <IDN id="idn-text">{text}</IDN>
      </IdnLink>
      <CopyToClipboard
        content={url || idn}
        label="dataset.copy"
        tooltip="dataset.copyToClipboard"
        tooltipSuccess="dataset.copyToClipboardSuccess"
      />
    </IdnSpan>
  )
}

const IdnSpan = styled.div`
  display: flex;
  width: fit-content;
  max-width: 100%;
  justify-content: space-between;
`

// prettier-ignore
const IdnLink = styled(Link)`
  margin-right: 0.25rem;
  background-color: ${props => props.theme.color.primary};
  border: ${props => props.theme.color.primary};
  width: fit-content;
  max-width: 100%;
  color: white;
  border-radius: 0.25em;
  border: none;
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

const IDN = styled.div`
  font-size: 0.9em;
  padding: 0.4em 1em 0.4em 0.5em;
  text-align: left;
  word-break: break-all;
`

Identifier.propTypes = {
  idn: PropTypes.string.isRequired,
}

export default Identifier
