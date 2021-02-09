import React from 'react'
import { observer } from 'mobx-react'
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
