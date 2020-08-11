import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import {
  faPen,
  faTimes,
  faFolder,
  faFolderOpen,
  faFile,
} from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'

import FileForm from './forms/fileForm'
import DirectoryForm from './forms/directoryForm'
import { hasMetadata } from '../../../../stores/view/common.files.items'

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
} from '../../../general/files/items'

const SelectedItemsTreeItemBase = ({ treeProps, item, level, parentArgs }) => {
  const { Files, directoryView } = treeProps
  const { parentAdded, parentRemoved } = parentArgs
  const { inEdit, toggleInEdit } = Files
  const { canRemoveFiles, readonly } = Files.Qvain

  const handleClickRemove = (removedItem) => {
    if (removedItem.added && !canRemoveFiles) {
      Files.undoAction(removedItem)
    } else {
      Files.removeItem(removedItem)
    }
  }

  const handleClickUndoRemove = (removedItem) => {
    Files.undoAction(removedItem)
  }

  const hasAddedChildren = item.type === 'directory' && item.addedChildCount > 0
  const isAdded = item.added || hasAddedChildren || (parentAdded && !item.removed)
  const isRemoved =
    (item.removed || (parentRemoved && !item.added)) && !hasAddedChildren && item.existing

  let content = null
  const canRemove = (canRemoveFiles && (!isRemoved || hasAddedChildren)) || item.added
  const canUndoRemove = canRemoveFiles && item.existing && item.removed
  let canEdit =
    item.added ||
    item.existing ||
    hasAddedChildren ||
    parentAdded
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

  if (isDirectory(item)) {
    const isOpen = directoryView.isOpen(item)
    content = (
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
  } else {
    content = (
      <>
        <NoIcon />
        <Icon icon={faFile} />
        <ItemTitle>{name}</ItemTitle>
        {newTag}
        {removedTag}
      </>
    )
  }

  let edit = null
  if (inEdit === item && canEdit) {
    edit = (
      <Edit>
        {isDirectory(inEdit) && (
          <>
            <h3>
              <FontAwesomeIcon icon={faFolder} style={{ marginRight: '1rem' }} />
              <ItemPath item={item} />
            </h3>
            <DirectoryEdit />
          </>
        )}
        {isFile(inEdit) && (
          <>
            <h3>
              <FontAwesomeIcon icon={faFile} style={{ marginRight: '1rem' }} />
              <ItemPath item={item} />
            </h3>
            <FileEdit />
          </>
        )}
      </Edit>
    )
  }

  const editColor = hasMetadata(item) ? 'primary' : 'gray'
  let disabledEditColor = hasMetadata(item) ? 'error' : 'gray'
  if (readonly) {
    disabledEditColor = 'gray'
  }

  const removeAction = canUndoRemove
    ? () => handleClickUndoRemove(item)
    : () => handleClickRemove(item)
  const removeColor = canUndoRemove ? 'gray' : 'error'
  const removeAriaLabel = canUndoRemove ? 'undoRemove' : 'remove'

  return (
    <>
      <ItemRow>
        <Translate
          component={ClickableIcon}
          icon={faPen}
          disabled={!canEdit}
          color={editColor}
          disabledColor={disabledEditColor}
          disabledOpacity={0.4}
          onClick={() => toggleInEdit(item)}
          attributes={{ 'aria-label': 'qvain.files.selected.buttons.edit' }}
          with={{ name }}
        />
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
      <li>{edit}</li>
    </>
  )
}

SelectedItemsTreeItemBase.propTypes = {
  treeProps: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  parentArgs: PropTypes.object.isRequired,
}

const ItemPath = ({ item }) => item.path.substring(1).split('/').join(' / ')

const Edit = styled.div`
  margin-bottom: 0.25rem;
  box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.3);
  border: 1px solid #ccc;
  padding: 1rem;
  padding-bottom: 8px;
`

const FileEdit = styled(FileForm)`
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
`

const DirectoryEdit = styled(DirectoryForm)`
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
`

export default observer(SelectedItemsTreeItemBase)
