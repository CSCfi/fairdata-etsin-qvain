import axios from 'axios'
import {
  faDownload,
  faSpinner,
  faCartArrowDown
} from '@fortawesome/free-solid-svg-icons'

import { DOWNLOAD_API_REQUEST_STATUS } from '../../../../utils/constants'

const download = async (params) => {
  // Authorize download for single file or package and download it
  const resp = await axios.post('/api/v2/dl/authorize', params)
  const { url } = resp.data

  // Use invisible iframe for downloading
  let iframe = document.getElementById('download-iframe')
  if (!iframe) {
    iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    iframe.style.display = 'none'
  }
  iframe.setAttribute('src', url)
}

const downloadFile = async (datasetIdentifier, path) => {
  const params = { cr_id: datasetIdentifier, file: path }
  return download(params)
}

const downloadPackage = async (datasetIdentifier, packageName) => {
  const params = { cr_id: datasetIdentifier, package: packageName }
  return download(params)
}

const getDownloadAction = (datasetIdentifier, item, Packages, Files) => {
  let available = false
  let func = null
  let icon = faDownload
  let spin = false

  const path = item ? Files.getItemPath(item) : '/'
  const pack = Packages.get(path)

  const isFile = item && item.type === 'file'
  if (isFile) {
    available = true
    func = () => downloadFile(datasetIdentifier, path)
  } else if (pack && pack.status === DOWNLOAD_API_REQUEST_STATUS.SUCCESS) {
    available = true
    func = () => downloadPackage(datasetIdentifier, pack.package)
  } else if (pack && pack.status === DOWNLOAD_API_REQUEST_STATUS.PENDING) {
    available = true
    icon = faSpinner
    spin = true
  } else {
    available = true
    icon = faCartArrowDown
    func = () => Packages.createPackageFromFolder(path)
  }

  return {
    available, func, icon, spin
  }
}

export default getDownloadAction
