import { useEffect } from 'react'
import { autorun } from 'mobx'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import FileTreeItem from './fileTreeItem'
import { useRenderTree } from '../../../general/files/tree'

export function FileTree(props) {
  const { Files, packageRequests } = props.Stores.DatasetQuery
  const { downloadApiV2 } = props.Stores.Env
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
      packageRequests,
      downloadApiV2
    }
  )

  return renderTree()
}

FileTree.propTypes = {
  Stores: PropTypes.object.isRequired,
  allowDownload: PropTypes.bool.isRequired
}

export default inject('Stores')(observer(FileTree))
