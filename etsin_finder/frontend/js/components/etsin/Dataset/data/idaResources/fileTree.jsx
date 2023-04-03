import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

import FileTreeItem from './fileTreeItem'
import { useRenderTree } from '../../../../general/files/tree'
import { withStores } from '@/stores/stores'

export function FileTree(props) {
  const { Files, Packages } = props.Stores.DatasetQuery
  const { View } = Files
  const { allowDownload } = props

  // Open directories so items specified by query parameters are visible,
  // e.g. ?show=/path/subpath will open /path.
  // Supports multiple paths, e.g. ?show=/path1/item&show=/path2/item.
  useEffect(() => {
    const params = new URLSearchParams(props.location.search)
    const paths = params.getAll('show')
    Files.View.openPaths(paths, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location.search])

  const { renderTree } = useRenderTree(
    {
      Files,
      Item: FileTreeItem,
      directoryView: View,
      moreItemsLevel: 2,
    },
    {
      allowDownload,
      Packages,
    }
  )

  return renderTree()
}

FileTree.propTypes = {
  Stores: PropTypes.object.isRequired,
  allowDownload: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
}

export default withRouter(withStores(observer(FileTree)))
