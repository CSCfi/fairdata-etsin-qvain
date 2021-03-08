import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import { tint } from 'polished'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'

import { Spinner } from '../loader'

export const isDirectory = item => item.type === 'directory'
export const isFile = item => item.type === 'file'

const LoaderWrapper = props => (
  <div {...props}>
    <Spinner active size="12px" spinnerSize="0.15em" />
  </div>
)

export const SmallLoader = styled(LoaderWrapper)`
  width: 1.3rem;
  height: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5em;
  opacity: 0.8;
`

const IconWrapper = ({ icon, color, disabledColor, disabledOpacity, ...props }) => (
  <div {...props}>
    <FontAwesomeIcon icon={icon} />
  </div>
)

IconWrapper.propTypes = {
  icon: PropTypes.object.isRequired,
  color: PropTypes.string,
  disabledColor: PropTypes.string,
  disabledOpacity: PropTypes.number,
  className: PropTypes.string.isRequired,
}

IconWrapper.defaultProps = {
  color: '',
  disabledColor: 'gray',
  disabledOpacity: 1,
}

const ClickableIconButton = ({ icon, disabledColor, disabledOpacity, spin, pulse, ...props }) => (
  <button type="button" {...props}>
    <FontAwesomeIcon icon={icon} spin={spin} pulse={pulse} />
  </button>
)

ClickableIconButton.propTypes = {
  icon: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  disabledColor: PropTypes.string,
  disabledOpacity: PropTypes.number,
  spin: PropTypes.bool,
  pulse: PropTypes.bool,
}

ClickableIconButton.defaultProps = {
  onClick: () => {},
  disabled: false,
  disabledColor: '',
  disabledOpacity: 1,
  spin: false,
  pulse: false,
}

export const Icon = styled(IconWrapper)`
  width: 1.3rem;
  height: 1.3rem;
  font-size: 1.1rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-shrink: 0;

  ${props => (props.disabled ? `color: ${props.theme.color[props.disabledColor]};` : '')}

  ${props => props.disabled && props.disabledOpacity && `opacity: ${props.disabledOpacity}`}
`

export const ClickableIcon = styled(ClickableIconButton)`
  background: none;
  border: none;
  font-size: 1.1rem;
  color: ${props => props.theme.color[props.color || 'primary']};
  width: 1.3rem;
  height: 1.3rem;
  flex-shrink: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  ${props =>
    props.disabled &&
    `
  color: ${props.theme.color[props.disabledColor]};
  opacity: ${props.disabledOpacity};
  `}

  ${props => !props.disabled && 'cursor: pointer;'}
}
`

export const ToggleOpenButton = ({ item, directoryView, ...props }) => {
  const isOpen = directoryView.isOpen(item)
  const action = isOpen ? 'close' : 'open'
  return (
    <Translate
      component={ClickableIcon}
      icon={isOpen ? faChevronDown : faChevronRight}
      onClick={() => directoryView.toggleOpen(item)}
      attributes={{ 'aria-label': `qvain.files.selected.buttons.${action}` }}
      with={{ name: item.name }}
      {...props}
    />
  )
}

ToggleOpenButton.propTypes = {
  item: PropTypes.object.isRequired,
  directoryView: PropTypes.object.isRequired,
}

const CheckboxWrapper = ({ className, ...props }) => (
  <div className={className}>
    <ItemCheckbox {...props} />
  </div>
)

CheckboxWrapper.propTypes = {
  className: PropTypes.string.isRequired,
}

export const ItemCheckbox = styled.input.attrs({
  type: 'checkbox',
})`
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  margin: 0;
`

// Placeholder that has the same size as an icon
export const Checkbox = styled(CheckboxWrapper)`
  flex-shrink: 0;
  width: 1.3rem;
  height: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Placeholder that has the same size as an icon
export const NoIcon = styled.div`
  flex-shrink: 0;
  width: 1.3rem;
  height: 1.3rem;
`

export const ItemTitle = styled.div`
  margin-left: 4px;
  display: flex;
  align-items: center;
  flex-grow: 1;
`

export const FileCount = styled.span`
  margin-left: 0.5em;
  margin-right: 0.5em;
  font-size: 90%;
  color: #606060;
  white-space: nowrap;
`

export const ItemRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  background: ${props => (props.isOpen ? props.theme.color.itemBackgroundLight : 'none')};
  border-radius: 4px;
  margin-top: 1px;
  margin-bottom: 1px;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  ${props => (props.disabled ? 'color: #888' : '')}
`

export const ItemSpacer = styled.div`
  width: ${props => props.level * 1.3}em;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
`

export const GrowSpacer = styled.div`
  flex-grow: 1;
`

export const Items = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  flex-grow: 1;
  width: 100%;
  overflow: visible;
`

export const Tag = styled.div`
  font-size: 75%;
  font-weight: bold;
  background: ${p => (p.color && tint(0.8, p.theme.color[p.color])) || '#cdf'};
  min-width: 20px;
  border: 1px solid ${p => (p.color && tint(0.5, p.color && p.theme.color[p.color])) || '#bce'};
  border-radius: 4px;
  text-align: center;
  margin-left: 2px;
  padding: 1px 4px;
  text-transform: uppercase;
  white-space: nowrap;
`

export const PlainTag = styled.div`
  font-size: 90%;
  border-radius: 4px;
  text-align: left;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  padding: 1px 4px;
  width: ${p => p.width || 'auto'};
  ${p => p.nowrap && 'white-space: nowrap'};
`
