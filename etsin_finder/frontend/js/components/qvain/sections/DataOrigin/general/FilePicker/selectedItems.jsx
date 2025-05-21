import { observer } from 'mobx-react'

import SelectedItemsTree from './selectedItemsTree'

export function SelectedItems() {
  return <SelectedItemsTree />
}

export default observer(SelectedItems)
