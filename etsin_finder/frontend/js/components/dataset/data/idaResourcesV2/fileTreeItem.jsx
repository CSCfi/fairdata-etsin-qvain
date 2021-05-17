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
  faEllipsisV,
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
import IconButton from '../common/iconButton'
import FlaggedComponent from '../../../general/flaggedComponent'

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
  let moreFunc = null
  let moreAriaLabel = null
  let downloadIcon = faDownload
  let downloadIconSpin = false
  let downloadButtonText = 'dataset.dl.download'
  let downloadButtonColor = null

  if (downloadApiV2) {
    const action = getDownloadAction(datasetIdentifier, item, Packages, Files)
    downloadFunc = action.func
    moreFunc = action.moreFunc
    moreAriaLabel = action.moreAriaLabel
    downloadIcon = action.icon
    downloadIconSpin = action.spin
    downloadButtonText = action.buttonLabel
    downloadButtonColor = action.color
  }

  const infoButton = (
    <Translate
      component={InfoButton}
      fontSize="11pt"
      content="dataset.dl.info"
      color="darkgray"
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
      component={DownloadButton}
      fontSize="11pt"
      width="7.5em"
      content={downloadButtonText}
      color={downloadButtonColor}
      icon={downloadIcon}
      spin={downloadIconSpin}
      disabled={!allowDownload}
      onClick={downloadFunc}
      with={{ name }}
    />
  )

  const downloadButtonParts = (
    <FlaggedComponent flag="DOWNLOAD_API_V2.OPTIONS" whenDisabled={downloadButton}>
      <SplitContainer split={moreFunc}>
        {downloadButton}
        {moreFunc && (
          <Translate
            component={MoreButton}
            color={downloadButtonColor}
            disabled={!allowDownload}
            onClick={moreFunc}
            attributes={{ 'aria-label': moreAriaLabel }}
          />
        )}
      </SplitContainer>
    </FlaggedComponent>
  )

  return (
    <ItemRow isOpen={isOpen}>
      <ItemSpacer level={level} />
      <Group>{content}</Group>
      {sizeTag}
      {infoButton}
      {downloadButtonParts}
    </ItemRow>
  )
}

const SplitContainer = styled.span`
  width: 9em;
  display: flex;
  align-items: stretch;
  & > button:first-child {
    flex-grow: 1;
  }

  ${p =>
    p.split &&
    `
  & > button:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    margin-right: 1px;
  }
  & > button:last-child {
    margin-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  `}
`

export const DownloadButton = styled(IconButton)`
  width: 7.5em;
`

export const InfoButton = styled(IconButton).attrs({
  icon: faInfoCircle,
})``

export const MoreButton = styled(IconButton).attrs({
  icon: faEllipsisV,
})`
  width: 1.5em;
  padding: 0.125rem 0.125rem;
`

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
