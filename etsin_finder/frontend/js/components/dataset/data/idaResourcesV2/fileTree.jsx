import React, { useEffect } from 'react'
import { autorun } from 'mobx'
import PropTypes from 'prop-types'
import { inject, Observer } from 'mobx-react'

import FileTreeItem from './fileTreeItem'
import { useRenderTree } from '../../../general/files/tree'

export function FileTree(props) {
  const { Files } = props.Stores.DatasetQuery
  const { View } = Files
  const { allowDownload } = props

  // Open top level directory
  useEffect(
    () =>
      autorun(() => {
        if (Files.root) {
          Files.root.directories.forEach(dir => View.open(dir))
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const { renderTree } = useRenderTree(
    {
      Files,
      Item: FileTreeItem,
      directoryView: View,
      moreItemsLevel: 3.5,
    },
    {
      allowDownload,
    }
  )

  return <Observer>{renderTree}</Observer>
}

FileTree.propTypes = {
  Stores: PropTypes.object.isRequired,
  allowDownload: PropTypes.bool.isRequired
}

export default inject('Stores')(FileTree)
