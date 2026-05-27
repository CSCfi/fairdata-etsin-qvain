import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  faFile,
  faExternalLinkAlt,
  faDownload,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import sizeParse from '@/utils/sizeParse'

import { useStores } from '@/stores/stores'
import IconButton from '../common/iconButton'

const normalizeUrl = value => (typeof value === 'string' ? value : value?.identifier)

const isFileUrl = value => typeof value === 'string' && value.startsWith('file://')

const fileUrlToPath = value => {
  if (!isFileUrl(value)) return null

  try {
    // `new URL('file:///tmp/a')` => pathname '/tmp/a'
    const parsed = new URL(value)
    if (parsed?.pathname) return decodeURIComponent(parsed.pathname)
  } catch {
    // Best-effort fallback below
  }

  // Fallback: strip `file://` prefix.
  return decodeURIComponent(value.replace(/^file:\/\//, ''))
}

const MAX_FILE_PATH_PREVIEW_LENGTH = '/home/torvinen/README-or-super-long-file'.length
const FILE_PATH_SUFFIX_LENGTH = 8
const FILE_PATH_PREFIX_TRIM_EXTRA = 6

const truncateFilePathPreview = value => {
  if (typeof value !== 'string') return value
  if (value.length <= MAX_FILE_PATH_PREVIEW_LENGTH) return value

  const prefixLength =
    MAX_FILE_PATH_PREVIEW_LENGTH - FILE_PATH_SUFFIX_LENGTH - 3 - FILE_PATH_PREFIX_TRIM_EXTRA
  if (prefixLength <= 0) {
    return `${value.slice(0, MAX_FILE_PATH_PREVIEW_LENGTH - 3)}...`
  }

  return `${value.slice(0, prefixLength)}...${value.slice(-FILE_PATH_SUFFIX_LENGTH)}`
}

const ResourceItem = ({ resource, hideSize, hideDataService }) => {
  const {
    Etsin: {
      EtsinDataset: { setInInfo, resolveDataServiceName },
    },
    Locale: { getValueTranslation },
  } = useStores()
  const size = sizeParse(resource.byte_size)
  const dataService = resolveDataServiceName(resource.data_service)
  const accessUrl = normalizeUrl(resource.access_url)
  const downloadUrl = normalizeUrl(resource.download_url)
  const localFilePath = fileUrlToPath(downloadUrl) || fileUrlToPath(accessUrl)
  const localFilePathPreview = truncateFilePathPreview(localFilePath)
  const resourceName =
    getValueTranslation(resource.title) ||
    localFilePathPreview ||
    accessUrl ||
    downloadUrl ||
    resource.identifier ||
    '-'
  const canDownload = Boolean(downloadUrl) && !isFileUrl(downloadUrl)
  const canSource = Boolean(accessUrl) && !isFileUrl(accessUrl)

  return (
    <Item>
      <Name title={resourceName}>
        <ResourceIcon resource={resource} />
        {resourceName}
      </Name>

      {!hideSize && <SizeColumn>{size || '-'}</SizeColumn>}

      {!hideDataService && <DataServiceColumn>{dataService || '-'}</DataServiceColumn>}

      <ActionsColumn>
        {canDownload && (
          <Translate
            component={InlineDownloadButton}
            content="dataset.dl.download"
            href={downloadUrl}
          />
        )}
        {localFilePath && (
          <FilePathColumn title={localFilePath}>{localFilePathPreview}</FilePathColumn>
        )}
        {canSource && (
          <Translate component={InlineSourceButton} content="dataset.dl.source" href={accessUrl} />
        )}
        <Translate
          component={InlineInfoButton}
          content="dataset.dl.info"
          onClick={() => setInInfo(resource)}
          attributes={{ 'aria-label': `dataset.dl.infoModalButton.external` }}
        />
      </ActionsColumn>
    </Item>
  )
}

ResourceItem.propTypes = {
  resource: PropTypes.object.isRequired,
  hideSize: PropTypes.bool,
  hideDataService: PropTypes.bool,
}

ResourceItem.defaultProps = {
  hideSize: false,
  hideDataService: false,
}

export const Name = styled.span`
  grid-column: name-start/name-end;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
`

const ResourceIcon = styled(FontAwesomeIcon).attrs({
  icon: faFile,
})`
  margin-right: 0.5em;
`

const ResourceButton = styled(IconButton)`
  width: 100%;
  height: 100%;
  margin-left: 0;
  margin-right: 0;
  margin: 0;
`

const SizeColumn = styled.span`
  grid-column: size-start/size-end;
  white-space: nowrap;
`

const DataServiceColumn = styled.span`
  grid-column: dataService-start/dataService-end;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const MenuLinkBase = styled(ResourceButton).attrs({
  flexGrow: 1,
  color: '#4f4f4f',
  invert: true,
  link: true,
})`
  width: 100%;
  justify-content: flex-start;
  margin: 0;
`

const MenuButtonAction = styled(ResourceButton).attrs({
  flexGrow: 1,
  icon: faInfoCircle,
  color: '#4f4f4f',
  invert: true,
  width: '100%',
})`
  justify-content: flex-start;
  margin: 0;
`

const DownloadButton = styled(MenuLinkBase).attrs(p => ({
  flexGrow: 1,
  icon: faDownload,
  invert: false,
  color: p.theme.ui.dataset.remoteResourceLink.color,
}))``

const InlineDownloadButton = styled(DownloadButton)`
  height: 1.75rem;
  min-height: 1.75rem;
  max-height: 1.75rem;
  margin-right: 0.25rem;
`

const SourceButton = styled(MenuLinkBase).attrs({
  icon: faExternalLinkAlt,
})``

const InlineSourceButton = styled(SourceButton)`
  height: 1.75rem;
  min-height: 1.75rem;
  max-height: 1.75rem;
  margin-right: 0.25rem;
`

const InlineInfoButton = styled(MenuButtonAction)`
  height: 1.75rem;
  min-height: 1.75rem;
  max-height: 1.75rem;
  width: auto;
  max-width: 6rem;
  margin-right: 0.25rem;
`

const FilePathColumn = styled.span`
  height: 1.75rem;
  min-height: 1.75rem;
  max-height: 1.75rem;
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  /* OG Etsin has slightly more space for the path than LUMI-AIF. */
  max-width: ${p => p.theme.ui.dataset.remoteResourceLink.pathMaxWidth};
  padding-right: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${p => p.theme.color.gray};
`

const ActionsColumn = styled.div`
  grid-column: actions-start/actions-end;
  position: relative;
  display: flex;
  justify-content: flex-end;
  flex-wrap: nowrap;
  white-space: nowrap;
  gap: 0.25rem;
  align-self: stretch;
`

const Item = styled.li`
  display: contents;
`

export default observer(ResourceItem)
