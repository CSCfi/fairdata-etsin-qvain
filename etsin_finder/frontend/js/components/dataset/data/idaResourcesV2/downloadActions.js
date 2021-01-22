import {
  faDownload,
  faSpinner,
  faFileArchive,
} from '@fortawesome/free-solid-svg-icons'

import { DOWNLOAD_API_REQUEST_STATUS } from '../../../../utils/constants'
import { downloadFile, downloadPackage } from './download'

// Download button information for file/package
const actionDefaults = {
  ariaLabel: 'dataset.dl.downloadItem',
  available: false, // is file/package ready for download
  func: null, // action when button is clicked
  icon: faDownload,
  pending: false, // is package being generated
  spin: false,
  type: 'default',
}

const actionDownload = (datasetIdentifier, item, path, pack, Packages) => {
  let func
  if (item && item.type === 'file') {
    func = () => downloadFile(datasetIdentifier, path, Packages)
  } else {
    func = () => downloadPackage(datasetIdentifier, pack.package, Packages)
  }
  return {
    ...actionDefaults,
    ariaLabel: 'dataset.dl.downloadItem',
    func,
    type: 'download',
    available: true,
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
  const isFile = item && item.type === 'file'
  let path = '/'
  if (item) {
    path = isFile ? Files.getItemPath(item) : Files.getEquivalentItemScope(item)
  }
  const pack = Packages.get(path)

  let action
  if (isFile || (pack && pack.status === DOWNLOAD_API_REQUEST_STATUS.SUCCESS)) {
    action = actionDownload(datasetIdentifier, item, path, pack, Packages)
  } else if (pack && (pack.status === DOWNLOAD_API_REQUEST_STATUS.PENDING || pack.requestingPackageCreation)) {
    action = actionPending()
  } else if (Packages.loadingDataset) {
    action = actionLoading()
  } else {
    action = actionCreatePackage(Packages, path)
  }
  return action
}

export default getDownloadAction
