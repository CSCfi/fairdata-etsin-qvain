import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

import { DOWNLOAD_API_REQUEST_STATUS } from '../js/utils/constants'
import Env from '../js/stores/domain/env'
import Packages from '../js/stores/view/packages'
import { fakeDownload, applyMockAdapter } from './__testdata__/download.data'

global.Promise = require('bluebird')
Promise.config({
  cancellation: true,
})

const { PENDING, SUCCESS } = DOWNLOAD_API_REQUEST_STATUS

// Enable fake timers. Use 'legacy' explicitly because
// jest 27 will change the default to 'modern' which will
// probably require some changes.
jest.useFakeTimers('legacy')

Env.setDownloadApiV2(true)
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
    jest.clearAllTimers()
    applyMockAdapter(mockAdapter)
    fakeDownload.reset()
    mockAdapter.resetHistory()
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
})
