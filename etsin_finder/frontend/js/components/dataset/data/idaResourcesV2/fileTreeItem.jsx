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
  ClickableIcon,
  NoIcon,
} from '../../../common/files/items'

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
  const { allowInfo, allowDownload } = extraProps
  const { setInInfo, datasetIdentifier } = Files
  let content = null
  const name = item.name

  const fileCount = item.existingFileCount && `${item.existingFileCount} files`
  const size = sizeParse(item.byteSize || item.existingByteSize)
  const tagText = [fileCount, size].filter(v => v).join(', ')
  const sizeTag = tagText ? <PlainTag>{tagText}</PlainTag> : null

  if (isDirectory(item)) {
    const isOpen = directoryView.isOpen(item)
    content = (
      <>
        <ToggleOpenButton item={item} directoryView={directoryView} />
        <Icon icon={isOpen ? faFolderOpen : faFolder} />
        <ItemTitleBreaking>
          {name}
          {item.loading && <SmallLoader />}
        </ItemTitleBreaking>
      </>
    )
  } else {
    content = (
      <>
        <NoIcon />
        <Icon icon={faFile} />
        <ItemTitleBreaking>{name}</ItemTitleBreaking>
      </>
    )
  }

  const haveMetadata = hasMetadata(item)
  const editColor = haveMetadata ? 'primary' : 'gray'
  const disabledEditColor = haveMetadata ? 'error' : 'gray'
  const { type } = item

  return (
    <ItemRow style={{ flexWrap: 'wrap' }}>
      <Group>
        <Translate
          component={ClickableIcon}
          icon={faInfoCircle}
          color={editColor}
          disabled={!allowInfo}
          disabledColor={disabledEditColor}
          disabledOpacity={0.4}
          onClick={() => setInInfo(item)}
          attributes={{
            'aria-label': `dataset.dl.infoModalButton.${type}.${haveMetadata ? 'custom' : 'general'}`,
          }}
          with={{ name }}
        />
        <Translate
          component={ClickableIcon}
          icon={faDownload}
          color="primary"
          disabled={!allowDownload}
          disabledColor={disabledEditColor}
          disabledOpacity={0.4}
          onClick={() => download(datasetIdentifier, item)}
          attributes={{ 'aria-label': 'dataset.dl.downloadItem' }}
          with={{ name }}
        />
        <ItemSpacer level={level + 0.5} />
        {content}
      </Group>
      <Group>{sizeTag}</Group>
    </ItemRow>
  )
}

const ItemTitleBreaking = styled(ItemTitle)`
  word-break: normal;
  overflow-wrap: anywhere;
  min-width: 4em;
`

const Group = styled.div`
  display: flex;

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
