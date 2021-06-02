import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import {
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
import IconButton from '../common/iconButton'
import FlaggedComponent from '../../../general/flaggedComponent'
import { MoreButton, SplitButtonContainer } from './splitButton'

const FileTreeItemBase = ({ treeProps, item, level }) => {
  const { Files, directoryView, extraProps } = treeProps
  const { allowDownload, Packages } = extraProps
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

  const action = getDownloadAction(datasetIdentifier, item, Packages, Files)
  const {
    func: downloadFunc,
    moreFunc,
    moreAriaLabel,
    icon: downloadIcon,
    spin: downloadIconSpin,
    buttonLabel: downloadButtonText,
    color: downloadButtonColor,
  } = action

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
      <SplitButtonContainer split={moreFunc}>
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
      </SplitButtonContainer>
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

export const DownloadButton = styled(IconButton)`
  width: 7.5em;
`

export const InfoButton = styled(IconButton).attrs({
  icon: faInfoCircle,
})``

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
