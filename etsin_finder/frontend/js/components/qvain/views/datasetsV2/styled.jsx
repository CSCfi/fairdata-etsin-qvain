import withCustomProps from '@/utils/withCustomProps'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useState } from 'react'
import styled, { css } from 'styled-components'

// Styled components common for datasets and applications

export const IconButton = ({ icon, children = undefined, onlyIcon = false, ...props }) => {
  const [color, setColor] = useState('darkgray')
  return (
    <StyledIconButton
      {...props}
      onlyIcon={onlyIcon || !children}
      onMouseLeave={() => setColor('darkgray')}
      onMouseEnter={() => setColor('primary')}
      color={color}
    >
      <StyledFontAwesomeIcon icon={icon} color={color} />
      {!onlyIcon && children}
    </StyledIconButton>
  )
}

IconButton.propTypes = {
  icon: PropTypes.object.isRequired,
  onlyIcon: PropTypes.bool,
  children: PropTypes.node,
}

const onlyIconStyling = css`
  border: solid ${props => props.theme.color.gray} 1px;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 12pt;
  width: 100%;
  gap: 0.25rem;
`

const StyledIconButton = withCustomProps(styled.button).attrs({ type: 'button' })`
  color: ${p => p.theme.color[p.color]};
  border: none;
  background: transparent;
  width: 4rem;
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
  cursor: pointer;
  font-size: 20px;
  ${props => !props.onlyIcon && onlyIconStyling}
  &:hover {
    color: ${props => props.theme.color.primary};
    border-color: ${props => props.theme.color.primary};
    background-color: ${props => props.theme.color.primaryLight};
  }
`

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: ${props => props.theme.color[props.color]};
  margin-right: 0.25rem;
`

export const PlaceholderWrapper = styled.div`
  min-height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`