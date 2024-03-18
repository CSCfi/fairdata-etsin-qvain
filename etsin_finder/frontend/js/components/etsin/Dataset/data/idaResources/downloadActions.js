import { faDownload, faSpinner, faCog } from '@fortawesome/free-solid-svg-icons'

import { DOWNLOAD_API_REQUEST_STATUS } from '@/utils/constants'
import { downloadFile, downloadPackage, authorizeFile, authorizePackage } from './download'

// Download button information for file/package
const actionDefaults = {
  buttonLabel: 'dataset.dl.download',
  color: null,
  available: false, // is file/package ready for download
  func: null, // action when button is clicked
  icon: faDownload,
  pending: false, // is package being generated
  spin: false,
  type: 'default',
  disabled: false,
  tooltip: null,
}

const actionDownload = (useV3, metaxV3Url, datasetIdentifier, item, path, pack, Packages) => {
  let func, authorizeFunc
  if (item && item.type === 'file') {
    func = () => downloadFile(useV3, metaxV3Url, datasetIdentifier, path, Packages)
    authorizeFunc = () => authorizeFile(useV3, metaxV3Url, datasetIdentifier, path, Packages)
  } else {
    func = () => downloadPackage(useV3, metaxV3Url, datasetIdentifier, pack.package, Packages)
    authorizeFunc = () =>
      authorizePackage(useV3, metaxV3Url, datasetIdentifier, pack.package, Packages)
  }
  return {
    ...actionDefaults,
    func,
    moreAriaLabel: 'dataset.dl.manualDownload.ariaLabel',
    moreFunc: () => Packages.openManualDownloadModal(authorizeFunc),
    color: 'success',
    type: 'download',
    available: true,
  }
}

const actionPending = (Packages, path) => ({
  ...actionDefaults,
  buttonLabel: 'dataset.dl.packages.pending',
  func: () => Packages.openPackageModal(path),
  color: 'darkgray',
  icon: faSpinner,
  pending: true,
  spin: true,
  type: 'pending',
})

const actionLoading = () => ({
  ...actionPending(),
  buttonLabel: 'dataset.dl.packages.loading',
  func: null,
  pending: false,
  type: 'loading',
})

const actionCreatePackage = (Packages, path) => ({
  ...actionDefaults,
  buttonLabel: 'dataset.dl.packages.create',
  func: () => Packages.openPackageModal(path),
  icon: faCog,
  spin: false,
  type: 'create',
})

const getDownloadAction = (useV3, metaxV3Url, datasetIdentifier, item, Packages, Files) => {
  const isFile = item?.type === 'file'
  let path = '/'
  if (item) {
    path = isFile ? Files.getItemPath(item) : Files.getEquivalentItemScope(item)
  }
  const pack = Packages.get(path)

  let action
  if (isFile || (pack && pack.status === DOWNLOAD_API_REQUEST_STATUS.SUCCESS)) {
    action = actionDownload(useV3, metaxV3Url, datasetIdentifier, item, path, pack, Packages)
  } else {
    if (
      pack &&
      (pack.status === DOWNLOAD_API_REQUEST_STATUS.PENDING ||
        pack.status === DOWNLOAD_API_REQUEST_STATUS.STARTED ||
        pack.requestingPackageCreation)
    ) {
      action = actionPending(Packages, path)
    } else if (Packages.loadingDataset) {
      action = actionLoading()
    } else {
      action = actionCreatePackage(Packages, path)
    }

    const isTooLarge = Packages.packageIsTooLarge(Files, item)
    if (isTooLarge) {
      action.disabled = true
      action.tooltip = 'dataset.dl.packages.tooLarge'
    }
  }

  return action
}

export const getAllowDownload = (DatasetQuery, restrictions) => {
  if (DatasetQuery.isPas) {
    return false
  }
  if (DatasetQuery.isDraft) {
    return false
  }
  return restrictions.allowDataIdaDownloadButton
}

export const getDownloadAllText = DatasetQuery =>
  DatasetQuery.isDraft ? 'dataset.dl.downloadDisabledForDraft' : 'dataset.dl.downloadAll'

export default getDownloadAction
