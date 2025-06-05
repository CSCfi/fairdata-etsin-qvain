import { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { tint } from 'polished'
import Translate from '@/utils/Translate'

import Button from './button'
import withCustomProps from '@/utils/withCustomProps'

export const Dropdown = ({
  children,
  icon = faCaretDown,
  buttonContent = null,
  with: _with = undefined,
  buttonComponent = CustomButton,
  buttonProps = {},
  align = 'center',
}) => {
  const [open, setOpen] = useState()
  const content = useRef()
  const container = useRef()
  const listenersAdded = useRef(false)

  const updatePosition = useCallback(() => {
    if (!content.current || !container.current) {
      return
    }
    const list = content.current
    const containerRect = container.current.getBoundingClientRect()

    let listHeight = list.offsetHeight
    const listWidth = list.offsetWidth
    if (listHeight === 0) {
      // If the list has display: none, it doesn't have a height.
      // Temporarily make list displayed but hidden so the height can be computed.
      const oldVisibility = list.style.visibility
      const oldDisplay = list.style.display
      list.style.visibility = 'hidden'
      list.style.display = 'block'
      listHeight = list.offsetHeight
      list.style.display = oldDisplay
      list.style.visibility = oldVisibility
    }

    // move dropdown above button if it doesn't fit below
    const pageHeight = document.documentElement.clientHeight
    if (containerRect.bottom + listHeight < pageHeight) {
      list.style.top = `${containerRect.bottom}px`
    } else {
      list.style.top = `${containerRect.top - listHeight}px`
    }

    // position dropdown horizontally, keep inside window
    const margin = 5 // margin from edge of window
    const pageWidth = document.documentElement.clientWidth
    let left
    if (align === 'right') {
      left = containerRect.left
    } else if (align === 'left') {
      left = containerRect.right - listWidth
    } else {
      // center
      left = (containerRect.left + containerRect.right) / 2 - listWidth / 2
    }
    left = Math.max(margin, Math.min(pageWidth - listWidth - margin, left))
    list.style.left = `${left}px`
  }, [align])

  const addListeners = useCallback(() => {
    if (listenersAdded.current) {
      return
    }
    window.addEventListener('scroll', updatePosition)
    window.addEventListener('resize', updatePosition)
    listenersAdded.current = true
  }, [updatePosition])

  const removeListeners = useCallback(() => {
    if (!listenersAdded.current) {
      return
    }
    window.removeEventListener('scroll', updatePosition)
    window.removeEventListener('resize', updatePosition)
    listenersAdded.current = false
  }, [updatePosition])

  useEffect(() => {
    if (open) {
      addListeners()
      content.current.focus()
      updatePosition()
    } else {
      removeListeners()
    }
  }, [addListeners, open, removeListeners, updatePosition])

  const onBlur = e => {
    const currentTarget = e.currentTarget
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        handleClose()
      }
    }, 0)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onClick = e => {
    e.stopPropagation()
    if (open) {
      handleClose()
    } else {
      handleOpen()
    }
  }

  {
    const ButtonComponent = buttonComponent
    return (
      <DropdownContainer ref={container} onBlur={onBlur} aria-haspopup="true">
        <ButtonWrapper>
          <Translate
            role="button"
            component={ButtonComponent}
            open={open}
            aria-pressed={open}
            with={_with}
            onClick={onClick}
            attributes={{
              'aria-label': typeof buttonContent === 'string' ? buttonContent : undefined,
            }}
            {...buttonProps}
          >
            {buttonContent &&
              (typeof buttonContent === 'string' ? (
                <Translate content={buttonContent} with={_with} />
              ) : (
                buttonContent
              ))}
            {icon && <Icon icon={icon} />}
          </Translate>
        </ButtonWrapper>
        <Content role="menu" ref={content} open={open} onClick={handleClose} tabIndex="-1">
          {children}
        </Content>
      </DropdownContainer>
    )
  }
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const DropdownContainer = styled.div`
  position: relative;
`

const CustomButton = styled(Button)`
  position: relative;
  display: flex;
  align-items: center;
`

const Icon = styled(FontAwesomeIcon)`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`

const Content = styled.ul`
  position: fixed;
  overflow: hidden;
  display: ${p => (p.open ? '' : 'none')};
  right: 0;
  top: 100%;
  margin-top: 0em;
  border-radius: 0.3em;
  background-color: white;
  z-index: 2;
  &:after {
    content: '';
    display: table;
    clear: both;
  }
  min-width: 6em;
  width: max-content;
  box-shadow: 0px 1px 3px 0px ${p => p.theme.color.insetdark};
`

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  buttonContent: PropTypes.node,
  with: PropTypes.object,
  buttonComponent: PropTypes.elementType,
  buttonProps: PropTypes.object,
  icon: PropTypes.object,
  align: PropTypes.oneOf(['left', 'center', 'right']),
}

Dropdown.defaultProps = {
  icon: faCaretDown,
  buttonContent: null,
  with: undefined,
  buttonComponent: CustomButton,
  buttonProps: {},
  align: 'center',
}

export const DropdownItem = ({ onlyNarrow, children, ...props }) => (
  <DropdownItemLi onlyNarrow={onlyNarrow}>
    <DropdownItemButton {...props}>{children}</DropdownItemButton>
  </DropdownItemLi>
)

DropdownItem.propTypes = {
  onlyNarrow: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

DropdownItem.defaultProps = {
  onlyNarrow: false,
}

const DropdownItemLi = withCustomProps(styled.li)`
  ${p =>
    p.onlyNarrow &&
    `
    display: block;
    @media screen and (min-width: ${p.theme.breakpoints.lg}) {
      display: none;
    }
    `}
`

export const DropdownItemButton = withCustomProps(styled.button).attrs({ type: 'button' })`
  width: 100%;
  border: none;
  ${p => (p.border === 'top' || p.border === 'both') && `border-top: 1px solid rgba(0, 0, 0, 0.4);`}
  ${p =>
    (p.border === 'bottom' || p.border === 'both') && `border-top: 1px solid rgba(0, 0, 0, 0.4);`}
  background: none;
  color: ${p => (p.disabled ? p.theme.color.gray : p.theme.color.dark)};
  &:not(:disabled) {
    &:hover,
    &:focus {
      background: ${p => p.theme.color.lightgray};
    }
  }
  padding: 0.5rem 1rem;
  text-align: left;

  ${p =>
    p.danger &&
    `
    color: ${p.disabled ? tint(0.65, '#cc0000') : '#cc0000'};
    &:not(:disabled) {
      &:hover, &:focus {
        background: #ffb2b2;
      }
    }
  `};
`

export default Dropdown
