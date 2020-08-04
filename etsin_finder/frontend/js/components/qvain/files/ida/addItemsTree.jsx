import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { inject, Observer } from 'mobx-react'
import { autorun } from 'mobx'
import Translate from 'react-translate-component'

import { useRenderTree } from '../../../general/files/tree'
import AddItemsTreeItem from './addItemsTreeItem'

const EmptyHelp = () => (
  <div>
    <Translate content="qvain.files.addItemsModal.allSelected" />
  </div>
)

function AddItemsTree(props) {
  const { Files } = props.Stores.Qvain
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

  return <Observer>{renderTree}</Observer>
}

AddItemsTree.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(AddItemsTree)
