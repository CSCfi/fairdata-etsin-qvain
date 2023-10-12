import React from 'react'
import axios from 'axios'
import { mount } from 'enzyme'
import ReactModal from 'react-modal'
import { BrowserRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { ThemeProvider } from 'styled-components'
import { makeAutoObservable } from 'mobx'

import { buildStores } from '../../../../js/stores'
import IdaResources from '../../../../js/components/dataset/data/idaResources/index'
import FileTreeItem from '../../../../js/components/dataset/data/idaResources/fileTreeItem'
import '../../../../locale/translations'
import PackageModal from '../../../../js/components/dataset/data/idaResources/packageModal'
import etsinTheme from '../../../../js/styles/theme'
import { get } from '../../../__testdata__/qvain.files.data'
import dataset from '../../../__testdata__/dataset.ida'
import { StoresProvider, useStores } from '../../../../js/stores/stores'
import { EtsinFilesV2 as FilesClass } from '../../../../js/stores/view/etsin/etsin.files'
import Modal from '../../../../js/components/general/modal'
import { DownloadButton } from '../../../../js/components/dataset/data/idaResources/fileTreeItem'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

failTestsWhenTranslationIsMissing()

jest.setTimeout(25000) // the default 5000ms timeout is not always enough here

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

  packageIsTooLarge = () => false
}

const getStores = () => {
  let stores = buildStores()
  stores.Env.Flags.setFlag('DOWNLOAD_API_V2', true)
  stores = {
    ...stores,
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
      expect(results).toBeAccessible()
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
      expect(results).toBeAccessible()
    })
  })
})
