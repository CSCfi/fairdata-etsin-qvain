import React, { useEffect } from 'react'
import { autorun } from 'mobx'
import PropTypes from 'prop-types'
import { inject, Observer } from 'mobx-react'

import SelectedItemsTreeItem, { isImplicitParent } from './selectedItemsTreeItem'
import { useRenderTree } from './common/tree'

const filterChildren = (items, parent, parentArgs) => {
  if (parentArgs.parentAdded) {
    return items
  }
  return items.filter(item =>
    (item.added || item.addedChildCount > 0) ||
    (item.selected || item.selectedChildCount > 0) ||
    (item.existing && parentArgs.parentSelected))
}

export function SelectedItemsTree(props) {
  const { Files } = props.Stores.Qvain
  const { SelectedItemsView } = Files

  // Open all implicitly added parent directories
  useEffect(() =>
    autorun(() => {
      const recurse = (dir) => {
        if (isImplicitParent(dir, {}) && !SelectedItemsView.isOpen(dir)) {
          SelectedItemsView.open(dir)
        }
        if (!dir.added && !dir.selected) {
          (dir.directories || []).forEach(d => recurse(d, dir.added))
        }
      }
      const root = props.Stores.Qvain.Files.root;
      ((root && root.directories) || []).forEach(d => recurse(d, false))
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const { renderTree } = useRenderTree({
    Files,
    Item: SelectedItemsTreeItem,
    directoryView: SelectedItemsView,
    filterChildren,
    moreItemsLevel: 5,
  })

  return (
    <Observer>{renderTree}</Observer>
  )
}

SelectedItemsTree.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(SelectedItemsTree)
