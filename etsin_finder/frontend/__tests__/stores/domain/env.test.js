import { RouterStore } from '@/utils/RouterStore'
import axios from 'axios'

import EnvClass from '../../../js/stores/domain/env'
import { getCookieValue } from '../../../js/utils/cookies'

const defaultCookieValue = 'etsin'
const qvainCookieValue = 'qvain'

jest.mock('../../../js/stores/domain/env.flags', () => {
  return function () {
    return {
      flagEnabled: jest.fn(),
      setFlags: jest.fn(),
      validateFlags: jest.fn(),
    }
  }
})

jest.mock('../../../js/utils/cookies', () => {
  return {
    getCookieValue: jest.fn(),
  }
})

jest.mock('axios')

describe('Env', () => {
  let Env
  beforeEach(() => {
    getCookieValue.mockReturnValue(defaultCookieValue)
    Env = new EnvClass()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should set etsinHost to empty string', () => {
    Env.etsinHost.should.be.string('')
  })

  test('should set qvainHost to empty string', () => {
    Env.qvainHost.should.be.string('')
  })

  test('should set appconfigLoaded to false', () => {
    Env.appConfigLoaded.should.be.false
  })

  test('should set ssoCookieDomain to empty string', () => {
    Env.ssoCookieDomain.should.be.string('')
  })

  test('should set ssoPrefix to empty string', () => {
    Env.ssoPrefix.should.be.string('')
  })

  test('should set app by calling getCookieValue', () => {
    Env.app.should.be.string(defaultCookieValue)
  })

  test('when accessing computed propery isEtsin, should be true ', () => {
    Env.isEtsin.should.be.true
  })

  test('should set history to new instance of RouterStore', () => {
    expect(Env.history instanceof RouterStore).toBe(true)
  })

  describe('when calling setSSOPrefix', () => {
    const testValue = 'SSOPrefix'

    beforeEach(() => {
      Env.setSSOPrefix(testValue)
    })

    test('should set ssoPrefix with testValue', () => {
      Env.ssoPrefix.should.be.string(testValue)
    })
  })

  describe('when calling setSSoCookieDomain', () => {
    const testValue = 'ssoCookieDomain'

    beforeEach(() => {
      Env.setSSOCookieDomain(testValue)
    })

    test('should set ssoCookieDomain with testValue', () => {
      Env.ssoCookieDomain.should.be.string(testValue)
    })
  })

  describe('when calling setAppConfigLoaded', () => {
    const testValue = true

    beforeEach(() => {
      Env.setAppConfigLoaded(testValue)
    })

    test('should set appConfigLoaded with testValue', () => {
      Env.appConfigLoaded.should.be.true
    })
  })

  describe('when calling setEtsinHost', () => {
    const testValue = 'etsinHost'

    beforeEach(() => {
      Env.setEtsinHost(testValue)
    })

    test('should set etsinHost with testValue', () => {
      Env.etsinHost.should.be.string(testValue)
    })
  })

  describe('when calling setQvainHost', () => {
    const testValue = 'qvainHost'

    beforeEach(() => {
      Env.setQvainHost(testValue)
    })

    test('should set qvainHost with testValue', () => {
      Env.qvainHost.should.be.string(testValue)
    })
  })

  describe("given app is set to 'qvain'", () => {
    beforeEach(() => {
      getCookieValue.mockReturnValue(qvainCookieValue)
      Env = new EnvClass()
    })

    test('when accessing computed property isQvain, should be true', () => {
      Env.isQvain.should.be.true
    })
  })

  describe('given different etsinHost and qvainHost', () => {
    const etsinHost = 'etsinHost'
    const qvainHost = 'qvainHost'
    const path = '/path'

    beforeEach(() => {
      Env.setEtsinHost(etsinHost)
      Env.setQvainHost(qvainHost)
    })

    test('when accessing computed property of separateQvain, should be true', () => {
      Env.separateQvain.should.be.true
    })

    describe("given app set to 'etsin'", () => {
      beforeEach(() => {
        getCookieValue.mockReturnValue(defaultCookieValue)
        Env = new EnvClass()
        Env.setEtsinHost(etsinHost)
        Env.setQvainHost(qvainHost)
      })

      describe('when calling getEtsinHost', () => {
        let result

        beforeEach(() => {
          result = Env.getEtsinUrl(path)
        })
        test('should return path', () => {
          const expectedResult = '/path'
          result.should.be.string(expectedResult)
        })
      })

      describe('when calling getQvainPath', () => {
        let result

        beforeEach(() => {
          result = Env.getQvainUrl(path)
        })

        test('should return parsed url', () => {
          const expectedResult = 'https://qvainHost/path'
          result.should.be.string(expectedResult)
        })
      })
    })

    describe("given app set to 'qvain'", () => {
      beforeEach(() => {
        getCookieValue.mockReturnValue(qvainCookieValue)
        Env = new EnvClass()
        Env.setEtsinHost(etsinHost)
        Env.setQvainHost(qvainHost)
      })

      describe('when calling getEtsinHost', () => {
        let result

        beforeEach(() => {
          result = Env.getEtsinUrl(path)
        })
        test('should return parsed url', () => {
          const expectedResult = 'https://etsinHost/path'
          result.should.be.string(expectedResult)
        })
      })

      describe('when calling getQvainPath', () => {
        let result

        beforeEach(() => {
          result = Env.getQvainUrl(path)
        })

        test('should return path', () => {
          const expectedResult = '/path'
          result.should.be.string(expectedResult)
        })
      })
    })
  })

  describe('when calling fetchAppConfig', () => {
    const etsinHost = 'etsinHost'
    const qvainHost = 'qvainHost'
    const flags = 'flags'

    beforeEach(async () => {
      const appConfigResponse = {
        data: {
          SERVER_ETSIN_DOMAIN_NAME: etsinHost,
          SERVER_QVAIN_DOMAIN_NAME: qvainHost,
          FLAGS: flags,
        },
      }

      Env.Flags.setFlags.mockReturnValue(undefined)
      axios.get.mockReturnValue(appConfigResponse)

      await Env.fetchAppConfig()
    })

    test('should set etsinHost', () => {
      Env.etsinHost.should.be.string(etsinHost)
    })
  })

  describe('when metaxV3 host is defined', () => {
    const testHost = 'metaxHost'
    const testPort = 443
    const expectedUrl = "https://metaxHost:443/v3/datasets/dataset_id"

    beforeEach(() => {
      Env.setMetaxV3Host(testHost, testPort)
    })

    test('should return metaxV3 url for dataset', () => {
      Env.metaxV3Url('dataset', 'dataset_id').should.be.string(expectedUrl)
    })
  })
})
