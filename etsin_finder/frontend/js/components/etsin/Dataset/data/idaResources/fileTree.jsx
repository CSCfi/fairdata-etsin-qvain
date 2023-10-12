import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

import FileTreeItem from './fileTreeItem'
import { useRenderTree } from '@/components/general/files/tree'
import { useStores } from '@/stores/stores'

export const FileTree = ({ location }) => {
  const {
    Etsin: {
      EtsinDataset: { files: Files, isDownloadAllowed },
      filesProcessor: { Packages },
    },
  } = useStores()

  const { View } = Files

  // Open directories so items specified by query parameters are visible,
  // e.g. ?show=/path/subpath will open /path.
  // Supports multiple paths, e.g. ?show=/path1/item&show=/path2/item.
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const paths = params.getAll('show')
    Files.View.openPaths(paths, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  const { renderTree } = useRenderTree(
    {
      Files,
      Item: FileTreeItem,
      directoryView: View,
      moreItemsLevel: 2,
    },
    {
      isDownloadAllowed,
      Packages,
    }
  )

  return renderTree()
}

FileTree.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
}

export default withRouter(observer(FileTree))
