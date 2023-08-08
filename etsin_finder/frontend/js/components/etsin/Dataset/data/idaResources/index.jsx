import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'

import Tree from './fileTree'
import Info from '../info'
import sizeParse from '@/utils/sizeParse'
import { useStores } from '@/stores/stores'
import getDownloadAction from './downloadActions'
import dateFormat from '@/utils/dateFormat'
import ErrorMessage from './errorMessage'
import PackageModal from './packageModal'
import ManualDownloadModal from './manualDownloadModal'
import { Header, HeaderTitle, HeaderStats, HeaderButton } from '../common/dataHeader'
import { SplitButtonContainer, MoreButton } from './splitButton'
import FlaggedComponent from '@/components/general/flaggedComponent'
import TooltipHover from '@/components/general/tooltipHover'

function IdaResources() {
  const {
    Locale: { lang },
    Access: { restrictions },
    Etsin: {
      EtsinDataset: { files, packages, isDownloadAllowed, downloadAllInfotext, identifier },
    },
  } = useStores()
  const action = getDownloadAction(identifier, null, packages, files)
  const { moreFunc, moreAriaLabel } = action
  const { inInfo, setInInfo, getUseCategoryLabel, getFileTypeLabel, root } = files
  const fileCount = root?.existingFileCount || 0
  const totalSize = root?.existingByteSize || 0

  if (fileCount === 0) {
    return null
  }

  const translateLabel = label => label?.[lang] || label?.und

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

  // Download full dataset package
  const buttonProps = {
    icon: action.icon,
    spin: action.spin,
    color: action.color,
    attributes: {
      tooltip: action.tooltip,
    },
    disabled: action.disabled || isDownloadAllowed,
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
                  disabled={!isDownloadAllowed}
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

      <ErrorMessage error={packages.error} clear={packages.clearError} />

      <Tree allowDownload={isDownloadAllowed} />
      {inInfo && <Info {...infoProps} />}
      <PackageModal Packages={packages} />
      <ManualDownloadModal Packages={packages} />
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
