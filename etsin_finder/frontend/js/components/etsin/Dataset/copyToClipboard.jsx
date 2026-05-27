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

import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard, faCheck } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

import { Button } from '../general/button'
import TooltipHover from '@/components/general/tooltipHover'
import { useStores } from '@/utils/stores'
import withCustomProps from '@/utils/withCustomProps'

const CopyToClipboard = ({
  content,
  label,
  tooltip,
  tooltipSuccess,
  tooltipPosition,
  horizontal,
  disabled,
}) => {
  const Stores = useStores()
  const { lang } = Stores.Locale
  const { announce } = Stores.Accessibility

  const [tooltipText, setTooltipText] = useState('dataset.copyToClipboard')
  const [copiedStatus, setCopiedStatus] = useState(false)
  const timeoutIndex = useRef()

  const clearCopyTimeout = () => {
    if (timeoutIndex.current) {
      clearTimeout(timeoutIndex.current)
      timeoutIndex.current = null
    }
  }
  const onClick = () => {
    navigator.clipboard.writeText(content)
    setCopiedStatus(true)
    setTooltipText(tooltipSuccess)
    announce(Stores.Locale.translate(tooltipSuccess, { locale: lang }))
    clearCopyTimeout()
    const index = setTimeout(() => {
      setCopiedStatus(false)
      setTooltipText(tooltip)
    }, 4000)
    timeoutIndex.current = index
  }

   
  useEffect(() => clearCopyTimeout, [])

  // return styled link
  return (
    <Translate
      component={TooltipHover}
      attributes={{ title: tooltipText }}
      position={tooltipPosition}
    >
      <IconButton horizontal={horizontal} onClick={onClick} disabled={disabled}>
        <IconContent horizontal={horizontal} hide={copiedStatus}>
          <FontAwesomeIcon icon={faClipboard} />
          <Translate content={label} />
        </IconContent>
        {copiedStatus && <Check icon={faCheck} size={!horizontal ? '2x' : '1x'} />}
      </IconButton>
    </Translate>
  )
}

const IconContent = withCustomProps(styled.div)`
  ${p =>
    !p.horizontal &&
    `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
  `}
  transform: ${p => p.theme.ui.dataset.copyButton.transform};
  ${p => p.hide && 'visibility: hidden;'}
`

const Check = styled(FontAwesomeIcon).attrs({ icon: faCheck })`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
`

const IconButton = styled(Button).attrs(p => ({
  color: p.theme.ui.dataset.copyButton.iconColor || undefined,
}))`
  height: 100%;
  width: 4em;
  padding: 0.5em 0.5em;
  margin: 0;
  border-style: none;
  font-size: 0.7em;
  word-break: initial;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: normal;
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
  content: PropTypes.string,
  label: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  tooltipSuccess: PropTypes.string.isRequired,
  tooltipPosition: PropTypes.oneOf(['top', 'right', 'left']),
  horizontal: PropTypes.bool,
  disabled: PropTypes.bool,
}

CopyToClipboard.defaultProps = {
  content: '',
  tooltipPosition: 'top',
  horizontal: false,
  disabled: false,
}

export default CopyToClipboard
