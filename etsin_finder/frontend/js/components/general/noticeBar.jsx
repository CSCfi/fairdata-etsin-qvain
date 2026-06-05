import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { darken } from 'polished'
import Translate from '@/utils/Translate'
import checkColor from '../../styles/styledUtils'
import { TransparentButton } from './button'
import withCustomProps from '@/utils/withCustomProps'

const NoticeBar = ({
  children,
  bg = 'primary',
  color = 'white',
  position = 'relative',
  z = '0',
  duration = 0,
  className = '',
  onClose = null,
  border = false,
  borderColor = '',
}) => {
  const [open, setOpen] = useState(true)
  const timeout = useRef()

  const handleClose = useCallback(() => {
    setOpen(false)
    onClose?.()
  }, [onClose])

  useEffect(() => {
    if (duration && open) {
      timeout.current = setTimeout(handleClose, duration)
    }
    return () => clearTimeout(timeout.current)
  }, [duration, open, handleClose])

  if (!open) {
    return null
  }
  return (
    <Bar
      z={z}
      position={position}
      bg={bg}
      color={color}
      open={open}
      className={className}
      border={border}
      borderColor={borderColor}
    >
      <NoticeText>{children}</NoticeText>
      {!duration && (
        <CloseButton onClick={handleClose} role="button" aria-pressed={!open}>
          <Translate content="general.notice.SRhide" className="sr-only" />
          <FontAwesomeIcon icon={faTimes} aria-hidden />
        </CloseButton>
      )}
    </Bar>
  )
}

NoticeBar.propTypes = {
  children: PropTypes.node.isRequired,
  bg: PropTypes.string,
  color: PropTypes.string,
  position: PropTypes.string,
  z: PropTypes.string,
  duration: PropTypes.number,
  className: PropTypes.string,
  onClose: PropTypes.func,
  border: PropTypes.bool,
  borderColor: PropTypes.string,
}

const Bar = withCustomProps(styled.div)`
  width: 100%;
  z-index: ${p => p.z};
  background-color: ${props => checkColor(props.bg)};
  ${p =>
    p.border &&
    `border: 2px solid ${p.borderColor ? checkColor(p.borderColor) : 'black'};`} display: flex;
  color: ${props => checkColor(props.color)};
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: ${p => p.position};
  top: 0;
  left: 0;
  a {
    color: #00284f;
    &:hover {
      color: ${darken(0.1, '#00284f')};
    }
  }
  display: flex;
  margin-bottom: 0.5rem;
`

const NoticeText = styled.h3`
  padding: 0.25em 0 0.25em 0.5em;
  margin-bottom: 0;
  text-align: center;
  flex-grow: 1;
`

const CloseButton = styled(TransparentButton)`
  color: white;
  &:hover {
    text-decoration: none;
  }
`

export default NoticeBar
