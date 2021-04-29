import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { shallow, mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import ReactModal from 'react-modal'

import 'chai/register-should'

import { StoresProvider, useStores } from '../../../js/stores/stores'
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
import etsinTheme from '../../../js/styles/theme'
import PackageModal from '../../../js/components/dataset/data/idaResourcesV2/packageModal'
import PackageCreate from '../../../js/components/dataset/data/idaResourcesV2/packageModal/packageCreate'
import PackagePending from '../../../js/components/dataset/data/idaResourcesV2/packageModal/packagePending'
import PackageSuccess from '../../../js/components/dataset/data/idaResourcesV2/packageModal/packageSuccess'
import {
  CreatePackageButton,
  SubmitEmailButton,
} from '../../../js/components/dataset/data/idaResourcesV2/packageModal/common'

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

jest.mock('../../../js/stores/stores', () => {
  const useStores = jest.fn()

  return {
    ...jest.requireActual('../../../js/stores/stores'),
    useStores,
  }
})

const { PENDING, STARTED, SUCCESS } = DOWNLOAD_API_REQUEST_STATUS

Env.Flags.setFlag('DOWNLOAD_API_V2', true)
const mockAdapter = new MockAdapter(axios)
applyMockAdapter(mockAdapter)

// Wait until ms milliseconds have passed and execute all pending promises
const wait = async ms => {
  jest.advanceTimersByTime(ms)
  await new Promise(setImmediate)
}

describe('PackageModal', () => {
  let wrapper
  let helper

  const cleanup = () => {
    wrapper?.unmount?.()
    wrapper = null
    if (helper) {
      document.body.removeChild(helper)
      helper = null
    }
  }

  const render = async stores => {
    cleanup()

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    useStores.mockReturnValue(stores)
    wrapper = mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <PackageModal Packages={stores.Packages} />
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )
  }

  const getStores = () => {
    const packages = new Packages(Env)
    return {
      Env,
      Packages: packages,
    }
  }

  beforeEach(() => {
    applyMockAdapter(mockAdapter)
    fakeDownload.reset()
    mockAdapter.resetHistory()
  })

  afterEach(() => {
    if (console.error.mockReset) {
      console.error.mockReset()
    }
    cleanup()
  })

  describe('Create package', () => {
    it('should render PackageCreate', async () => {
      const stores = getStores()
      stores.Packages.openPackageModal('/data')
      render(stores)
      wrapper.find(PackageCreate).should.exist
    })

    it('should render 2 buttons', async () => {
      const stores = getStores()
      stores.Packages.openPackageModal('/data')
      render(stores)
      wrapper.find(PackageCreate).find('button').length.should.eql(2)
    })

    it('should create package', async () => {
      const stores = getStores()
      stores.Packages.openPackageModal('/data')
      render(stores)
      wrapper.find(CreatePackageButton).simulate('click')
      stores.Packages.get('/data').requestingPackageCreation.should.true
    })
  })

  describe('Pending package', () => {
    const openPending = async () => {
      fakeDownload.setProcessingDelay(5000, 5000)
      fakeDownload.createPackage(1, '/data')
      const stores = getStores()
      await stores.Packages.fetch(1)
      stores.Packages.openPackageModal('/data')
      return stores
    }

    it('should render PackagePending', async () => {
      const stores = await openPending()
      render(stores)
      wrapper.find(PackagePending).should.exist
    })

    it('should render 2 buttons', async () => {
      const stores = await openPending()
      render(stores)
      wrapper.find(PackagePending).find('button').length.should.eql(2)
    })

    it('should subscribe to email notification', async () => {
      const stores = await openPending()
      stores.Packages.Notifications.setEmail('email@example.org')
      render(stores)
      wrapper.find(SubmitEmailButton).simulate('click')
      await Promise.resolve()
      expect(fakeDownload.subscriptionsByDataset[1]['/data']).toEqual(['email@example.org'])
    })
  })

  describe('Created package', () => {
    const openCreated = async () => {
      fakeDownload.createPackage(1, '/data')
      const stores = getStores()
      await stores.Packages.fetch(1)
      stores.Packages.openPackageModal('/data')
      return stores
    }

    it('should render PackageSuccess', async () => {
      const stores = await openCreated()
      render(stores)
      wrapper.find(PackageSuccess).should.exist
    })

    it('should render only close button', async () => {
      const stores = await openCreated()
      render(stores)
      wrapper.find(PackageSuccess).find('button').length.should.eql(1)
    })
  })
})
