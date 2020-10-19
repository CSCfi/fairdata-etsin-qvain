import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFolder, faDownload } from '@fortawesome/free-solid-svg-icons'

import Tree from './fileTree'
import { Button } from '../../../general/button'
import Info from './info'
import sizeParse from '../../../../utils/sizeParse'
import { withStores } from '../../../../stores/stores'
import getDownloadAction from './download'

const downloadAll = identifier => {
  const handle = window.open(`/api/dl?cr_id=${identifier}`)
  if (handle == null) {
    console.error('Unable to open new browser window for download, popup blocker?')
  }
}

function IdaResources(props) {
  const { restrictions } = props.Stores.Access
  const allowDownload =
    props.dataset.data_catalog.catalog_json.identifier !== 'urn:nbn:fi:att:data-catalog-pas' &&
    restrictions.allowDataIdaDownloadButton

  const { Files } = props.Stores.DatasetQuery

  const { inInfo, setInInfo, getUseCategoryLabel, getFileTypeLabel, root } = Files

  const { downloadApiV2 } = props.Stores.Env

  const { Packages } = props.Stores.DatasetQuery

  const fileCount = (root && root.existingFileCount) || 0
  const totalSize = (root && root.existingByteSize) || 0

  const lang = props.Stores.Locale.lang

  const translateLabel = label => label && (label[lang] || label.und)

  const infoProps = inInfo && {
    open: true,
    name: inInfo.name,
    id: inInfo.identifier,
    checksum: inInfo.checksum,
    title: inInfo.title,
    size: sizeParse(inInfo.existingByteSize || inInfo.byteSize),
    category: translateLabel(getUseCategoryLabel(inInfo)),
    type: translateLabel(getFileTypeLabel(inInfo)),
    description: inInfo.description,
    headerContent: `dataset.dl.infoHeaders.${inInfo.type}`,
    headerIcon: inInfo.type === 'directory' ? faFolder : faFile,
    closeModal: () => setInInfo(null),
  }

  let fullAvailable = allowDownload
  let downloadFunc = () => downloadAll(props.dataset.identifier)
  const iconProps = {}

  // Download full dataset package
  if (downloadApiV2) {
    const action = getDownloadAction(props.dataset.identifier, null, Packages, Files)
    fullAvailable = fullAvailable && action.available
    downloadFunc = action.func
    iconProps.icon = action.icon
    iconProps.spin = action.spin
  }

  return (
    <>
      <Header>
        <Translate component={HeaderTitle} content="dataset.dl.files" />
        <HeaderStats>
          <Translate content="dataset.dl.fileCount" with={{ count: fileCount }} />
          {totalSize ? ` (${sizeParse(totalSize)})` : null}
        </HeaderStats>

        <HeaderButton disabled={!fullAvailable} onClick={downloadFunc}>
          <Translate content={'dataset.dl.downloadAll'} />
          <Translate className="sr-only" content="dataset.dl.file_types.both" />
          <DownloadIcon {...iconProps} />
        </HeaderButton>
      </Header>

      <Tree allowDownload={allowDownload} />
      {inInfo && <Info {...infoProps} />}
    </>
  )
}

IdaResources.propTypes = {
  dataset: PropTypes.object.isRequired,
  Stores: PropTypes.object.isRequired,
}

const Header = styled.div`
  display: grid;
  align-items: center;
  margin-bottom: 0.5rem;
  grid-template-columns: 1fr auto;
`

const HeaderTitle = styled.h2`
  grid-row: 1;
  grid-column: 1;
  line-height: 1.5;
  margin-bottom: 0;
`

const HeaderStats = styled.span`
  grid-row: 2;
  grid-column: 1;
`

const HeaderButton = styled(Button)`
  grid-row: 1/3;
  grid-column: 2;
  margin: 0;
`

const DownloadIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faDownload,
}))`
  margin-left: 0.5em;
`

export default withStores(observer(IdaResources))
