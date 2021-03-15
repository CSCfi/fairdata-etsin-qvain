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

import { Button } from '../general/button'
import TooltipHover from '../general/tooltipHover'
import { useStores } from '../../utils/stores'

const CopyToClipboard = ({
  content,
  label,
  tooltip,
  tooltipSuccess,
  tooltipPosition,
  horizontal,
}) => {
  const Stores = useStores()
  const { lang } = Stores.Locale
  const { announce } = Stores.Accessibility

  const [tooltipText, setTooltipText] = useState('dataset.copyToClipboard')
  const [copiedStatus, setCopiedStatus] = useState(false)

  const onClick = () => {
    navigator.clipboard.writeText(content)
    setCopiedStatus(true)
    setTooltipText(tooltipSuccess)
    announce(translate(tooltipSuccess, { locale: lang }))
    setTimeout(() => {
      setCopiedStatus(false)
      setTooltipText(tooltip)
    }, 4000)
  }

  // return styled link
  return (
    <Translate
      component={TooltipHover}
      attributes={{ title: tooltipText }}
      position={tooltipPosition}
    >
      <IconButton horizontal={horizontal} onClick={onClick}>
        <Hide status={copiedStatus}>
          <FontAwesomeIcon icon={faClipboard} />
          <Translate content={label} />
        </Hide>
        {copiedStatus && <Check icon={faCheck} size={!horizontal ? '2x' : '1x'} />}
      </IconButton>
    </Translate>
  )
}

const Hide = styled.div`
  ${p => p.status && 'visibility: hidden;'}
`

const Check = styled(FontAwesomeIcon).attrs({ icon: faCheck })`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
`

const IconButton = styled(Button)`
  height: 100%;
  width: 4em;
  margin: 0;
  border-style: none;
  font-size: 0.7em;
  word-break: initial;
  display: inherit;
  position: relative;

  ${p =>
    p.horizontal &&
    `
    padding: 0.25rem 1rem;
    width: auto;
    font-size: 0.9em;
    & span:not(:empty) {
      margin-left: 0.5rem;
    }
  `}
`

CopyToClipboard.propTypes = {
  content: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  tooltipSuccess: PropTypes.string.isRequired,
  tooltipPosition: PropTypes.oneOf(['top', 'right', 'left']),
  horizontal: PropTypes.bool,
}

CopyToClipboard.defaultProps = {
  tooltipPosition: 'top',
  horizontal: false,
}

export default CopyToClipboard
