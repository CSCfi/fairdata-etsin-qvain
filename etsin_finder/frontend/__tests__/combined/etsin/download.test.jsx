import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

import { DOWNLOAD_API_REQUEST_STATUS } from '../../../js/utils/constants'
import Env from '../../../js/stores/domain/env'
import Packages from '../../../js/stores/view/packages'
import { fakeDownload, applyMockAdapter } from '../../__testdata__/download.data'
import { runInAction } from 'mobx'
import getDownloadAction from '../../../js/components/dataset/data/idaResourcesV2/downloadActions'
import {
  downloadFile,
  downloadPackage,
} from '../../../js/components/dataset/data/idaResourcesV2/download'

jest.mock('../../../js/components/dataset/data/idaResourcesV2/download', () => {
  const actual = jest.requireActual('../../../js/components/dataset/data/idaResourcesV2/download')
  return {
    ...actual,
    downloadFile: jest.fn().mockImplementation(actual.downloadFile),
    downloadPackage: jest.fn().mockImplementation(actual.downloadPackage),
  }
})

global.Promise = require('bluebird')
Promise.config({
  cancellation: true,
})

const { PENDING, SUCCESS } = DOWNLOAD_API_REQUEST_STATUS

// Enable fake timers. Use 'legacy' explicitly because
// jest 27 will change the default to 'modern' which will
// require some changes.
jest.useFakeTimers('legacy')

Env.Flags.setFlag('DOWNLOAD_API_V2', true)
const mockAdapter = new MockAdapter(axios)
applyMockAdapter(mockAdapter)

// Wait until ms milliseconds have passed and execute all pending promises
const wait = async ms => {
  jest.advanceTimersByTime(ms)
  await new Promise(setImmediate)
}

describe('Packages', () => {
  let packages

  beforeEach(() => {
    packages = new Packages(Env)
    packages.reset()
    jest.clearAllTimers()
    applyMockAdapter(mockAdapter)
    fakeDownload.reset()
    mockAdapter.resetHistory()
  })

  afterEach(() => {
    if (console.error.mockReset) {
      console.error.mockReset()
    }
  })

  it('fetches package list', async () => {
    fakeDownload.createPackage(1, '/')
    fakeDownload.createPackage(1, '/files/jee')

    await packages.fetch(1)
    expect(mockAdapter.history.get).toEqual([
      expect.objectContaining({
        url: '/api/v2/dl/requests?cr_id=1',
      }),
    ])

    expect(packages.get('/').status).toBe(SUCCESS)
    expect(packages.get('/files/jee').status).toBe(SUCCESS)
  })

  it('clears package list when dataset changes', async () => {
    fakeDownload.createPackage(1, '/firstdataset')
    fakeDownload.createPackage(2, '/otherdataset')

    await packages.fetch(1)
    expect(packages.get('/firstdataset').status).toBe(SUCCESS)
    expect(packages.get('/otherdataset')).toBe(undefined)

    await packages.fetch(2)
    expect(packages.get('/firstdataset')).toBe(undefined)
    expect(packages.get('/otherdataset').status).toBe(SUCCESS)
  })

  it('handles 404 correctly', async () => {
    await packages.fetch(1) // no packages exist yet
    expect(packages.packages).toEqual({})
  })

  it('creates package for dataset', async () => {
    fakeDownload.setProcessingDelay(100)
    await packages.fetch(1) // no packages exist yet
    await packages.createPackageFromFolder('/')
    expect(packages.packages['/']).toEqual(expect.objectContaining({ status: PENDING }))
  })

  it('uses existing package instead of creating new', async () => {
    const original = fakeDownload.createPackage(1, '/')
    await packages.fetch(1)
    await packages.createPackageFromFolder('/') // already exists
    expect(packages.packages['/']).toEqual(
      expect.objectContaining({
        status: SUCCESS,
        package: original.package,
      })
    )
  })

  it('polls for pending packages', async () => {
    // Expected sequence:
    //   t=0: Package pending
    //   t=1000: Poll, package still pending
    //   t=1500: Package ready in service but not polled yet
    //   t=3000: Poll, Package ready
    fakeDownload.setProcessingDelay(1500)
    fakeDownload.createPackage(1, '/files/jee')
    packages.setPollInterval(1000)

    // pending items trigger polling
    await packages.fetch(1)
    expect(packages.get('/files/jee').status).toBe(PENDING)
    expect(mockAdapter.history.get.length).toBe(1)

    // first poll
    await wait(1000)
    expect(packages.get('/files/jee').status).toBe(PENDING)
    expect(mockAdapter.history.get.length).toBe(2)

    // second poll should be 2*initialPollInterval after first has finished
    expect(mockAdapter.history.get.length).toBe(2)
    await wait(2000 - 1)
    expect(packages.pollTimeout).not.toBe(null)
    await wait(1)
    expect(mockAdapter.history.get.length).toBe(3)
    expect(packages.get('/files/jee').status).toBe(SUCCESS)
    expect(packages.pollTimeout).toBe(null)
  })

  it('on failed fetch, logs error', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    await packages.fetch(503)
    expect(packages.error.code).toBe(503)
    expect(console.error.mock.calls.length).toBe(1)
  })

  it('on failed package creation, logs error', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    runInAction(() => {
      packages.datasetIdentifier = 500
    })
    await packages.createPackageFromFolder('/')
    expect(packages.error.code).toBe(500)
    expect(console.error.mock.calls.length).toBe(1)
  })

  it('updates package', async () => {
    const pack = { scope: ['/moro'], status: 'status' }
    packages.updatePackage('/moro', pack)
    expect(packages.packages['/moro']).toEqual(pack)
  })

  it('ignores package with multiple items in scope', async () => {
    const pack = { scope: ['/moro', '/another_folder'] }
    packages.updatePackage('/moro', pack)
    expect(packages.packages['/moro']).toEqual(undefined)
  })
})

