import React, { useEffect } from 'react'
import { autorun } from 'mobx'
import PropTypes from 'prop-types'
import { inject, Observer } from 'mobx-react'

import SelectedItemsTreeItem from './selectedItemsTreeItem'
import { useRenderTree } from './common/tree'

export function SelectedItemsTree(props) {
  const { Files } = props.Stores.Qvain
  const { SelectedItemsView } = Files

  // Open top level directory
  useEffect(
    () =>
      autorun(() => {
        if (Files.root) {
          Files.root.directories.forEach((dir) => SelectedItemsView.open(dir))
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const { renderTree } = useRenderTree({
    Files,
    Item: SelectedItemsTreeItem,
    directoryView: SelectedItemsView,
    moreItemsLevel: 5,
  })

  return <Observer>{renderTree}</Observer>
}

SelectedItemsTree.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(SelectedItemsTree)
