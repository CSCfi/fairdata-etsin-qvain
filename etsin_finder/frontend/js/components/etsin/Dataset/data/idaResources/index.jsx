import { useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

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
    Locale: { lang, dateFormat },
    Etsin: {
      EtsinDataset: {
        identifier,
        files,
        downloadAllInfotext,
        isFileMetadataAllowed,
        dataset: { fileset },
        embargoDate,
        isEmbargoExpired
      },
      filesProcessor: { Packages },
      fetchPackages,
      isDownloadPossible,
    },
  } = useStores()

  const action = getDownloadAction(identifier, null, Packages, files)
  const { moreFunc, moreAriaLabel } = action
  const { inInfo, setInInfo, getUseCategoryLabel, getFileTypeLabel } = files
  const fileCount = fileset?.total_files_count || 0
  const totalSize = fileset?.total_files_size || 0

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  if (fileCount === 0) {
    return null
  }

  const translateLabel = label => label?.[lang] || label?.und

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

  /*Return the text related to the embargo expiration. The text content 
  depends on whether the expiration has already occured: */
  const getEmbargoText = () => {
    if (isEmbargoExpired) {
      return "dataset.embargoDateExpired"
    }

    return "dataset.embargo_date"
  }

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
          {/* If embargo date has been defined, its future or past expiration 
          is displayed: */}
          {embargoDate && (
            <EmbargoDate>
              <Translate content={getEmbargoText()} />
              &nbsp; {dateFormat(embargoDate, { shortMonth: true })}
            </EmbargoDate>)}
        </Translate>
      </Header>

      <ErrorMessage />

      {isFileMetadataAllowed && <Tree allowDownload={isDownloadPossible} />}
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
