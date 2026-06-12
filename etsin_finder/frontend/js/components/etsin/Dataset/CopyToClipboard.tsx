import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard, faCheck } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

import { Button } from '../general/button'
import TooltipHover from '@/components/general/tooltipHover'
import { useStores } from '@/utils/stores'
import withCustomProps from '@/utils/withCustomProps'
import type { TranslationKey } from '@/stores/view/locale'

type CopyToClipboardProps = {
  content?: string
  label?: TranslationKey
  tooltip: TranslationKey
  tooltipSuccess: TranslationKey
  tooltipPosition?: 'top' | 'right' | 'left'
  horizontal?: boolean
  disabled?: boolean
}

const CopyToClipboard = ({
  content = '',
  label,
  tooltip,
  tooltipSuccess,
  tooltipPosition = 'top',
  horizontal = false,
  disabled = false,
}: CopyToClipboardProps) => {
  const Stores = useStores()
  const { lang } = Stores.Locale
  const { announce } = Stores.Accessibility

  const [tooltipText, setTooltipText] = useState<TranslationKey>('dataset.copyToClipboard')
  const [copiedStatus, setCopiedStatus] = useState(false)
  const timeoutIndex = useRef<null | ReturnType<typeof setTimeout>>()

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
        {copiedStatus && <Check icon={faCheck} size={horizontal ? '1x' : '2x'} />}
      </IconButton>
    </Translate>
  )
}

interface IconContentProps {
  horizontal?: boolean
  hide?: boolean
}

const IconContent = withCustomProps(styled.div<IconContentProps>)`
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

interface IconButtonProps {
  horizontal?: boolean
  color?: string
}

const IconButton = styled(Button).attrs<IconButtonProps>(p => ({
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

export default CopyToClipboard
