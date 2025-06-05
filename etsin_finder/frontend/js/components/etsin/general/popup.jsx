import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import withCustomProps from '@/utils/withCustomProps'

const PopUp = ({ children, popUp, isOpen, onRequestClose, align = 'left', role }) => {
  const [isFocused, setIsFocused] = useState(false)
  const popRef = useRef()
  const timeoutId = useRef()

  useEffect(() => {
    // This fixes issues with opening and closing
    // when there are multiple popups
    if (isOpen) {
      setTimeout(() => {
        if (popRef.current) {
          popRef.current.focus()
        }
      }, 50)
    }
  }, [isOpen])

  const onBlur = () => {
    timeoutId.current = setTimeout(() => {
      if (isFocused) {
        setIsFocused(false)
        onRequestClose()
      }
    }, 0)
  }

  const onFocus = () => {
    clearTimeout(timeoutId.current)
    setIsFocused(true)
  }

  return (
    <Relative
      // prevent popup from closing and reopening again when its button is clicked
      onMouseDown={e => e.preventDefault()}
    >
      {isOpen && (
        <PopContainer>
          <Pop
            ref={popRef}
            tabIndex="-1"
            autoFocus
            onBlur={onBlur}
            onFocus={onFocus}
            align={align}
            role={role}
          >
            {popUp}
          </Pop>
          <DownTriangle />
        </PopContainer>
      )}
      {children}
    </Relative>
  )
}

const DownTriangle = () => (
  <Svg width="40px" height="20px" viewBox="0 0 20 20">
    <defs>
      <filter id="dropshadow" height="200%" width="200%">
        <feOffset dx="0" dy="3" result="offsetblur" />
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.6" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <polygon fill="white" points="0,0 10,10 20,0" style={{ filter: 'url(#dropshadow)' }} />
  </Svg>
)

const Relative = styled.span`
  position: initial;
  display: inline-block;
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    position: relative;
  }
`

const PopContainer = styled.div`
  position: initial;
  height: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    position: relative;
    height: initial;
  }
`

const alignment = align => {
  let value
  switch (align) {
    case 'left':
      value = css`
        left: 0;
        margin-left: -10px;
        width: max-content;
      `
      break
    case 'left-fit-content':
      value = css`
        left: 0;
        margin-left: -10px;
        width: fit-content;
      `
      break
    case 'right':
      value = css`
        right: 0;
        width: max-content;
      `
      break
    case 'sidebar':
      value = css`
        right: auto;
        left: auto;
        width: max-content;
        @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
          margin-right: -150px;
        }
        @media screen and (min-width: ${p => p.theme.breakpoints.md}) and (max-width: ${p =>
            p.theme.breakpoints.lg}) {
          margin-right: -150px;
        }
        @media screen and (min-width: ${p => p.theme.breakpoints.xs}) and (max-width: ${p =>
            p.theme.breakpoints.md}) {
          margin-right: -150px;
        }
      `
      break
    case 'center':
      value = css`
        left: auto;
      `
      break
    // goes here only if an unvalid value is given
    default:
      value = ''
  }
  return value
}

const Pop = withCustomProps(styled.div)`
  z-index: 1;
  position: absolute;
  top: initial;
  left: 15px;
  background-color: white;
  width: calc(100vw - 30px);
  padding: 1em 1.7em;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  transform: translateY(calc(-100% - 10px));
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    top: 1px;
    left: initial;
    ${p => alignment(p.align)};
    position: absolute;
    width: initial;
    max-width: 40vw;
  }
`

const Svg = styled.svg`
  pointer-events: none;
  z-index: 2;
  top: initial;
  position: absolute;
  margin-top: -10px;
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    top: -10px;
    position: absolute;
    margin-top: 0;
  }
`

// mobile aligment
// - don't go outside 15px content margin
// - stay over arrow always
// - maxwidth 100vw-2xMargin
//
// desktop alignment
// - stay over arrow
// - option to align right, left or center

PopUp.propTypes = {
  children: PropTypes.node.isRequired,
  popUp: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  align: PropTypes.oneOf(['left', 'left-fit-content', 'right', 'center', 'sidebar']),
  role: PropTypes.string,
}

export default PopUp
