import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import { darken } from 'polished'
import { faPen, faTimes, faPlus, faFolder, faFolderOpen, faFile } from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'

import etsinTheme from '../../../../styles/theme'
import FileForm from './forms/fileForm'
import DirectoryForm from './forms/directoryForm'

import {
  isDirectory, isFile, ItemRow, ItemSpacer, Tag, SmallLoader, ToggleOpenButton,
  ItemTitle, Icon, ClickableIcon, NoIcon
} from './common/items'


// Implicitly added parent exists in the dataset only because a child item is selected.
export const isImplicitParent = (dir, parentArgs) => (dir.selectedChildCount > 0 || dir.addedChildCount > 0) &&
  !parentArgs.parentAdded && !dir.added && !dir.selected && !parentArgs.parentSelected


const SelectedItemsTreeItemBase = ({ treeProps, item, level, parentArgs }) => {
  const { Files, directoryView } = treeProps
  const { parentAdded, parentSelected } = parentArgs
  const { setRefreshModalDirectory } = Files
  const { inEdit, toggleInEdit } = Files
  const { canRemoveFiles, canSelectFiles } = Files.Qvain

  const handleClickRemove = (removedItem) => Files.removeItem(removedItem)

  let content = null
  const canRemove = (canRemoveFiles && (item.selected && !parentSelected)) || item.added
  let canEdit = item.added || item.selected ||
    ((parentAdded || parentSelected) && (isFile(item) || item.existingFileCount === item.fileCount))
  if (!canSelectFiles && !item.selected) {
    canEdit = false
  }
  const disabled = !(item.added || item.selected || parentAdded || parentSelected)
  let canSync = false

  const newTag = item.added || (!item.existing && parentAdded) ? <Translate component={Tag} content="qvain.files.selected.newTag" /> : null
  const name = item.fileName || item.directoryName

  if (isDirectory(item)) {
    const isOpen = directoryView.isOpen(item) || disabled
    canSync = canSelectFiles && (canEdit || parentAdded || parentSelected) && item.existing && item.fileCount !== item.existingFileCount
    content = (
      <>
        <ToggleOpenButton item={item} directoryView={directoryView} disabled={disabled} />
        <Icon icon={isOpen ? faFolderOpen : faFolder} disabled={disabled} />
        <ItemTitle>
          {name}
          {item.loading && <SmallLoader />}
        </ItemTitle>
        {newTag}
      </>
    )
  } else {
    content = (
      <>
        <NoIcon />
        <Icon icon={faFile} />
        <ItemTitle>{name}</ItemTitle>
        {newTag}
      </>
    )
  }

  let edit = null;
  if (inEdit === item) {
    edit = (
      <Edit>
        {isDirectory(inEdit) && (
          <>
            <h3><FontAwesomeIcon icon={faFolder} style={{ marginRight: '1rem' }} /><ItemPath item={item} /></h3>
            <DirectoryEdit />
          </>
        )}
        {isFile(inEdit) && (
          <>
            <h3><FontAwesomeIcon icon={faFile} style={{ marginRight: '1rem' }} /><ItemPath item={item} /></h3>
            <FileEdit />
          </>
        )}
      </Edit>
    )
  }

  const hasMetadata = item && (item.added || item.selected)
  const editColor = hasMetadata ? 'primary' : 'gray';

  return (
    <>
      <ItemRow disabled={disabled}>
        {canEdit ? (
          <Translate
            component={ClickableIcon}
            icon={faPen}
            color={editColor}
            onClick={() => toggleInEdit(item)}
            attributes={{ 'aria-label': 'qvain.files.selected.buttons.edit' }}
            with={{ name }}
          />
        ) : <NoIcon />
        }
        {canRemove ? (
          <Translate
            component={ClickableIcon}
            icon={faTimes}
            color="error"
            onClick={() => handleClickRemove(item)}
            attributes={{ 'aria-label': 'qvain.files.selected.buttons.remove' }}
            with={{ name }}
          />
        ) : <NoIcon />
        }
        {canSync ? (
          <Translate
            component={PlusButton}
            icon={faTimes}
            color="error"
            onClick={() => setRefreshModalDirectory(item.identifier)}
            attributes={{ 'aria-label': 'qvain.files.selected.buttons.refresh' }}
            with={{ name }}
          />
        ) : <NoIcon />
        }
        <NoIcon />
        <ItemSpacer level={level} />
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

const PlusButtonWrapper = ({ onClick, ...props }) => (
  <button type="button" onClick={onClick} {...props}>
    <FontAwesomeIcon icon={faPlus} />
  </button>
)
PlusButtonWrapper.propTypes = {
  onClick: PropTypes.func.isRequired
}

const PlusButton = styled(PlusButtonWrapper)`{
  border: 1px solid ${darken(0.1, etsinTheme.color.lightgray)};
  color: ${etsinTheme.color.darkgray};
  background: ${etsinTheme.color.lightgray};
  border-radius: 50%;
  width: 1.3rem;
  height: 1.3rem;
  font-size: 8pt;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  :hover {
    transform: scale(1.15);
    border: 1px solid ${darken(0.15, etsinTheme.color.lightgray)};
    color: ${darken(0.1, etsinTheme.color.darkgray)};
    background: ${darken(0.1, etsinTheme.color.lightgray)};
  }
}`


const ItemPath = ({ item }) => item.path.substring(1).split('/').join(' / ')


const Edit = styled.div`
  margin-bottom: 0.25rem;
  box-shadow: 0px 5px 5px -2px rgba(0,0,0,0.3);
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
