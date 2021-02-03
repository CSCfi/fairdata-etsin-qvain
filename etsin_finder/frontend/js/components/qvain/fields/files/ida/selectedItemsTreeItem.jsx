import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { faPen, faTimes, faFolder, faFolderOpen, faFile } from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'

import { hasMetadata, hasPASMetadata } from '../../../../../stores/view/common.files.items'
import { Dropdown, DropdownItem } from '../../../../general/dropdown'

import {
  isDirectory,
  isFile,
  ItemRow,
  ItemSpacer,
  Tag,
  SmallLoader,
  ToggleOpenButton,
  ItemTitle,
  Icon,
  ClickableIcon,
  NoIcon,
} from '../../../../general/files/items'

const SelectedItemsTreeItemBase = ({ treeProps, item, level, parentArgs }) => {
  const { Files, directoryView } = treeProps
  const { parentAdded, parentRemoved } = parentArgs
  const { clearMetadata, toggleInEdit } = Files
  const { canRemoveFiles, readonly } = Files.Qvain

  const showPasModal = () => {
    Files.Qvain.setMetadataModalFile(item)
  }

  const showClearPasModal = () => {
    Files.Qvain.setClearMetadataModalFile(item)
  }

  const handleClickRemove = removedItem => {
    if (removedItem.added && !canRemoveFiles) {
      Files.undoAction(removedItem)
    } else {
      Files.removeItem(removedItem)
    }
  }

  const handleClickUndoRemove = removedItem => {
    Files.undoAction(removedItem)
  }

  const hasAddedChildren = item.type === 'directory' && item.addedChildCount > 0
  const isAdded = item.added || hasAddedChildren || (parentAdded && !item.removed)
  const isRemoved =
    (item.removed || (parentRemoved && !item.added)) && !hasAddedChildren && item.existing

  const canRemove = (canRemoveFiles && (!isRemoved || hasAddedChildren)) || item.added
  const canUndoRemove = canRemoveFiles && item.existing && item.removed
  let canEdit = item.added || item.existing || hasAddedChildren || parentAdded
  if (isRemoved) {
    canEdit = false
  }

  const newTag = !item.existing && isAdded && (
    <Translate component={Tag} content="qvain.files.selected.newTag" color="success" />
  )
  const removedTag = isRemoved && (
    <Translate component={Tag} content="qvain.files.selected.removeTag" color="error" />
  )
  const name = item.name

  const isOpen = isDirectory(item) && directoryView.isOpen(item)
  const getDirectoryContent = () => (
    <>
      <ToggleOpenButton item={item} directoryView={directoryView} />
      <Icon icon={isOpen ? faFolderOpen : faFolder} />
      <ItemTitle>
        {name}
        {item.loading && <SmallLoader />}
      </ItemTitle>
      {newTag}
      {removedTag}
    </>
  )

  const getFileContent = () => (
    <>
      <NoIcon />
      <Icon icon={faFile} />
      <ItemTitle>{name}</ItemTitle>
      {newTag}
      {removedTag}
    </>
  )

  const content = isDirectory(item) ? getDirectoryContent() : getFileContent()

  const itemHasMetadata = hasMetadata(item)
  const itemHasPASMetadata = hasPASMetadata(item)
  const editColor = itemHasMetadata ? 'primary' : 'gray'
  let disabledEditColor = itemHasMetadata ? 'error' : 'gray'
  if (readonly) {
    disabledEditColor = 'gray'
  }

  const removeAction = canUndoRemove
    ? () => handleClickUndoRemove(item)
    : () => handleClickRemove(item)
  const removeColor = canUndoRemove ? 'gray' : 'error'
  const removeAriaLabel = canUndoRemove ? 'undoRemove' : 'remove'

  const editDropdown = (
    <Dropdown
      buttonComponent={ClickableIcon}
      buttonProps={{
        icon: faPen,
        disabled: !canEdit,
        color: editColor,
        disabledColor: disabledEditColor,
        disabledOpacity: 0.4,
        attributes: { 'aria-label': 'qvain.files.selected.buttons.edit' },
      }}
      with={{ name }}
    >
      <Translate
        component={DropdownItem}
        content={`qvain.files.selected.${itemHasMetadata ? 'editUserMetadata' : 'addUserMetadata'}`}
        onClick={() => toggleInEdit(item)}
        disabled={readonly && !itemHasMetadata}
      />
      <Translate
        component={DropdownItem}
        content="qvain.files.selected.deleteUserMetadata"
        onClick={() => clearMetadata(item)}
        danger
        disabled={readonly || !itemHasMetadata}
      />
      {isFile(item) && (
        <>
          <Translate
            component={DropdownItem}
            content={`qvain.files.metadataModal.buttons.${itemHasPASMetadata ? 'show' : 'add'}`}
            onClick={showPasModal}
          />
          <Translate
            component={DropdownItem}
            content="qvain.files.metadataModal.buttons.delete"
            onClick={showClearPasModal}
            danger
            disabled={readonly || !itemHasPASMetadata}
          />
        </>
      )}
    </Dropdown>
  )

  return (
    <ItemRow isOpen={isOpen}>
      {editDropdown}
      {canRemove || canUndoRemove ? (
        <Translate
          component={ClickableIcon}
          icon={faTimes}
          color={removeColor}
          onClick={removeAction}
          attributes={{ 'aria-label': `qvain.files.selected.buttons.${removeAriaLabel}` }}
          with={{ name }}
        />
      ) : (
        <NoIcon />
      )}

      <ItemSpacer level={level + 0.5} />
      {content}
    </ItemRow>
  )
}

SelectedItemsTreeItemBase.propTypes = {
  treeProps: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  parentArgs: PropTypes.object.isRequired,
}

export default observer(SelectedItemsTreeItemBase)
