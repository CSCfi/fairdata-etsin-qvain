import React, { useEffect } from 'react'
import { autorun } from 'mobx'
import { Observer } from 'mobx-react'

import SelectedItemsTreeItem from './selectedItemsTreeItem'
import { useRenderTree } from '../../../general/files/tree'
import { useStores } from '../../utils/stores'

export function SelectedItemsTree() {
  const {
    Files: { SelectedItemsView, root },
  } = useStores().Qvain
  const { Files } = useStores().Qvain

  // Open top level directory
  useEffect(
    () =>
      autorun(() => {
        if (root) {
          root.directories.forEach(dir => SelectedItemsView.open(dir))
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const { renderTree } = useRenderTree({
    Files,
    Item: SelectedItemsTreeItem,
    directoryView: SelectedItemsView,
    moreItemsLevel: 4.5,
  })

  return <Observer>{renderTree}</Observer>
}

export default SelectedItemsTree
