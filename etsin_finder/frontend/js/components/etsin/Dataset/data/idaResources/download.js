import axios from 'axios'
import urls from '@/utils/urls'

const authorize = async (params, Packages) => {
  Packages.clearError()
  // Authorize download for single file or package and return url
  const authUrl = urls.metaxV3.download.authorize()
  try {
    const resp = await axios.post(authUrl, params)
    const { url } = resp.data
    return { url, params }
  } catch (error) {
    console.error(error)
    Packages.setError(error)
    return { error, params }
  }
}

const download = async (params, Packages) => {
  Packages.clearError()
  // Authorize download for single file or package and download it
  try {
    const { url } = await authorize(params, Packages)
    if (!url) {
      return
    }

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

export const authorizeFile = async (datasetIdentifier, path, Packages) => {
  const params = { cr_id: datasetIdentifier, file: path }
  return authorize(params, Packages)
}

export const authorizePackage = async (datasetIdentifier, packageName, Packages) => {
  const params = { cr_id: datasetIdentifier, package: packageName }
  return authorize(params, Packages)
}
