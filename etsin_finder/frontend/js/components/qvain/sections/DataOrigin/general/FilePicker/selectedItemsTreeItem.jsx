import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { faTimes, faFolder, faFolderOpen, faFile } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

import {
  isDirectory,
  ItemRow,
  ItemSpacer,
  Tag,
  SmallLoader,
  ToggleOpenButton,
  ItemTitle,
  Icon,
  ClickableIcon,
  NoIcon,
} from '../../../../../general/files/items'

import EditDropdown from './selectedItemsDropdown'

import { useStores } from '../../../../utils/stores'

const SelectedItemsTreeItemBase = ({ treeProps, item, level, parentArgs }) => {
  const { Qvain } = useStores()
  const { Files } = Qvain

  const { directoryView } = treeProps
  const { parentAdded, parentRemoved } = parentArgs
  const { userHasRightsToEditProject } = Files
  const { canRemoveFiles } = Qvain

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

  const canRemove =
    ((canRemoveFiles && (!isRemoved || hasAddedChildren)) || item.added) &&
    Files.userHasRightsToEditProject
  const canUndoRemove =
    canRemoveFiles && item.existing && item.removed && userHasRightsToEditProject

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

  const removeAction = canUndoRemove
    ? () => handleClickUndoRemove(item)
    : () => handleClickRemove(item)
  const removeColor = canUndoRemove ? 'gray' : 'error'
  const removeAriaLabel = canUndoRemove ? 'undoRemove' : 'remove'

  return (
    <ItemRow isOpen={isOpen}>
      <EditDropdown item={item} parentArgs={parentArgs} />
      {canRemove || canUndoRemove ? (
        <Translate
          component={ClickableIcon}
          icon={faTimes}
          color={removeColor}
          onClick={removeAction}
          className="remove-item"
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
