import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { shallow } from 'enzyme'
import { setImmediate } from 'timers'

import { DOWNLOAD_API_REQUEST_STATUS } from '../../../js/utils/constants'
import EnvClass from '../../../js/stores/domain/env'
import Packages from '../../../js/stores/view/packages'
import { fakeDownload, applyMockAdapter } from '../../__testdata__/download.data'
import { runInAction } from 'mobx'
import getDownloadAction, {
  getAllowDownload,
  getDownloadAllText,
} from '../../../js/components/dataset/data/idaResources/downloadActions'
import {
  downloadFile,
  downloadPackage,
} from '../../../js/components/dataset/data/idaResources/download'
import ErrorMessage from '../../../js/components/dataset/data/idaResources/errorMessage'

jest.mock('../../../js/components/dataset/data/idaResources/download', () => {
  const actual = jest.requireActual('../../../js/components/dataset/data/idaResources/download')
  return {
    ...actual,
    downloadFile: jest.fn().mockImplementation(actual.downloadFile),
    downloadPackage: jest.fn().mockImplementation(actual.downloadPackage),
  }
})

const { PENDING, STARTED, SUCCESS } = DOWNLOAD_API_REQUEST_STATUS

jest.useFakeTimers()

const Env = new EnvClass()

Env.setPackageSizeLimit(1024)
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
    await packages.createPackageFromPath('/')
    expect(packages.packages['/']).toEqual(expect.objectContaining({ status: PENDING }))
  })

  it('uses existing package instead of creating new', async () => {
    const original = fakeDownload.createPackage(1, '/')
    await packages.fetch(1)
    await packages.createPackageFromPath('/') // already exists
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
    fakeDownload.setProcessingDelay(500, 1000)
    fakeDownload.createPackage(1, '/files/jee')
    packages.setPollInterval(1000, 2)

    // pending items trigger polling
    await packages.fetch(1)
    expect(packages.get('/files/jee').status).toBe(PENDING)
    expect(mockAdapter.history.get.length).toBe(1)

    // first poll, generation started
    await wait(1000)
    expect(packages.get('/files/jee').status).toBe(STARTED)
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
    expect(packages.error.response.status).toBe(503)
    expect(console.error.mock.calls.length).toBe(1)
  })

  it('on failed package creation, logs error', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    runInAction(() => {
      packages.datasetIdentifier = 500
    })
    await packages.createPackageFromPath('/')
    expect(packages.error.response.status).toBe(500)
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

  it('sets requestingPackage', async () => {
    packages.setRequestingPackageCreation('/moro', true)
    expect(packages.packages['/moro'].requestingPackageCreation).toEqual(true)
  })

  describe('Notifications', () => {
    it('sets email', () => {
      const { Notifications } = packages
      Notifications.setEmail('email@example.org')
      expect(Notifications.email).toBe('email@example.org')
    })

    it('validates email', () => {
      const { Notifications } = packages
      Notifications.setEmail('email@example.org')
      Notifications.validateEmail()
      expect(Notifications.emailError).toBe(null)
    })

    it('fails to validate email', () => {
      const { Notifications } = packages
      Notifications.setEmail('emailasfokpexample.org')
      Notifications.validateEmail()
      expect(Notifications.emailError).not.toBe(null)
    })

    it('allows empty email', () => {
      const { Notifications } = packages
      Notifications.setEmail('')
      Notifications.validateEmail(false)
      expect(Notifications.emailError).toBe(null)
    })

    it('disallows empty email', () => {
      const { Notifications } = packages
      Notifications.setEmail('')
      Notifications.validateEmail(true)
      expect(Notifications.emailError).not.toBe(null)
    })

    it('resets email', () => {
      const { Notifications } = packages
      Notifications.setEmail('email@example.org')
      packages.Notifications.reset()
      expect(packages.Notifications.email).toBe('')
    })
  })
})

