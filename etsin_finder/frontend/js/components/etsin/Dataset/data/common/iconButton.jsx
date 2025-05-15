import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

import Button, { InvertedButton, Link, InvertedLink } from '@/components/etsin/general/button'

const IconButton = ({
  icon,
  spin,
  link,
  href,
  children,
  invert,
  fontSize,
  ...props
}) => {
  let as = null
  let target
  if (link) {
    as = invert ? InvertedLink : Link
    target = '_blank'
  } else if (invert) {
    as = InvertedButton
  }

  return (
    <StyledIconButton fill="white" target={target} as={as} href={href} {...props}>
      <StyledIconButtonIcon icon={icon} spin={spin} fixedWidth $iconOnly={!children} />
      {children && <IconButtonText fontSize={fontSize}>{children}</IconButtonText>}
    </StyledIconButton>
  )
}

IconButton.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.object.isRequired,
  spin: PropTypes.bool,
  invert: PropTypes.bool,
  link: PropTypes.bool,
  href: PropTypes.string,
  fontSize: PropTypes.string,
  Wrapper: PropTypes.elementType,
  flexGrow: PropTypes.number,
}

IconButton.defaultProps = {
  children: null,
  spin: false,
  invert: false,
  link: false,
  href: undefined,
  fontSize: null,
  Wrapper: React.Fragment,
  flexGrow: 0,
}

const IconButtonText = styled.span`
  margin-left: auto;
  margin-right: auto;
  font-size: ${p => p.fontSize || 'inherit'};
`

const StyledIconButton = styled(Button).attrs(p => ({
  color: p.color || 'primary',
  thin: 'true',
}))`
  display: flex;
  align-items: center;
  padding: 0.125rem 0.5rem 0.125rem 0.25rem;
  margin: 0.25rem 0.5rem;
  width: ${p => p.width || 'auto'};
  :last-child {
    margin-right: 0;
  }
  font-size: 11pt;
`

const StyledIconButtonIcon = styled(FontAwesomeIcon)`
  ${p =>
    p.$iconOnly
      ? `
    margin-left: auto;
    margin-right: auto;
  `
      : 'margin-right: 0.25rem;'}
  width: 0.5rem;
`

export default IconButton
