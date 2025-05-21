import { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const setEventListeners = (updatePosition, handleClickOutside) => {
  window.addEventListener('scroll', updatePosition)
  window.addEventListener('resize', updatePosition)
  document.addEventListener('mousedown', handleClickOutside)
}

const clearEventListeners = (updatePosition, handleClickOutside) => {
  window.removeEventListener('scroll', updatePosition)
  window.removeEventListener('resize', updatePosition)
  document.removeEventListener('mousedown', handleClickOutside)
}

const Tooltip = ({ isOpen, close, align, text, children, fixed }) => {
  const [currentAlign, setCurrentAlign] = useState(align)

  const wrapperTooltipButtonRef = useRef(null)
  const wrapperTooltipCardRef = useRef(null)

  const [offset, setOffset] = useState(0)

  const updatePosition = useCallback(() => {
    // Move tooltip to opposite side if it doesn't fit to window
    setCurrentAlign(activeCurrentAlign => {
      const wrapper = wrapperTooltipCardRef?.current
      const tooltip = wrapper?.firstChild
      if (!tooltip) {
        return activeCurrentAlign
      }

      if (fixed) {
        const button = wrapperTooltipButtonRef.current
        if (button) {
          setOffset(button.getBoundingClientRect().y)
        }
      }

      // hide tooltip until its position is determined
      const rect = tooltip.getBoundingClientRect()
      wrapper.style.visibility = 'visible'

      if (rect.right > window.innerWidth && align === 'Right') {
        return 'Left'
      }
      if (rect.left < 0 && align === 'Left') {
        return 'Right'
      }
      return activeCurrentAlign
    })
  }, [align, fixed])

  const handleClickOutside = useCallback(
    event => {
      if (wrapperTooltipCardRef.current) {
        // If the tooltip card is clicked, tooltip should not be closed. Otherwise, close.
        if (!wrapperTooltipCardRef.current.contains(event.target)) {
          close()
        }
      }
    },
    [close]
  )

  useEffect(() => {
    setCurrentAlign(align)
    updatePosition()
    setEventListeners(updatePosition, handleClickOutside)

    return () => {
      clearEventListeners(updatePosition, handleClickOutside)
    }
  }, [align, handleClickOutside, updatePosition])

  const tooltip = (
    <AlignedTooltip
      buttonRef={wrapperTooltipButtonRef}
      cardRef={wrapperTooltipCardRef}
      alignment={currentAlign}
      text={text}
      top={offset}
      fixed={fixed}
    >
      {children}
    </AlignedTooltip>
  )

  return isOpen ? tooltip : children
}

Tooltip.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  align: PropTypes.string.isRequired,
  text: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
  fixed: PropTypes.bool, // use to allow overflow from modals
}

Tooltip.defaultProps = {
  fixed: false,
}

export default Tooltip

export const AlignedTooltip = ({
  buttonRef,
  cardRef,
  text,
  children,
  alignment = 'Down',
  fixed,
  top,
}) => {
  const mappedTooltipComponents = {
    Right: (
      <TooltipRight>
        <TooltipArrowRight />
        <TooltipText>{text}</TooltipText>
      </TooltipRight>
    ),
    Left: (
      <TooltipLeft>
        <TooltipText>{text}</TooltipText>
        <TooltipArrowLeft />
      </TooltipLeft>
    ),
    Up: (
      <TooltipUp>
        <TooltipArrowUp />
        <TooltipText>{text}</TooltipText>
      </TooltipUp>
    ),
    Down: (
      <TooltipDown>
        <TooltipText>{text}</TooltipText>
        <TooltipArrowDown />
      </TooltipDown>
    ),
  }

  const alignedTooltipComponent = mappedTooltipComponents[alignment]

  const tooltip = fixed ? (
    <div style={{ position: 'absolute', display: 'inline' }}>
      <div style={{ position: 'fixed', top }}>
        <Wrapper ref={cardRef}>{alignedTooltipComponent}</Wrapper>
      </div>
    </div>
  ) : (
    <Wrapper ref={cardRef}>{alignedTooltipComponent}</Wrapper>
  )

  return (
    <>
      <span ref={buttonRef}>{children}</span>
      {tooltip}
    </>
  )
}

AlignedTooltip.propTypes = {
  buttonRef: PropTypes.object.isRequired,
  cardRef: PropTypes.object.isRequired,
  alignment: PropTypes.string,
  text: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
  fixed: PropTypes.bool,
  top: PropTypes.number,
}

AlignedTooltip.defaultProps = {
  alignment: 'Down',
  fixed: false,
  top: 0,
}

const Wrapper = styled.span`
  position: relative;
  visibility: hidden;
`

const TooltipStyle = styled.div`
  z-index: 10;
  text-align: left;
  text-align: start;
  text-shadow: none;
  text-transform: none;
  white-space: normal;
  word-break: normal;
  word-spacing: normal;
  word-wrap: normal;
  position: absolute;
`

export const TooltipLeft = styled(TooltipStyle)`
  display: flex;
  margin-left: 5px;
  right: 30px;
  top: -8px;
`

export const TooltipRight = styled(TooltipStyle)`
  display: flex;
  margin-left: -5px;
  left: 0px;
  top: -8px;
`

export const TooltipDown = styled(TooltipStyle)`
  display: inline-block;
  margin-top: -5px;
  left: -37px;
  top: 30px;
`

export const TooltipUp = styled(TooltipStyle)`
  display: inline-block;
  margin-top: 5px;
  left: -37px;
  top: -111px;
`
const TooltipArrow = styled.div`
  width: 0;
  height: 0;
`

export const TooltipArrowLeft = styled(TooltipArrow)`
  -webkit-filter: drop-shadow(1px 0px 1px rgba(0, 0, 0, 0.3));
  filter: drop-shadow(1px 0px 1px rgba(0, 0, 0, 0.3));
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #fff;
  margin-top: 10px;
`

export const TooltipArrowRight = styled(TooltipArrow)`
  -webkit-filter: drop-shadow(-1px 0px 1px rgba(0, 0, 0, 0.3));
  filter: drop-shadow(-1px 0px 1px rgba(0, 0, 0, 0.3));
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #fff;
  margin-top: 10px;
`

export const TooltipArrowDown = styled(TooltipArrow)`
  -webkit-filter: drop-shadow(0px -1px 1px rgba(0, 0, 0, 0.3));
  filter: drop-shadow(0px -1px 1px rgba(0, 0, 0, 0.3));
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
  margin-left: 10px;
`

export const TooltipArrowUp = styled(TooltipArrow)`
  -webkit-filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.3));
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.2));
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #fff;
  margin-left: 10px;
`

const TooltipText = styled.div`
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: max-content;
  padding: 10px 15px;
  color: ${p => p.theme.color.dark};
  font-size: initial;
  line-height: initial;
  font-weight: initial;
  text-align: inherit;
  background-color: ${p => p.theme.color.white};
  @media (max-width: ${p => p.theme.breakpoints.md}) {
    max-width: 250px;
  }
  & > p:last-child {
    margin-bottom: 0;
  }
`
