import {
  faDownload,
  faSpinner,
  faFileArchive,
} from '@fortawesome/free-solid-svg-icons'

import { DOWNLOAD_API_REQUEST_STATUS } from '../../../../utils/constants'
import { downloadFile, downloadPackage } from './download'

// Download button information for file/package
//   ariaLabel: Icon button aria-label
//   available: is item available for download
//   func: action when dl button is clicked
//   icon: download button icon
//   pending: is package being generated
//   spin: enable spin (for loading icon)
//   type: type of action (used for tests)

const actionDefaults = {
  ariaLabel: 'dataset.dl.downloadItem',
  available: false,
  func: null,
  icon: faDownload,
  pending: false,
  spin: false,
  type: 'default',
}

const actionDownload = (datasetIdentifier, item, path, pack) => {
  let func
  if (item && item.type === 'file') {
    func = () => downloadFile(datasetIdentifier, path)
  } else {
    func = () => downloadPackage(datasetIdentifier, pack.package)
  }
  return {
    ...actionDefaults,
    ariaLabel: 'dataset.dl.downloadItem',
    func,
    type: 'download',
  }
}

const actionPending = () => ({
  ...actionDefaults,
  ariaLabel: 'dataset.dl.packages.pending',
  icon: faSpinner,
  pending: false,
  spin: true,
  type: 'pending',
})

const actionLoading = () => ({
  ...actionPending(),
  ariaLabel: 'dataset.dl.packages.loading',
  type: 'loading',
})

const actionCreatePackage = (Packages, path) => ({
  ...actionDefaults,
  ariaLabel: 'dataset.dl.packages.createForItem',
  func: () => Packages.createPackageFromFolder(path),
  icon: faFileArchive,
  type: 'create',
})

const getDownloadAction = (datasetIdentifier, item, Packages, Files) => {
  const path = item ? Files.getItemPath(item) : '/'
  const pack = Packages.get(path)

  const isFile = item && item.type === 'file'
  let action
  if (isFile || (pack && pack.status === DOWNLOAD_API_REQUEST_STATUS.SUCCESS)) {
    action = actionDownload(datasetIdentifier, item, path, pack)
  } else if (pack && pack.status === DOWNLOAD_API_REQUEST_STATUS.PENDING) {
    action = actionPending()
  } else if (Packages.loadingDataset) {
    action = actionLoading()
  } else {
    action = actionCreatePackage(Packages, path)
  }
  return action
}

export default getDownloadAction
