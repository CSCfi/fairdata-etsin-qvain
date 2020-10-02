import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import RefreshDirectoryModal from '../refreshDirectoryModal'
import SelectedItemsTree from './selectedItemsTree'

export function SelectedItems(props) {
  const Files = props.Stores.Qvain.Files
  const { refreshModalDirectory, setRefreshModalDirectory } = Files

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

SelectedItems.propTypes = {
  Stores: PropTypes.object.isRequired,
}


export default inject('Stores')(observer(SelectedItems))
