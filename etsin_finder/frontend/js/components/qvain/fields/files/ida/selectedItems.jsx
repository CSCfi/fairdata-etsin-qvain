import React from 'react'
import { observer } from 'mobx-react'

import RefreshDirectoryModal from '../refreshDirectoryModal'
import SelectedItemsTree from './selectedItemsTree'
import { useStores } from '../../../utils/stores'

export function SelectedItems() {
  const {
    Qvain: {
      Files: { refreshModalDirectory, setRefreshModalDirectory },
    },
  } = useStores()

  return (
    <>
      <SelectedItemsTree />
      <RefreshDirectoryModal
        directory={refreshModalDirectory}
        onClose={() => setRefreshModalDirectory(null)}
      />
    </>
  )
}

export default observer(SelectedItems)