describe('Download button actions', () => {
  // Mock Files class used for getting paths
  const files = {
    getItemPath: item => item.path,
  }

  const packages = new Packages(Env)
  runInAction(() => {
    packages.datasetIdentifier = 1
    packages.packages = {
      '/success': {
        status: SUCCESS,
        package: 'success.zip',
      },
      '/pending': {
        status: PENDING,
        package: 'pending.zip',
      },
    }
  })

  beforeEach(() => {
    runInAction(() => {
      packages.loadingDataset = false
    })
  })

  afterEach(() => {
    downloadFile.mockClear()
    downloadPackage.mockClear()
  })

  it('allows file download without package', async () => {
    const fileItem = { type: 'file', path: '/file' }
    const action = getDownloadAction(1, fileItem, packages, files)
    expect(action.type).toBe('download')
    expect(action.available).toBe(true)
    downloadFile.mockImplementationOnce(() => {})
    action.func()
    expect(downloadFile.mock.calls).toEqual([[1, '/file']])
  })

  it('allows package download', async () => {
    const successDirectoryItem = { type: 'directory', path: '/success' }
    const action = getDownloadAction(1, successDirectoryItem, packages, files)
    expect(action.type).toBe('download')
    expect(action.available).toBe(true)
    downloadPackage.mockImplementationOnce(() => {})
    action.func()
    expect(downloadPackage.mock.calls).toEqual([[1, 'success.zip']])
  })

  it('shows spinner for pending package', async () => {
    const pendingDirectoryItem = { type: 'directory', path: '/pending' }
    const action = getDownloadAction(1, pendingDirectoryItem, packages, files)
    expect(action.type).toBe('pending')
    expect(action.func).toBe(null)
    expect(action.spin).toBe(true)
  })

  it('shows spinner when loading package information', async () => {
    runInAction(() => {
      packages.loadingDataset = true
    })
    const noPackageDirectoryItem = { type: 'directory', path: '/no_package' }
    const action = getDownloadAction(1, noPackageDirectoryItem, packages, files)
    expect(action.type).toBe('loading')
    expect(action.func).toBe(null)
    expect(action.spin).toBe(true)
  })

  it('allows creating package', async () => {
    const noPackageDirectoryItem = { type: 'directory', path: '/no_package' }
    const action = getDownloadAction(1, noPackageDirectoryItem, packages, files)
    expect(action.type).toBe('create')
    jest.spyOn(packages, 'createPackageFromFolder')
    action.func()
    expect(packages.createPackageFromFolder.mock.calls).toEqual([['/no_package']])
  })
})

describe('Download functions', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('downloads file', async () => {
    await downloadFile(123, '/some/file/path.txt')
    const iframes = document.getElementsByTagName('iframe')
    expect(iframes.length).toBe(1)
    expect(iframes[0].getAttribute('src')).toBe('file_dl_url?cr_id=123&file=/some/file/path.txt')
  })

  it('downloads package', async () => {
    await downloadPackage(123, 'package-id')
    const iframes = document.getElementsByTagName('iframe')
    expect(iframes.length).toBe(1)
    expect(iframes[0].getAttribute('src')).toBe('package_dl_url?cr_id=123&package=package-id')
  })

  it('reuses iframe', async () => {
    await downloadPackage(123, 'package-id')
    let iframes = document.getElementsByTagName('iframe')
    expect(iframes.length).toBe(1)
    expect(iframes[0].getAttribute('src')).toBe('package_dl_url?cr_id=123&package=package-id')

    await downloadPackage(123, 'package-id-2')
    iframes = document.getElementsByTagName('iframe')
    expect(iframes.length).toBe(1)
    expect(iframes[0].getAttribute('src')).toBe('package_dl_url?cr_id=123&package=package-id-2')
  })

  it('logs error', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    await downloadPackage(500, 'package-id')
    expect(console.error.mock.calls.length).toBe(1)
  })
})
