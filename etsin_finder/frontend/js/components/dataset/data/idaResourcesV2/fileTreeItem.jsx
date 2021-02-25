import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import {
  faDownload,
  faInfoCircle,
  faFolder,
  faFolderOpen,
  faFile,
} from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'

import { hasMetadata } from '../../../../stores/view/common.files.items'
import sizeParse from '../../../../utils/sizeParse'
import {
  isDirectory,
  ItemRow,
  ItemSpacer,
  PlainTag,
  SmallLoader,
  ToggleOpenButton,
  ItemTitle,
  Icon,
  NoIcon,
} from '../../../general/files/items'
import getDownloadAction from './downloadActions'
import IconButton from './iconButton'

const download = (datasetIdentifier, item) => {
  const handle = window.open(
    `/api/dl?cr_id=${datasetIdentifier}${
      item.type === 'directory' ? `&dir_id=${item.identifier}` : `&file_id=${item.identifier}`
    }`
  )
  if (handle == null) {
    console.error('Unable to open new browser window for download, popup blocker?')
  }
}

const FileTreeItemBase = ({ treeProps, item, level }) => {
  const { Files, directoryView, extraProps } = treeProps
  const { allowDownload, Packages, downloadApiV2 } = extraProps
  const { setInInfo, datasetIdentifier } = Files
  let content = null
  const name = item.name

  const fileCount = item.existingFileCount && `${item.existingFileCount} files`
  const size = sizeParse(item.byteSize || item.existingByteSize)
  const tagText = [fileCount, size].filter(v => v).join(', ')
  const sizeTag = tagText ? <PlainTag nowrap>{tagText}</PlainTag> : null

  const isOpen = isDirectory(item) && directoryView.isOpen(item)
  if (isDirectory(item)) {
    content = (
      <>
        <ToggleOpenButton item={item} directoryView={directoryView} />
        <Icon icon={isOpen ? faFolderOpen : faFolder} />
        <OverflowItemTitle title={name}>
          <Name>{name}</Name>
          {item.loading && <SmallLoader />}
        </OverflowItemTitle>
      </>
    )
  } else {
    content = (
      <>
        <NoIcon />
        <Icon icon={faFile} />
        <OverflowItemTitle title={name}>
          <Name>{name}</Name>
        </OverflowItemTitle>
      </>
    )
  }

  const haveMetadata = hasMetadata(item)
  const { type } = item
  let downloadFunc = () => download(datasetIdentifier, item)
  let downloadIcon = faDownload
  let downloadIconSpin = false
  let downloadButtonText = 'dataset.dl.download'
  let downloadButtonColor = null
  let downloadTooltip = null

  if (downloadApiV2) {
    const action = getDownloadAction(datasetIdentifier, item, Packages, Files)
    downloadFunc = action.func
    downloadIcon = action.icon
    downloadIconSpin = action.spin
    downloadButtonText = action.buttonLabel
    downloadButtonColor = action.color
    downloadTooltip = action.tooltip
  }

  const infoButton = (
    <Translate
      component={IconButton}
      fontSize="11pt"
      content="dataset.dl.info"
      color="darkgray"
      icon={faInfoCircle}
      invert
      onClick={() => setInInfo(item)}
      attributes={{
        'aria-label': `dataset.dl.infoModalButton.${type}.${haveMetadata ? 'custom' : 'general'}`,
      }}
      with={{ name }}
    />
  )

  const downloadButton = (
    <Translate
      component={IconButton}
      fontSize="11pt"
      width="7.5em"
      content={downloadButtonText}
      color={downloadButtonColor}
      icon={downloadIcon}
      spin={downloadIconSpin}
      attributes={{
        tooltip: downloadTooltip,
      }}
      disabled={!allowDownload}
      onClick={downloadFunc}
      with={{ name }}
    />
  )

  return (
    <ItemRow isOpen={isOpen}>
      <ItemSpacer level={level} />
      <Group>{content}</Group>
      {sizeTag}
      {infoButton}
      {downloadButton}
    </ItemRow>
  )
}

const Name = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
`

const OverflowItemTitle = styled(ItemTitle)`
  overflow: hidden;
`

const Group = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  min-width: 5em;

  &:last-child {
    margin-left: auto;
  }
`

FileTreeItemBase.propTypes = {
  treeProps: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
}

export default observer(FileTreeItemBase)
