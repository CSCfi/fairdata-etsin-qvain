import axios from 'axios'
import { DOWNLOAD_API_REQUEST_STATUS } from '../../../../utils/constants'

const downloadV2 = async (datasetIdentifier, item, Files, packageRequest) => {
  const params = { cr_id: datasetIdentifier }

  const path = item ? Files.getItemPath(item) : '/'
  if (item && item.type === 'file') {
    params.file = path
  } else {
    if (!packageRequest) {
      console.error('No package available for directory', path)
    }
    if (!packageRequest.package) {
      console.error('Invalid package for directory', path)
    }
    if (packageRequest.status !== DOWNLOAD_API_REQUEST_STATUS.success) {
      console.error('Package not ready for directory', path)
    }
    params.package = packageRequest.package
  }

  const resp = await axios.post('/api/v2/dl/authorize', params)
  const { url } = resp.data

  // Use invisible iframe to download files
  let iframe = document.getElementById('download-iframe')
  if (!iframe) {
    iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    iframe.style.display = 'none'
  }
  iframe.setAttribute('src', url)
}

export default downloadV2
