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

import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard, faCheck } from '@fortawesome/free-solid-svg-icons'
import translate from 'counterpart'
import Translate from 'react-translate-component'

import { Link, Button } from '../general/button'
import idnToLink from '../../utils/idnToLink'
import TooltipHover from '../general/tooltipHover'
import { useStores } from '../../utils/stores'

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

  const Stores = useStores()
  const { lang } = Stores.Locale
  const { announce } = Stores.Accessibility

  const url = idnToLink(idn)
  const prefix = setPrefix(idn)
  const text = prefix === 'doi' ? idn.substring(4) : idn
  const [tooltipText, setTooltipText] = useState(
    translate('dataset.copyToClipboard', { locale: lang })
  )
  const [copiedStatus, setCopiedStatus] = useState(false)

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
      <TooltipHover title={tooltipText}>
        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(url)
            setCopiedStatus(true)
            setTooltipText(translate('dataset.copyToClipboardSuccess', { locale: lang }))
            announce(translate('dataset.copyToClipboardSuccess', { locale: lang }))
            setTimeout(() => {
              setCopiedStatus(false)
              setTooltipText(translate('dataset.copyToClipboard', { locale: lang }))
            }, 3000)
          }}
        >
          <FontAwesomeIcon
            icon={copiedStatus ? faCheck : faClipboard}
            size={copiedStatus ? '2x' : '1x'}
          />
          <Translate content={copiedStatus ? '' : 'dataset.copy'} />
        </IconButton>
      </TooltipHover>
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

const Prefix = styled.div`
  background-color: #4f4f4f;
  color: white;
  font-weight: 700;
  border-top-left-radius: 0.25em;
  margin: 0;
  border-bottom-left-radius: 0.25em;
  padding: 0.5em 0.5em 0.4em 0.7em;
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

const IconButton = styled(Button)`
  height: 100%;
  width: 4em;
  margin: 0;
  border-style: none;
  margin-left: 0.3em;
  font-size: 0.7em;
  word-break: initial;
  display: inherit;
`

Identifier.propTypes = {
  idn: PropTypes.string.isRequired,
}

export default Identifier
