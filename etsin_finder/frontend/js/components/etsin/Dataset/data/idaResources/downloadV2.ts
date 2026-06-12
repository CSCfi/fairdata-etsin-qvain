import axios from 'axios'
import type Packages from '@/stores/view/packages'
import type Env from '@/stores/domain/env'

interface Params {
  dataset_id: string
  scope?: string
}

const authorize = async (params: Params, Packages: Packages, Env: Env) => {
  Packages.clearError()
  const authUrl = Env.metaxUrls.downloadAuthorize()
  const resp = await axios.post(authUrl, params, { withCredentials: true })
  return resp.data
}

const download = async (params: Params, Packages: Packages, Env: Env) => {
  Packages.clearError()
  try {
    const { download_url: downloadUrl } = await authorize(params, Packages, Env)
    if (!downloadUrl) {
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
    iframe.setAttribute('src', downloadUrl)
  } catch (e) {
    console.error(e)
    Packages.setError(e)
  }
}

export const downloadPath = async (
  datasetIdentifier: string,
  path: string,
  Packages: Packages,
  Env: Env
) => {
  const params = { dataset_id: datasetIdentifier, scope: path.slice(1) }
  return download(params, Packages, Env)
}

export const authorizePath = async (
  datasetIdentifier: string,
  path: string,
  Packages: Packages,
  Env: Env
) => {
  const params = { dataset_id: datasetIdentifier, scope: path.slice(1) }
  return authorize(params, Packages, Env)
}
