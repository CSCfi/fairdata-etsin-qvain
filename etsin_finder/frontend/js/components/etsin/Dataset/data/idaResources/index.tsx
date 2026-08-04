import Translate from '@/utils/Translate'
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import styled from 'styled-components'

import AskForAccess from '@/components/etsin/Dataset/AskForAccess'
import FlaggedComponent from '@/components/general/flaggedComponent'
import TooltipHover from '@/components/general/tooltipHover'
import { useStores } from '@/stores/stores'
import sizeParse from '@/utils/sizeParse'
import { Header, HeaderButton, HeaderStats, HeaderTitle } from '../common/dataHeader'
import Info from '../info'
import getDownloadAction from './downloadActions'
import getDownloadActionV2, { type DownloadAction } from './downloadActionsV2'
import ErrorMessage from './errorMessage'
import Tree from './fileTree'
import ManualDownloadModal from './manualDownloadModal'
import ManualDownloadModalV2 from './ManualDownloadModalV2'
import PackageModal from './packageModal'
import { MoreButton, SplitButtonContainer } from './SplitButton'

function IdaResources() {
  const {
    Locale: { lang, dateFormat },
    Etsin: {
      EtsinDataset: {
        identifier,
        files,
        downloadAllInfotext,
        isFileMetadataAllowed,
        dataset: { fileset },
        embargoDate,
        isEmbargoExpired,
      },
      filesProcessor: { Packages },
      fetchPackages,
      isDownloadPossible,
      downloadSharesEnabled,
    },
    Env,
  } = useStores()

  let action: DownloadAction
  if (downloadSharesEnabled) {
    action = getDownloadActionV2(identifier, null, Packages, files, Env)
  } else {
    action = getDownloadAction(identifier, null, Packages, files)
  }
  const { moreFunc, moreAriaLabel } = action
  const { inInfo, setInInfo, getUseCategoryLabel, getFileTypeLabel } = files
  const fileCount = fileset?.total_files_count || 0
  const totalSize = fileset?.total_files_size || 0

  useEffect(() => {
    if (downloadSharesEnabled) {
      Packages.checkStatusV2()
    } else {
      fetchPackages()
    }
  }, [fetchPackages])

  if (fileCount === 0) {
    return null
  }

  const translateLabel = (label: any) => label?.[lang] || label?.und

  let shapedChecksum
  if (inInfo?.checksum) {
    shapedChecksum = inInfo.checksum
  }

  const infoProps = inInfo && {
    open: true,
    name: inInfo.name,
    id: inInfo.type === 'directory' ? null : inInfo.identifier,
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

  // Returns the text related to the embargo expiration. The text content
  // depends on whether the expiration has already occured:
  const getEmbargoText = () => {
    if (isEmbargoExpired) {
      return 'dataset.embargoDateExpired'
    }

    return 'dataset.embargo_date'
  }

  return (
    <>
      <Header>
        <Translate component={HeaderTitle} content="dataset.dl.files" />
        <HeaderStats>
          <Translate content="dataset.dl.fileCount" with={{ count: fileCount }} />
          {totalSize ? ` (${sizeParse(totalSize)})` : null}
        </HeaderStats>

        <HeaderButtons>
          <AskForAccess />
          <Translate component={TooltipHover} attributes={{ title: action.tooltip }} showOnClick>
            <FlaggedComponent flag="DOWNLOAD_API_V2.OPTIONS" whenDisabled={downloadButton}>
              <HeaderButtonSplit split={!!moreFunc}>
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
            {/* If embargo date has been defined, its future or past expiration
                is displayed: */}
            {embargoDate && (
              <EmbargoDate>
                <Translate content={getEmbargoText()} />
                &nbsp; {dateFormat(embargoDate, { shortMonth: true })}
              </EmbargoDate>
            )}
          </Translate>
        </HeaderButtons>
      </Header>

      <ErrorMessage />

      {isFileMetadataAllowed && <Tree />}
      {inInfo && <Info {...infoProps} />}
      <PackageModal Packages={Packages} />
      {downloadSharesEnabled ? (
        <ManualDownloadModalV2 Packages={Packages} />
      ) : (
        <ManualDownloadModal Packages={Packages} />
      )}
    </>
  )
}

const HeaderButtonSplit = styled(SplitButtonContainer)`
  width: 10.5em;
  & > button:last-child {
    margin: 0;
  }
`

const HeaderButtons = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  // Use both grid rows, align on top
  grid-row-start: 1;
  grid-row-end: 3;
  align-self: flex-start;
`

const EmbargoDate = styled.span`
  font-size: 12px;
`

export default observer(IdaResources)
