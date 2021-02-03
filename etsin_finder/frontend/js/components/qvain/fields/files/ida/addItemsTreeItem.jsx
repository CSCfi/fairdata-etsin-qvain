import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { faFolder, faFolderOpen, faFile } from '@fortawesome/free-solid-svg-icons'

import {
  isDirectory,
  ItemRow,
  ItemSpacer,
  ToggleOpenButton,
  ItemTitle,
  Checkbox,
  Icon,
  NoIcon,
  SmallLoader,
} from '../../../../general/files/items'

export const AddItemsTreeItemBase = ({ treeProps, item, level, parentArgs }) => {
  const { directoryView } = treeProps
  const { parentChecked } = parentArgs
  const isOpen = directoryView.isOpen(item)
  const isChecked = directoryView.isChecked(item)
  const disabled = parentChecked
  const checkMark = isChecked || parentChecked

  const toggle = disabled ? null : () => directoryView.toggleChecked(item)
  const toggleDirectoryOpen = dir => directoryView.toggleOpen(dir)

  const getDirectoryContent = () => {
    const checkAction = directoryView.isChecked ? 'select' : 'deselect'
    return (
      <>
        <ToggleOpenButton item={item} directoryView={directoryView} />
        <Translate
          component={Checkbox}
          checked={checkMark}
          disabled={disabled}
          onChange={toggle}
          attributes={{ 'aria-label': `qvain.files.selected.buttons.${checkAction}` }}
          with={{ name: item.name }}
        />
        <Icon icon={isOpen ? faFolderOpen : faFolder} />
        <ItemTitle onDoubleClick={() => toggleDirectoryOpen(item)}>
          {item.name}
          {item.loading && <SmallLoader />}
        </ItemTitle>
      </>
    )
  }

  const getFileContent = () => (
    <>
      <NoIcon />
      <Checkbox aria-label="select" checked={checkMark} disabled={disabled} onChange={toggle} />
      <Icon icon={faFile} />
      <ItemTitle>{item.name}</ItemTitle>
    </>
  )

  const content = isDirectory(item) ? getDirectoryContent() : getFileContent()

  return (
    <ItemRow isOpen={isOpen}>
      <ItemSpacer level={level} />
      {content}
    </ItemRow>
  )
}

AddItemsTreeItemBase.propTypes = {
  treeProps: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  parentArgs: PropTypes.object.isRequired,
}

export default observer(AddItemsTreeItemBase)
