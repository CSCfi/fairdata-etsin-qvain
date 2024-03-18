import axios from 'axios'

import urls from '@/utils/urls'

const authorize = async (params, Packages, useV3, metaxV3Url) => {
  Packages.clearError()
  // Authorize download for single file or package and return url
  try {
    const authUrl = useV3 ? metaxV3Url('download', 'authorize') : urls.dl.authorize()
    const resp = await axios.post(authUrl, params)
    const { url } = resp.data
    return { url, params }
  } catch (error) {
    console.error(error)
    Packages.setError(error)
    return { error, params }
  }
}

const download = async (params, Packages, useV3, metaxV3Url) => {
  Packages.clearError()
  // Authorize download for single file or package and download it
  try {
    const { url } = await authorize(params, Packages, useV3, metaxV3Url)
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

export const downloadFile = async (useV3, metaxV3Url, datasetIdentifier, path, Packages) => {
  const params = { cr_id: datasetIdentifier, file: path }
  return download(params, Packages, useV3, metaxV3Url)
}

export const downloadPackage = async (
  useV3,
  metaxV3Url,
  datasetIdentifier,
  packageName,
  Packages
) => {
  const params = { cr_id: datasetIdentifier, package: packageName }
  return download(params, Packages, useV3, metaxV3Url)
}

export const authorizeFile = async (useV3, metaxV3Url, datasetIdentifier, path, Packages) => {
  const params = { cr_id: datasetIdentifier, file: path }
  return authorize(params, Packages, useV3, metaxV3Url)
}

export const authorizePackage = async (
  useV3,
  metaxV3Url,
  datasetIdentifier,
  packageName,
  Packages
) => {
  const params = { cr_id: datasetIdentifier, package: packageName }
  return authorize(params, Packages, useV3, metaxV3Url)
}
