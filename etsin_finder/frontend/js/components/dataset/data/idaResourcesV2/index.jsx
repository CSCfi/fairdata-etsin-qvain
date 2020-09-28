import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFolder, faDownload } from '@fortawesome/free-solid-svg-icons'

import Tree from './fileTree'
import { Button } from '../../../general/button'
import Info from './info'
import sizeParse from '../../../../utils/sizeParse'

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

  const {
    inInfo,
    setInInfo,
    getUseCategoryLabel,
    getFileTypeLabel,
    root,
  } = props.Stores.DatasetQuery.Files

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

  return (
    <>
      <Header>
        <Translate component={HeaderTitle} content="dataset.dl.files" />
        <HeaderStats>
          <Translate content="dataset.dl.fileCount" with={{ count: fileCount }} />
          {totalSize ? ` (${sizeParse(totalSize)})` : null}
        </HeaderStats>

        <HeaderButton
          disabled={!allowDownload}
          onClick={() => downloadAll(props.dataset.identifier)}
        >
          <Translate content={'dataset.dl.downloadAll'} />
          <Translate className="sr-only" content="dataset.dl.file_types.both" />
          <DownloadIcon />
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

export default inject('Stores')(observer(IdaResources))
