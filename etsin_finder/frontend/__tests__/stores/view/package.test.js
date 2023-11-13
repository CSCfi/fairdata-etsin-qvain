import axios from 'axios'
import Packages from '../../../js/stores/view/packages'
import { DOWNLOAD_API_REQUEST_STATUS } from '../../../js/utils/constants'
import urls from '../../../js/utils/urls'

jest.useFakeTimers()

jest.mock('axios')

describe('Packages', () => {
  let packages
  const mockEnv = {
    Flags: { flagEnabled: () => true },
    packageSizeLimit: 1024,
  }

  beforeEach(() => {
    packages = new Packages(mockEnv)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('initialPollInterval should be 1e3', () => {
    packages.initialPollInterval.should.eql(1e3)
  })

  test('pollInterval should be set to same as intialPollInterval', () => {
    packages.pollInterval.should.eql(packages.initialPollInterval)
  })

  test('pollMultiplier should be 1.2', () => {
    packages.pollMultiplier.should.eql(1.2)
  })

  test('loadingDataset should be set to false', () => {
    packages.loadingDataset.should.be.false
  })

  test('error should be set to null', () => {
    expect(packages.error).toBe(null)
  })

  test('datasetIdentifier should be null', () => {
    expect(packages.datasetIdentifier).toBe(null)
  })

  test('packages should be set to empty object', () => {
    packages.packages.should.eql({})
  })

  describe('when calling clearPackages', () => {
    beforeEach(() => {
      packages.packages = { test: 'test' }
      packages.error = 'error'
      packages.clearPackages()
    })

    test('packages should be set to empty object', () => {
      packages.packages.should.eql({})
    })

    test('error should be set to null', () => {
      expect(packages.error).toBe(null)
    })
  })

  describe('when calling reset', () => {
    beforeEach(() => {
      packages.datasetIdentifier = 'identifier'
      packages.initialPollInterval = 2
      packages.pollInterval = 10
      packages.pollTimeout = 2
      packages.pollMultiplier = 3
      packages.reset()
    })

    test('should set datasetIdentifier to null', () => {
      expect(packages.datasetIdentifier).toBe(null)
    })

    test('should set packages to empty object', () => {
      packages.packages.should.eql({})
    })

    test('should set error to null', () => {
      expect(packages.error).toBe(null)
    })

    test('should set pollInterval to 1', () => {
      packages.pollInterval.should.eql(1e3)
    })

    test('should set initialPollInterval to 1', () => {
      packages.initialPollInterval.should.eql(1e3)
    })

    test('should set pollMultiplier to 1.2', () => {
      packages.pollMultiplier.should.eql(1.2)
    })

    test('should set pollTimeout to null', () => {
      expect(packages.pollTimeout).toBe(null)
    })
  })

  describe('when calling setPollInterval', () => {
    const interval = 3
    beforeEach(() => {
      packages.setPollInterval(interval)
    })

    test('should set pollInterval', () => {
      packages.pollInterval.should.eql(interval)
    })

    test('should set initialPollInterval', () => {
      packages.initialPollInterval.should.eql(interval)
    })
  })

  describe('when calling get', () => {
    let result
    const key = 'test'
    const value = 'test'
    beforeEach(() => {
      packages.packages = { [key]: value }
      result = packages.get(key)
    })

    test('should return correct value according to given key', () => {
      result.should.eql(value)
    })
  })

  describe('when calling clearPollTimeout', () => {
    const pollTimeout = 'timeout'
    const clearTimeout = jest.spyOn(global, 'clearTimeout')

    beforeEach(() => {
      packages.pollTimeout = pollTimeout
      packages.clearPollTimeout()
    })

    afterEach(() => {
      clearTimeout.mockClear()
    })

    test('should call clearTimeout', () => {
      expect(clearTimeout).toHaveBeenCalledWith(pollTimeout)
    })

    test('should set pollTimeout to null', () => {
      expect(packages.pollTimeout).toBe(null)
    })
  })

  describe('when calling setPollTimeout', () => {
    const timeoutFunction = () => {}
    const pollInterval = 1
    const setTimeout = jest.spyOn(global, 'setTimeout')
    const pollTimeout = 'timeout'

    beforeEach(() => {
      packages.pollTimeout = pollTimeout
      packages.clearPollTimeout()
    })

    afterEach(() => {
      setTimeout.mockClear()
    })

    beforeEach(() => {
      packages.pollInterval = pollInterval
      packages.setPollTimeout(timeoutFunction)
    })

    test('should call setTimeout with timeoutFunction and pollInterval', () => {
      expect(setTimeout).toHaveBeenCalledWith(timeoutFunction, pollInterval)
    })
  })

  describe('given package with scope, when calling updatePackage', () => {
    const path = 'test'
    const pack = { scope: [1], status: true }
    const expectedPackages = { test: pack }
    beforeEach(() => {
      packages.updatePackage(path, pack)
    })

    test('should add package into packages', () => {
      packages.packages.should.eql(expectedPackages)
    })
  })

  describe('given package with scope of two elements, when calling updatePackage', () => {
    const path = 'test'
    const pack = { scope: [1, 2], test: 'something' }
    const expectedPackages = {}

    beforeEach(() => {
      packages.updatePackage(path, pack)
    })

    test('should not add packages', () => {
      packages.packages.should.eql(expectedPackages)
    })
  })

  describe('given populated array as parameter, when calling updatePartials', () => {
    const partial = [{ scope: ['test'], status: 'status', foo: 'bar' }]
    const expectedPackages = { test: partial[0] }
    beforeEach(() => {
      packages.updatePartials(partial)
    })

    test('should add package into packages', () => {
      packages.packages.should.eql(expectedPackages)
    })
  })

  describe('given undefined as parameter, when calling updatePartials', () => {
    const partial = undefined
    const expectedPackages = {}
    beforeEach(() => {
      packages.updatePartials(partial)
    })

    test('should add package into packages', () => {
      packages.packages.should.eql(expectedPackages)
    })
  })

  // testing updatePartials and updatePackage is done separately
  describe('when calling createPackage', () => {
    const params = { test: 'test' }
    const response = { data: {} }

    beforeEach(async () => {
      axios.post.mockReturnValueOnce(response)
      await packages.createPackage(params)
    })

    test('should call axios.post with correct url and params', () => {
      expect(axios.post).toHaveBeenCalledWith(urls.dl.packages(), params, {"signal": expect.any(AbortSignal)})
    })
  })

  describe("given path '/', when calling createPackageFromPath", () => {
    const path = '/'
    const datasetIdentifier = 'identifier'
    const expectedParams = { cr_id: datasetIdentifier }
    beforeEach(() => {
      axios.post.mockReturnValueOnce({ data: {} })
      packages.datasetIdentifier = datasetIdentifier
      packages.createPackageFromPath(path)
    })

    test('should eventially call axios.post with expectedParams', () => {
      expect(axios.post).toHaveBeenCalledWith(urls.dl.packages(), expectedParams, {"signal": expect.any(AbortSignal)})
    })
  })

  describe("given path 'test', when calling createPackageFromPath", () => {
    const path = 'test'
    const datasetIdentifier = 'identifier'
    const expectedParams = { cr_id: datasetIdentifier, scope: [path] }
    beforeEach(() => {
      axios.post.mockReturnValueOnce({ data: {} })
      packages.datasetIdentifier = datasetIdentifier
      packages.createPackageFromPath(path)
    })

    test('should eventially call axios.post with expectedParams', () => {
      expect(axios.post).toHaveBeenCalledWith(urls.dl.packages(), expectedParams, {"signal": expect.any(AbortSignal)})
    })
  })

  describe('when calling setLoadingDataset', () => {
    const loadingDataset = true
    beforeEach(() => {
      packages.setLoadingDataset(loadingDataset)
    })

    test('should set loadingDataset', () => {
      packages.loadingDataset.should.be.true
    })
  })

  describe('when calling setError', () => {
    const error = 'error'
    beforeEach(() => {
      packages.setError(error)
    })

    test('should set error', () => {
      packages.error.should.be.string(error)
    })
  })

  describe('when calling fetch', () => {
    const datasetIdentifier = 'identifier'
    const partial = [
      {
        scope: ['test'],
        status: 'status',
        foo: 'bar',
        status: DOWNLOAD_API_REQUEST_STATUS.PENDING,
      },
    ]
    const expectedPackage = { '/': { full: 'full' }, test: partial[0] }
    const response = {
      data: { full: 'full', partial },
    }
    beforeEach(async () => {
      axios.get.mockReturnValueOnce(response)
      await packages.fetch(datasetIdentifier)
    })

    test('should call axios.get', () => {
      expect(axios.get).toHaveBeenCalledWith('/api/download/requests?cr_id=identifier', {"signal": expect.any(AbortSignal)})
    })

    test('should set datasetIdentifier', () => {
      packages.datasetIdentifier.should.be.string(datasetIdentifier)
    })

    test('should populate packages array with full and partial packages', () => {
      packages.packages.should.eql(expectedPackage)
    })

    test('should schedule poll, (proven by setTimeout check)', () => {
      expect(setTimeout).toHaveBeenCalledTimes(1)
    })
  })

  describe('when calling packageIsTooLarge', () => {
    test('should allow directory', () => {
      const okDirectory = {
        type: 'directory',
        existingByteSize: packages.sizeLimit,
      }
      packages.packageIsTooLarge({}, okDirectory).should.be.false
    })

    test('should disallow too large directory', () => {
      const tooLargeDirectory = {
        type: 'directory',
        existingByteSize: packages.sizeLimit + 1,
      }
      packages.packageIsTooLarge({}, tooLargeDirectory).should.be.true
    })

    test('should allow entire dataset', () => {
      const okDatasetFiles = {
        root: {
          existingByteSize: packages.sizeLimit,
        },
      }
      packages.packageIsTooLarge(okDatasetFiles).should.be.false
    })

    test('should disallow too large dataset', () => {
      const tooLargeDatasetFiles = {
        root: {
          existingByteSize: packages.sizeLimit + 1,
        },
      }
      packages.packageIsTooLarge(tooLargeDatasetFiles).should.be.true
    })

    test('should allow large file', () => {
      const largeFile = {
        type: 'file',
        existingByteSize: packages.sizeLimit + 1,
      }
      packages.packageIsTooLarge({}, largeFile).should.be.false
    })
  })
})
