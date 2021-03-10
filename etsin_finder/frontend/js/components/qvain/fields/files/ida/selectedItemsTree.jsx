import { observer } from 'mobx-react'

import SelectedItemsTreeItem from './selectedItemsTreeItem'
import { useRenderTree } from '../../../../general/files/tree'
import { useStores } from '../../../utils/stores'

export function SelectedItemsTree() {
  const {
    Files: { SelectedItemsView, root },
  } = useStores().Qvain
  const { Files } = useStores().Qvain

  const { renderTree } = useRenderTree({
    Files,
    Item: SelectedItemsTreeItem,
    directoryView: SelectedItemsView,
    moreItemsLevel: 4.5,
  })

  const hasItems = root && SelectedItemsView.getItems(root).length > 0
  return hasItems && renderTree()
}

export default observer(SelectedItemsTree)
