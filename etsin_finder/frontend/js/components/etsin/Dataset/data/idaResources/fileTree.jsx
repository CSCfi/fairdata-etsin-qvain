import { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useLocation } from 'react-router'

import FileTreeItem from './fileTreeItem'
import { useRenderTree } from '@/components/general/files/tree'
import { useStores } from '@/stores/stores'

export const FileTree = () => {
  const {
    Etsin: {
      EtsinDataset: { files: Files, isDownloadPossible },
      filesProcessor: { Packages },
    },
  } = useStores()

  const { View } = Files

  const location = useLocation()
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
      isDownloadPossible,
      Packages,
    }
  )

  return renderTree()
}

export default observer(FileTree)
