import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'

import Tree from './fileTree'
import Info from './info'
import sizeParse from '../../../../utils/sizeParse'
import { withStores } from '../../../../stores/stores'
import getDownloadAction from './downloadActions'
import ErrorMessage from './errorMessage'
import PackageModal from './packageModal'
import ManualDownloadModal from './manualDownloadModal'
import { Header, HeaderTitle, HeaderStats, HeaderButton } from '../common/dataHeader'

const downloadAll = identifier => {
  const handle = window.open(`/api/dl?cr_id=${identifier}`)
  if (handle == null) {
    console.error('Unable to open new browser window for download, popup blocker?')
  }
}

function IdaResources(props) {
  const { restrictions } = props.Stores.Access
  let allowDownload =
    props.dataset.data_catalog.catalog_json.identifier !== 'urn:nbn:fi:att:data-catalog-pas' &&
    restrictions.allowDataIdaDownloadButton

  const { Files } = props.Stores.DatasetQuery

  const { inInfo, setInInfo, getUseCategoryLabel, getFileTypeLabel, root } = Files

  const { downloadApiV2 } = props.Stores.Env

  const { DatasetQuery } = props.Stores
  const { Packages } = DatasetQuery

  const fileCount = (root && root.existingFileCount) || 0
  const totalSize = (root && root.existingByteSize) || 0

  if (fileCount === 0) {
    return null
  }

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

  let downloadFunc = () => downloadAll(props.dataset.identifier)
  const buttonProps = {}
  let downloadAllText = 'dataset.dl.downloadAll'

  // Download full dataset package
  if (downloadApiV2) {
    const action = getDownloadAction(props.dataset.identifier, null, Packages, Files)
    downloadFunc = action.func
    buttonProps.icon = action.icon
    buttonProps.spin = action.spin
    buttonProps.color = action.color
    buttonProps.attributes = {
      tooltip: action.tooltip,
    }
    if (DatasetQuery.isDraft) {
      allowDownload = false
      downloadAllText = 'dataset.dl.downloadDisabledForDraft'
    } else if (action.pending) {
      downloadAllText = 'dataset.dl.packages.pending'
    } else if (!action.available) {
      downloadAllText = 'dataset.dl.packages.createForAll'
    }
  }

  return (
    <>
      <Header>
        <Translate component={HeaderTitle} content="dataset.dl.files" />
        <HeaderStats>
          <Translate content="dataset.dl.fileCount" with={{ count: fileCount }} />
          {totalSize ? ` (${sizeParse(totalSize)})` : null}
        </HeaderStats>

        <Translate
          component={HeaderButton}
          disabled={!allowDownload}
          onClick={downloadFunc}
          {...buttonProps}
        >
          <Translate content={downloadAllText} />
          <Translate className="sr-only" content="dataset.dl.file_types.both" />
        </Translate>
      </Header>

      <ErrorMessage error={Packages.error} clear={Packages.clearError} />

      <Tree allowDownload={allowDownload} />
      {inInfo && <Info {...infoProps} />}
      <PackageModal Packages={Packages} />
      <ManualDownloadModal Packages={Packages} />
    </>
  )
}

IdaResources.propTypes = {
  dataset: PropTypes.object.isRequired,
  Stores: PropTypes.object.isRequired,
}

export default withStores(observer(IdaResources))