describe('Download button actions', () => {
  // Mock Files class used for getting paths
  const files = {
    getItemPath: item => item.path,
    getEquivalentItemScope: item => item.path,
  }

  const packages = new Packages(Env)
  runInAction(() => {
    packages.datasetIdentifier = 1
    packages.packages = {
      '/success': {
        status: SUCCESS,
        package: 'success.zip',
      },
      '/started': {
        status: STARTED,
        package: 'started.zip',
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
    expect(downloadFile.mock.calls).toEqual([[1, '/file', packages]])
  })

  it('allows package download', async () => {
    const successDirectoryItem = { type: 'directory', path: '/success' }
    const action = getDownloadAction(1, successDirectoryItem, packages, files)
    expect(action.type).toBe('download')
    expect(action.available).toBe(true)
    downloadPackage.mockImplementationOnce(() => {})
    action.func()
    expect(downloadPackage.mock.calls).toEqual([[1, 'success.zip', packages]])
  })

  it('shows spinner for pending package', async () => {
    const pendingDirectoryItem = { type: 'directory', path: '/pending' }
    const action = getDownloadAction(1, pendingDirectoryItem, packages, files)
    expect(action.type).toBe('pending')
    expect(action.func).not.toBe(null)
    expect(action.spin).toBe(true)
  })

  it('shows spinner for started package', async () => {
    const startedDirectoryItem = { type: 'directory', path: '/started' }
    const action = getDownloadAction(1, startedDirectoryItem, packages, files)
    expect(action.type).toBe('pending')
    expect(action.func).not.toBe(null)
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
    action.func()
    expect(packages.packageModalPath).toBe('/no_package')
  })

  it('allows downloading large files', async () => {
    const fileItem = { type: 'file', path: '/file', byteSize: packages.sizeLimit + 1 }
    const action = getDownloadAction(1, fileItem, packages, files)
    expect(action).toEqual(expect.objectContaining({ disabled: false }))
  })

  it('allows generating large package with size equal to sizeLimit', async () => {
    const largeDirectoryItem = {
      type: 'directory',
      path: '/pending',
      existingByteSize: packages.sizeLimit,
    }
    const action = getDownloadAction(1, largeDirectoryItem, packages, files)
    expect(action).toEqual(expect.objectContaining({ disabled: false }))
  })

  it('prevents generating package for directory larger than sizeLimit', async () => {
    const largeDirectoryItem = {
      type: 'directory',
      path: '/pending',
      existingByteSize: packages.sizeLimit + 1,
    }
    const action = getDownloadAction(1, largeDirectoryItem, packages, files)
    expect(action).toEqual(expect.objectContaining({ disabled: true }))
  })

  it('allows generating package for dataset with size equal to sizeLimit', async () => {
    const filesWithLargeRoot = {
      ...files,
      root: {
        type: 'directory',
        path: '/pending',
        existingByteSize: packages.sizeLimit,
      },
    }
    const action = getDownloadAction(1, null, packages, filesWithLargeRoot)
    expect(action).toEqual(expect.objectContaining({ disabled: false }))
  })

  it('prevents generating  for dataset larger than sizeLimit', async () => {
    const filesWithLargeRoot = {
      ...files,
      root: {
        type: 'directory',
        path: '/pending',
        existingByteSize: packages.sizeLimit + 1,
      },
    }
    const action = getDownloadAction(1, null, packages, filesWithLargeRoot)
    expect(action).toEqual(expect.objectContaining({ disabled: true }))
  })
})

describe('Download functions', () => {
  const mockPackages = { setError: jest.fn(), clearError: jest.fn() }

  beforeEach(() => {
    mockPackages.setError.mockReset()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('downloads file', async () => {
    await downloadFile(123, '/some/file/path.txt', mockPackages)
    const iframes = document.getElementsByTagName('iframe')
    expect(iframes.length).toBe(1)
    expect(iframes[0].getAttribute('src')).toBe('file_dl_url?cr_id=123&file=/some/file/path.txt')
  })

  it('downloads package', async () => {
    await downloadPackage(123, 'package-id', mockPackages)
    const iframes = document.getElementsByTagName('iframe')
    expect(iframes.length).toBe(1)
    expect(iframes[0].getAttribute('src')).toBe('package_dl_url?cr_id=123&package=package-id')
  })

  it('reuses iframe', async () => {
    await downloadPackage(123, 'package-id', mockPackages)
    let iframes = document.getElementsByTagName('iframe')
    expect(iframes.length).toBe(1)
    expect(iframes[0].getAttribute('src')).toBe('package_dl_url?cr_id=123&package=package-id')

    await downloadPackage(123, 'package-id-2', mockPackages)
    iframes = document.getElementsByTagName('iframe')
    expect(iframes.length).toBe(1)
    expect(iframes[0].getAttribute('src')).toBe('package_dl_url?cr_id=123&package=package-id-2')
  })

  it('logs error', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    await downloadPackage(500, 'package-id', mockPackages)
    expect(mockPackages.setError.mock.calls.length).toBe(1)
    expect(console.error.mock.calls.length).toBe(1)
  })
})

describe('getAllowDownload', () => {
  it('returns true for published IDA dataset', () => {
    expect(
      getAllowDownload(
        {
          isDraft: false,
          isPas: false,
        },
        { allowDataIdaDownloadButton: true }
      )
    ).toBe(true)
  })

  it('returns false for restricted IDA dataset', () => {
    expect(
      getAllowDownload(
        {
          isDraft: false,
          isPas: false,
        },
        { allowDataIdaDownloadButton: false }
      )
    ).toBe(false)
  })

  it('returns false for DPS dataset', () => {
    expect(
      getAllowDownload(
        {
          isDraft: false,
          isPas: true,
        },
        { allowDataIdaDownloadButton: true }
      )
    ).toBe(false)
  })

  it('returns false for draft', () => {
    expect(getAllowDownload({ isDraft: true }, { allowDataIdaDownloadButton: true })).toBe(false)
  })
})

describe('getDownloadAllText', () => {
  it('returns download text for non-draft', () => {
    expect(getDownloadAllText({ isDraft: false })).toBe('dataset.dl.downloadAll')
  })

  it('returns download disabled text for draft', () => {
    expect(getDownloadAllText({ isDraft: true })).toBe('dataset.dl.downloadDisabledForDraft')
  })
})

describe('ErrorMessage', () => {
  const baseError = {
    name: 'errortype',
    message: 'things went wrong',
  }

  const translationShouldExist = (wrapper, translation) => {
    expect(wrapper.findWhere(c => c.prop('content') === translation).length).toBe(1)
  }

  it('shows "service unavailable" message', () => {
    const wrapper = shallow(<ErrorMessage error={baseError} clear={() => {}} />)
    translationShouldExist(wrapper, 'dataset.dl.errors.serviceUnavailable')
  })

  it('shows "unknown error" message', () => {
    const error = {
      ...baseError,
      response: {
        status: 503,
      },
    }
    const wrapper = shallow(<ErrorMessage error={error} clear={() => {}} />)
    translationShouldExist(wrapper, 'dataset.dl.errors.unknownError')
  })

  it('shows embargo message', () => {
    const error = {
      ...baseError,
      response: {
        data: {
          reason: 'EMBARGO',
        },
      },
    }
    const wrapper = shallow(<ErrorMessage error={error} clear={() => {}} />)
    translationShouldExist(wrapper, 'dataset.access_rights_description.embargo')
  })

  it('shows error details', () => {
    const wrapper = shallow(<ErrorMessage error={baseError} clear={() => {}} />)
    const button = wrapper.findWhere(c => c.prop('content') === 'error.details.showDetails')
    button.simulate('click')
    expect(wrapper.contains('errortype: things went wrong')).toBe(true)
  })
})
