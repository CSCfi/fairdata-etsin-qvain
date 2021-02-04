import {
  faDownload,
  faSpinner,
  faCog,
} from '@fortawesome/free-solid-svg-icons'

import { DOWNLOAD_API_REQUEST_STATUS } from '../../../../utils/constants'
import { downloadFile, downloadPackage } from './download'

// Download button information for file/package
const actionDefaults = {
  buttonLabel: 'dataset.dl.download',
  tooltip: null,
  color: null,
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
    func,
    color: 'success',
    type: 'download',
    available: true,
  }
}

const actionPending = () => ({
  ...actionDefaults,
  buttonLabel: 'dataset.dl.packages.pending',
  tooltip: 'dataset.dl.packages.pendingTooltip',
  color: 'darkgray',
  icon: faSpinner,
  pending: true,
  spin: true,
  type: 'pending',
})

const actionLoading = () => ({
  ...actionPending(),
  buttonLabel: 'dataset.dl.packages.loading',
  tooltip: null,
  pending: false,
  type: 'loading',
})

const actionCreatePackage = (Packages, path) => ({
  ...actionDefaults,
  buttonLabel: 'dataset.dl.packages.create',
  func: () => Packages.confirm(() => Packages.createPackageFromFolder(path)),
  icon: faCog,
  spin: false,
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
