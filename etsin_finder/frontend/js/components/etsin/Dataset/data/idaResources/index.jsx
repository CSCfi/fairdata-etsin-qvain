import React, { useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'
import FlaggedComponent from '@/components/general/flaggedComponent'
import TooltipHover from '@/components/general/tooltipHover'
import sizeParse from '@/utils/sizeParse'
import { useStores } from '@/stores/stores'

import { Header, HeaderTitle, HeaderStats, HeaderButton } from '../common/dataHeader'
import Info from '../info'

import ErrorMessage from './errorMessage'
import getDownloadAction from './downloadActions'
import ManualDownloadModal from './manualDownloadModal'
import PackageModal from './packageModal'
import { SplitButtonContainer, MoreButton } from './splitButton'
import Tree from './fileTree'

function IdaResources() {
  const {
    Env: { metaxV3Url },
    Locale: { lang, dateFormat },
    Access: { restrictions },
    Etsin: {
      EtsinDataset: { useV3, identifier, files, downloadAllInfotext },
      filesProcessor: { Packages },
      fetchPackages,
      isDownloadPossible,
    },
  } = useStores()

  const action = getDownloadAction(useV3, metaxV3Url, identifier, null, Packages, files)
  const { moreFunc, moreAriaLabel } = action
  const { inInfo, setInInfo, getUseCategoryLabel, getFileTypeLabel, root } = files
  const fileCount = root?.existingFileCount || 0
  const totalSize = root?.existingByteSize || 0

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  if (fileCount === 0) {
    return null
  }

  const translateLabel = label => label?.[lang] || label?.und

  let shapedChecksum
  if (inInfo?.checksum) {
    shapedChecksum = useV3
      ? inInfo.checksum
      : `${inInfo.checksum.algorithm}:${inInfo.checksum.value}`
  }

  const infoProps = inInfo && {
    open: true,
    name: inInfo.name,
    id: useV3 && inInfo.type === 'directory' ? null : inInfo.identifier,
    checksum: shapedChecksum,
    title: inInfo.title,
    size: sizeParse(inInfo.existingByteSize || inInfo.byteSize),
    category: translateLabel(getUseCategoryLabel(inInfo)),
    type: translateLabel(getFileTypeLabel(inInfo)),
    description: inInfo.description,
    headerContent: `dataset.dl.infoHeaders.${inInfo.type}`,
    headerIcon: inInfo.type === 'directory' ? faFolder : faFile,
    closeModal: () => setInInfo(null),
  }

  // Download full dataset package
  const buttonProps = {
    icon: action.icon,
    spin: action.spin,
    color: action.color,
    attributes: {
      tooltip: action.tooltip,
    },
    disabled: action.disabled || !isDownloadPossible,
    onClick: action.func,
  }

  const downloadButton = (
    <Translate component={HeaderButton} {...buttonProps}>
      <Translate content={downloadAllInfotext} />
      <Translate className="sr-only" content="dataset.dl.file_types.both" />
    </Translate>
  )

  return (
    <>
      <Header>
        <Translate component={HeaderTitle} content="dataset.dl.files" />
        <HeaderStats>
          <Translate content="dataset.dl.fileCount" with={{ count: fileCount }} />
          {totalSize ? ` (${sizeParse(totalSize)})` : null}
        </HeaderStats>

        <Translate component={TooltipHover} attributes={{ title: action.tooltip }} showOnClick>
          <FlaggedComponent flag="DOWNLOAD_API_V2.OPTIONS" whenDisabled={downloadButton}>
            <HeaderButtonSplit split={moreFunc}>
              {downloadButton}
              {moreFunc && (
                <Translate
                  component={MoreButton}
                  color={buttonProps.color}
                  disabled={!isDownloadPossible}
                  onClick={moreFunc}
                  attributes={{ 'aria-label': moreAriaLabel }}
                />
              )}
            </HeaderButtonSplit>
          </FlaggedComponent>
          {restrictions.embargoDate && (
            <EmbargoDate>
              <Translate content="dataset.embargo_date" />
              &nbsp; {dateFormat(restrictions.embargoDate, { shortMonth: true })}
            </EmbargoDate>
          )}
        </Translate>
      </Header>

      <ErrorMessage error={Packages.error} clear={Packages.clearError} />

      <Tree allowDownload={isDownloadPossible} />
      {inInfo && <Info {...infoProps} />}
      <PackageModal Packages={Packages} />
      <ManualDownloadModal Packages={Packages} />
    </>
  )
}

const HeaderButtonSplit = styled(SplitButtonContainer)`
  width: 10.5em;
  & > button:last-child {
    margin: 0;
  }
`

const EmbargoDate = styled.span`
  font-size: 12px;
`

export default observer(IdaResources)
