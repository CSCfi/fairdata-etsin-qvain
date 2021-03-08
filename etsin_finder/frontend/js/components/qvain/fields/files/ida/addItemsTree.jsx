import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { useRenderTree } from '../../../../general/files/tree'
import AddItemsTreeItem from './addItemsTreeItem'
import { useStores } from '../../../utils/stores'
import Loader from '../../../../general/loader'

const EmptyHelp = () => (
  <Translate component="div" content="qvain.files.addItemsModal.allSelected" />
)

const NoProjectHelp = () => (
  <Translate component="div" content="qvain.files.addItemsModal.noProject" />
)

const CustomLoader = props => (
  <LoaderWrapper>
    <Loader {...props} />
  </LoaderWrapper>
)

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  height: 100%;
`

const AddItemsTree = () => {
  const {
    Qvain: { Files },
  } = useStores()
  const { AddItemsView } = Files

  const { renderTree } = useRenderTree({
    Files,
    Item: AddItemsTreeItem,
    EmptyHelp,
    NoProjectHelp,
    directoryView: AddItemsView,
    moreItemsLevel: 1,
    Loader: CustomLoader,
  })
  return renderTree()
}

export default observer(AddItemsTree)
