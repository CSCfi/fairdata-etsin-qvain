import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import FileTreeItem from './fileTreeItem'
import { useRenderTree } from '../../../general/files/tree'
import { withStores } from '../../../../stores/stores'

export function FileTree(props) {
  const { Files, Packages } = props.Stores.DatasetQuery
  const { downloadApiV2 } = props.Stores.Env
  const { View } = Files
  const { allowDownload } = props

  const { renderTree } = useRenderTree(
    {
      Files,
      Item: FileTreeItem,
      directoryView: View,
      moreItemsLevel: 3.5,
    },
    {
      allowDownload,
      Packages,
      downloadApiV2
    }
  )

  return renderTree()
}

FileTree.propTypes = {
  Stores: PropTypes.object.isRequired,
  allowDownload: PropTypes.bool.isRequired,
}

export default withStores(observer(FileTree))
