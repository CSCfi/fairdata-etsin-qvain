import { faDownload, type IconDefinition } from '@fortawesome/free-solid-svg-icons'

import { downloadPath, authorizePath } from './downloadV2'
import type Env from '@/stores/domain/env'
import type Packages from '@/stores/view/packages'
import type FilesBaseV3 from '@/stores/view/common.files.v3'
import type DatasetQuery from '@/stores/view/datasetquery'
import type { Restrictions } from '@/stores/view/access'

export interface DownloadAction {
  buttonLabel: string
  moreAriaLabel: null | string
  color: null | string
  available: boolean
  func: null | (() => any)
  moreFunc: null | (() => any)
  icon: IconDefinition
  pending: boolean
  spin: boolean
  type: string
  disabled: boolean
  tooltip: null
}

// Download button information for file/package
const actionDefaults: DownloadAction = {
  buttonLabel: 'dataset.dl.download',
  moreAriaLabel: null,
  color: null,
  available: false, // is file/package ready for download
  func: null, // action when button is clicked
  moreFunc: null, // action when button is clicked
  icon: faDownload,
  pending: false, // is package being generated
  spin: false,
  type: 'default',
  disabled: false,
  tooltip: null,
}

interface Item {
  type: 'file' | 'directory' | 'project'
}

const getDownloadAction = (
  datasetIdentifier: string,
  item: Item | null,
  Packages: Packages,
  Files: FilesBaseV3,
  Env: Env
): DownloadAction => {
  let path = '/'
  if (item) {
    path = Files.getItemPath(item)
  }

  const func = () => downloadPath(datasetIdentifier, path, Packages, Env)
  const authorizeFunc = () => authorizePath(datasetIdentifier, path, Packages, Env)
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

export const getAllowDownload = (DatasetQuery: DatasetQuery, restrictions: Restrictions) => {
  if (DatasetQuery.isPas) {
    return false
  }
  if (DatasetQuery.isDraft) {
    return false
  }
  return restrictions.allowDataIdaDownloadButton
}

export const getDownloadAllText = (DatasetQuery: DatasetQuery) =>
  DatasetQuery.isDraft ? 'dataset.dl.downloadDisabledForDraft' : 'dataset.dl.downloadAll'

export default getDownloadAction
