import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import PropTypes from 'prop-types'

import Button, { TransparentButton } from '../button'

const DropdownMenu = ({ children, buttonContent, transparent = false }) => {
  const [open, setOpen] = useState(false)
  const content = useRef()
  const button = useRef()

  useEffect(() => {
    if (open) {
      content.current.focus()
    }
  }, [open])

  const onBlur = e => {
    const currentTarget = e.currentTarget
    setTimeout(() => {
      if (
        !currentTarget.contains(document.activeElement) &&
        button.current !== document.activeElement
      ) {
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

  const ButtonComponent = transparent ? CustomTransparentButton : CustomButton

  return (
    <MenuContainer>
      <ButtonContainer>
        <ButtonComponent
          color="primary"
          open={open}
          ref={button}
          aria-pressed={open}
          onClick={() => (open ? handleClose() : handleOpen())}
        >
          {buttonContent}
        </ButtonComponent>
      </ButtonContainer>
      <Content open={open} onClick={handleClose} ref={content} tabIndex="-1" onBlur={onBlur}>
        <Container>{children}</Container>
      </Content>
    </MenuContainer>
  )
}

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 3;
`

const ButtonContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
`

const CustomTransparentButton = styled(TransparentButton)`
  ${p =>
    p.open &&
    `
    &:after {
      content: '';
      position: absolute;
      display: block;
      width: 10px;
      border: 10px solid transparent;
      border-bottom: 10px solid ${p.theme.color.primary};
      margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;
      bottom: 0;
      transition: 0.2s ease;
    }
    &:hover:after {
      border-bottom: 10px solid ${darken(0.1, p.theme.color.primary)};
    }`};
`
const CustomButton = styled(Button)`
  white-space: nowrap;
`

const Content = styled.div`
  height: ${p => (p.open ? 'auto' : 0)};
  position: absolute;
  overflow: hidden;
  width: 100%;
  display: ${p => (p.open ? '' : 'none')};
  top: 4em;
  right: 0;
  border: 2px solid ${p => p.theme.color.primary};
  border-right: none;
  border-left: none;
  background-color: white;
  z-index: 2;
  &:after {
    content: '';
    display: table;
    clear: both;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

DropdownMenu.propTypes = {
  children: PropTypes.node.isRequired,
  buttonContent: PropTypes.node.isRequired,
  transparent: PropTypes.bool,
}

export default DropdownMenu
