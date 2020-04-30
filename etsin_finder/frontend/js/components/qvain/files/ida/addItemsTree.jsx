import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { inject, Observer } from 'mobx-react'
import { autorun } from 'mobx'
import Translate from 'react-translate-component'

import {
  isDirectory, isFile
} from './common/items'

import { useRenderTree } from './common/tree'
import AddItemsTreeItem from './addItemsTreeItem'


const filterChildren = (children, parent, { parentSelected, parentAdded }) => (
  children.filter(item => {
    if (item.added || parentAdded) {
      return false
    }
    if (isDirectory(item)) {
      const hasNewFiles = !item.existing || item.removed || item.fileCount > item.existingFileCount
      return hasNewFiles
    }
    if (isFile(item) && item.existing && !item.removed && (item.selected || parentSelected || item.added || parentAdded)) {
      return false
    }
    return true
  })
)

const EmptyHelp = () => (
  <div>
    <Translate content="qvain.files.addItemsModal.allSelected" />
  </div>
)

function AddItemsTree(props) {
  const { Files } = props.Stores.Qvain
  const { AddItemsView } = Files

  // Open top level directory
  useEffect(() =>
    autorun(() => {
      if (Files.root) {
        Files.root.directories.forEach(dir => AddItemsView.open(dir))
      }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const { renderTree } = useRenderTree({
    Files,
    Item: AddItemsTreeItem,
    EmptyHelp,
    directoryView: AddItemsView,
    filterChildren,
    moreItemsLevel: 1,
  })

  return (
    <Observer>{renderTree}</Observer>
  )
}

AddItemsTree.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(AddItemsTree)
