import axios from 'axios'

const download = async (params, Packages) => {
  // Authorize download for single file or package and download it
  try {
    Packages.clearError()
    const resp = await axios.post('/api/v2/dl/authorize', params)
    const { url } = resp.data

    // Use invisible iframe for downloading
    let iframe = document.getElementById('download-iframe')
    if (!iframe) {
      iframe = document.createElement('iframe')
      document.body.appendChild(iframe)
      iframe.id = 'download-iframe'
      iframe.style.display = 'none'
    }
    iframe.setAttribute('src', url)
  } catch (e) {
    console.error(e)
    Packages.setError(e)
  }
}

export const downloadFile = async (datasetIdentifier, path, Packages) => {
  const params = { cr_id: datasetIdentifier, file: path }
  return download(params, Packages)
}

export const downloadPackage = async (datasetIdentifier, packageName, Packages) => {
  const params = { cr_id: datasetIdentifier, package: packageName }
  return download(params, Packages)
}
