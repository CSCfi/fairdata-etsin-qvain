import React from 'react'
import axios from 'axios'
import { mount } from 'enzyme'
import ReactModal from 'react-modal'
import { BrowserRouter } from 'react-router-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ThemeProvider } from 'styled-components'
import { makeAutoObservable } from 'mobx'

expect.extend(toHaveNoViolations)

import IdaResources from '../../../../js/components/dataset/data/idaResourcesV2/index'
import FileTreeItem from '../../../../js/components/dataset/data/idaResourcesV2/fileTreeItem'
import '../../../../locale/translations'
import PackageModal from '../../../../js/components/dataset/data/idaResourcesV2/packageModal'
import etsinTheme from '../../../../js/styles/theme'
import Env from '../../../../js/stores/domain/env'
import QvainStoreClass from '../../../../js/stores/view/qvain'
import LocaleStore from '../../../../js/stores/view/locale'

import { get } from '../../../__testdata__/qvain.files.data'
import dataset from '../../../__testdata__/dataset.ida'
import { StoresProvider, useStores } from '../../../../js/stores/stores'
import FilesClass from '../../../../js/stores/view/files'
import Modal from '../../../../js/components/general/modal'
import { DownloadButton } from '../../../../js/components/dataset/data/idaResourcesV2/fileTreeItem'

global.Promise = require('bluebird')

Promise.config({
  cancellation: true,
})

jest.mock('axios')

jest.mock('../../../../js/stores/stores', () => {
  const useStores = jest.fn()

  return {
    ...jest.requireActual('../../../../js/stores/stores'),
    useStores,
  }
})

// Mock responses for a dataset containing IDA files. See the data file for the project structure.
axios.get.mockImplementation(get)

const Files = new FilesClass()

const QvainStore = new QvainStoreClass(Env)

class MockPackages {
  constructor() {
    makeAutoObservable(this)
  }

  error = null

  clearError = () => {}

  get = () => ({})

  packageModalPath = null

  openPackageModal = path => {
    this.packageModalPath = path
  }

  confirmModalCallback = null

  closeConfirmModal = () => {}

  Notifications = {
    email: 'email@example.com',
  }
}

const getStores = () => {
  const stores = {
    Env,
    Qvain: QvainStore,
    Locale: LocaleStore,
    Auth: {
      user: { idaProjects: ['project-identifier'] },
    },
    Access: {
      restrictions: {
        allowDataIdaDownloadButton: true,
      },
    },
    DatasetQuery: {
      Files,
      Packages: new MockPackages(),
    },
  }
  return stores
}

beforeAll(async () => {
  await Files.openDataset(dataset)
})

describe('Qvain filepicker', () => {
  let helper, wrapper

  const cleanup = () => {
    wrapper?.unmount?.()
    wrapper = null
    if (helper) {
      document.body.removeChild(helper)
      helper = null
    }
  }

  const render = async () => {
    cleanup()
    await Files.loadAllDirectories()

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    const stores = getStores()
    useStores.mockReturnValue(stores)
    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <IdaResources dataset={dataset} />
            </main>
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>,
      { attachTo: helper }
    )
  }

  afterAll(() => {
    cleanup()
  })

  describe('Selected files', () => {
    it('is accessible', async () => {
      await render()
      await Files.View.setAllOpen(true)
      wrapper.update()
      const results = await axe(wrapper.getDOMNode())
      expect(results).toHaveNoViolations()
    })
  })

  const getItem = async name => {
    await Files.View.setAllOpen(true)
    return wrapper.find(FileTreeItem).filterWhere(i => i.prop('item').name === name)
  }

  describe('Package generation modal', () => {
    let modal
    beforeAll(async () => {
      await render()
      wrapper.update()

      const data = await getItem('data')
      data.find(DownloadButton).find('button').simulate('click')
      modal = wrapper.find(PackageModal).find(Modal)
    })

    it('is open', async () => {
      expect(modal.prop('isOpen')).toBe(true)
    })

    it('is accessible', async () => {
      const results = await axe(modal.getDOMNode())
      expect(results).toHaveNoViolations()
    })
  })
})
