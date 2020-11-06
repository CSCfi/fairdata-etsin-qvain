import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { autorun } from 'mobx'
import Translate from 'react-translate-component'

import { useRenderTree } from '../../../../general/files/tree'
import AddItemsTreeItem from './addItemsTreeItem'
import { useStores } from '../../../utils/stores'

const EmptyHelp = () => (
  <div>
    <Translate content="qvain.files.addItemsModal.allSelected" />
  </div>
)

const AddItemsTree = () => {
  const {
    Qvain: { Files },
  } = useStores()
  const { AddItemsView } = Files

  // Open top level directory
  useEffect(
    () =>
      autorun(() => {
        if (Files.root) {
          Files.root.directories.forEach((dir) => AddItemsView.open(dir))
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const { renderTree } = useRenderTree({
    Files,
    Item: AddItemsTreeItem,
    EmptyHelp,
    directoryView: AddItemsView,
    moreItemsLevel: 1,
  })
  return renderTree()
}

export default observer(AddItemsTree)
