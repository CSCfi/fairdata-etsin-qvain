import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import { darken } from 'polished'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import Translate from 'react-translate-component'
import { Spinner } from '../../../../general/loader'
import etsinTheme from '../../../../../styles/theme';

export const isDirectory = (item) => item.directoryName !== undefined
export const isFile = (item) => item.fileName !== undefined


const LoaderWrapper = (props) => (
  <div {...props}>
    <Spinner active size="12px" spinnerSize="0.15em" />
  </div>
)

export const SmallLoader = styled(LoaderWrapper)`{
  width: 1.3rem;
  height: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5em;
  opacity: 0.8;
}`

const IconWrapper = ({ icon, ...props }) => (
  <div {...props}>
    <FontAwesomeIcon icon={icon} />
  </div>
)

IconWrapper.propTypes = {
  icon: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
}

const ClickableIconButton = ({ icon, ...props }) => (
  <button type="button" {...props}>
    <FontAwesomeIcon icon={icon} />
  </button>
)

ClickableIconButton.propTypes = {
  icon: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}

ClickableIconButton.defaultProps = {
  onClick: () => { },
  disabled: false,
}

export const Icon = styled(IconWrapper)`{
  width: 1.3rem;
  height: 1.3rem;
  font-size: 1.1rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-shrink: 0;

  ${props => (props.disabled ? `color: ${etsinTheme.color.gray} ` : '')}
}`

export const ClickableIcon = styled(ClickableIconButton)`{
  background: none;
  border: none;
  font-size: 1.1rem;
  color: ${props => etsinTheme.color[props.color || 'primary']};
  width: 1.3rem;
  height: 1.3rem;
  flex-shrink: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  &:[disabled] {
    color: #aaa;
  }
  &:not([disabled]) {
    cursor: pointer;
  }
  &:not([disabled]):hover {
    color: ${props => darken(0.1, etsinTheme.color[props.color || 'primary'])};
    transform: scale(1.15);
  }

  ${props => (props.disabled ? 'color: #888' : '')}
}`

export const ToggleOpenButton = ({ item, directoryView, ...props }) => {
  const isOpen = directoryView.isOpen(item)
  const action = isOpen ? 'close' : 'open'
  return (
    <Translate
      component={ClickableIcon}
      icon={isOpen ? faChevronDown : faChevronRight}
      onClick={() => directoryView.toggleOpen(item)}
      attributes={{ 'aria-label': `qvain.files.selected.buttons.${action}` }}
      with={{ name: item.directoryName }}
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
  className: PropTypes.string.isRequired
}


export const ItemCheckbox = styled.input.attrs({
  type: 'checkbox'
})`{
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  margin: 0;
}`
ItemCheckbox.displayName = 'ItemCheckbox'

// Placeholder that has the same size as an icon
export const Checkbox = styled(CheckboxWrapper)`{
  flex-shrink: 0;
  width: 1.3rem;
  height: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}`
Checkbox.displayName = 'Checkbox'

// Placeholder that has the same size as an icon
export const NoIcon = styled.div`{
  flex-shrink: 0;
  width: 1.3rem;
  height: 1.3rem;
}`
NoIcon.displayName = 'NoIcon'

export const ItemTitle = styled.div`{
  margin-left: 4px;
  display:flex;
  align-items: center;
  flex-grow: 1;
}`
ItemTitle.displayName = 'ItemTitle'

export const FileCount = styled.span`{
  margin-left: 0.5em;
  margin-right: 0.5em;
  font-size: 90%;
  color: #606060;
  white-space: nowrap;
}`
FileCount.displayName = 'FileCount'

export const ItemRow = styled.li`{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;

  ${props => (props.disabled ? 'color: #888' : '')}
}`
ItemRow.displayName = 'ItemRow'

export const ItemSpacer = styled.div`{
  width: ${props => props.level * 1.3}em;
  margin: 0;
  padding: 0;
  background: #cad;
}`
ItemSpacer.displayName = 'ItemSpacer'

export const GrowSpacer = styled.div`{
  flex-grow: 1;
}`
GrowSpacer.displayName = 'GrowSpacer'

export const Items = styled.div`{
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-grow: 1;
  width: 100%;
  overflow: auto;
}`
Items.displayName = 'Items'

export const ChildrenItem = styled.li`{
  width: 100%;
}`
ChildrenItem.displayName = 'ChildrenItem'

export const Children = styled.ul`{
  width: 100%;
}`
Children.displayName = 'Children'

export const Tag = styled.div`{
  font-size: 75%;
  font-weight: bold;
  background: #cdf;
  min-width: 20px;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 4px;
  text-align: center;
  margin-left: 2px;
  padding: 1px 4px;
  text-transform: uppercase;
}`
Tag.displayName = 'Tag'
