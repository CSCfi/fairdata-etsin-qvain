import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { shallow, mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import ReactModal from 'react-modal'

import { buildStores } from '../../../js/stores'
import Packages from '../../../js/stores/view/packages'
import { StoresProvider, useStores } from '../../../js/stores/stores'
import { DOWNLOAD_API_REQUEST_STATUS } from '../../../js/utils/constants'
import { fakeDownload, applyMockAdapter } from '../../__testdata__/download.data'
import etsinTheme from '../../../js/styles/theme'
import PackageModal from '../../../js/components/dataset/data/idaResources/packageModal'
import PackageCreate from '../../../js/components/dataset/data/idaResources/packageModal/packageCreate'
import PackagePending from '../../../js/components/dataset/data/idaResources/packageModal/packagePending'
import PackageSuccess from '../../../js/components/dataset/data/idaResources/packageModal/packageSuccess'
import {
  CreatePackageButton,
  SubmitEmailButton,
} from '../../../js/components/dataset/data/idaResources/packageModal/common'

jest.mock('../../../js/components/dataset/data/idaResources/download', () => {
  const actual = jest.requireActual('../../../js/components/dataset/data/idaResources/download')
  return {
    ...actual,
    downloadFile: jest.fn().mockImplementation(actual.downloadFile),
    downloadPackage: jest.fn().mockImplementation(actual.downloadPackage),
  }
})

jest.mock('../../../js/stores/stores', () => {
  const useStores = jest.fn()

  return {
    ...jest.requireActual('../../../js/stores/stores'),
    useStores,
  }
})

const mockAdapter = new MockAdapter(axios)
applyMockAdapter(mockAdapter)

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
    const stores = buildStores()
    stores.Env.Flags.setFlag('DOWNLOAD_API_V2.EMAIL.FRONTEND', true)
    stores.Env.Flags.setFlag('DOWNLOAD_API_V2.EMAIL.BACKEND', true)
    stores.Env.Flags.setFlag('DOWNLOAD_API_V2.OPTIONS', true)
    stores.Env.Flags.setFlag('DOWNLOAD_API_V2.STATUS_CHECK', true)
    const packages = new Packages(stores.Env)
    return { ...stores, Packages: packages }
  }

  beforeEach(() => {
    applyMockAdapter(mockAdapter)
    fakeDownload.reset()
  })

  afterEach(() => {
    if (console.error.mockReset) {
      console.error.mockReset()
    }
    cleanup()
    mockAdapter.reset()
  })

  describe('Create package', () => {
    it('should render PackageCreate', async () => {
      const stores = getStores()
      stores.Packages.openPackageModal('/data')
      render(stores)
      wrapper.find(PackageCreate).should.have.lengthOf(1)
    })

    it('should render 2 buttons', async () => {
      const stores = getStores()
      stores.Packages.openPackageModal('/data')
      render(stores)
      wrapper.find(PackageCreate).find('button').should.have.lengthOf(2)
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
      wrapper.find(PackagePending).should.have.lengthOf(1)
    })

    it('should render 2 buttons', async () => {
      const stores = await openPending()
      render(stores)
      wrapper.find(PackagePending).find('button').should.have.lengthOf(2)
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
      wrapper.find(PackageSuccess).should.have.lengthOf(1)
    })

    it('should render only close button', async () => {
      const stores = await openCreated()
      render(stores)
      wrapper.find(PackageSuccess).find('button').should.have.lengthOf(1)
    })
  })
})
