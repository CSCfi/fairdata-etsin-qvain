import React from 'react'
import axios from 'axios'
import { mount } from 'enzyme'
import ReactModal from 'react-modal'
import { BrowserRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { ThemeProvider } from 'styled-components'
import Translate from 'react-translate-component'

import { buildStores } from '@/stores'
import '@/../locale/translations'
import FilePicker from '@/components/qvain/sections/DataOrigin/general/FilePicker'
import AddItemsModal from '@/components/qvain/sections/DataOrigin/general/FilePicker/addItems'
import UserMetadataModal from '@/components/qvain/sections/DataOrigin/general/FilePicker/forms/formModal'
import SelectedItemsTreeItem from '@/components/qvain/sections/DataOrigin/general/FilePicker/selectedItemsTreeItem'
import MetadataModal from '@/components/qvain/sections/DataOrigin/general/MetadataModal'
import etsinTheme from '@/styles/theme'
import urls from '@/utils/urls'

import { get } from '../../../__testdata__/qvain.files.data'
import { StoresProvider, useStores } from '@/stores/stores'
import Modal from '@/components/general/modal'
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

const stores = buildStores()
stores.Auth.user.idaProjects = ['project', 'project-identifier']

const datasetIdentifier = '6d2cb5f5-4867-47f7-9874-09357f2901a3'

const { Qvain } = stores

const loadDataset = async () => {
  const response = await axios.get(urls.qvain.dataset(datasetIdentifier))
  Qvain.Files.AddItemsView.setDefaultShowLimit(20, 20)
  Qvain.Files.SelectedItemsView.setDefaultShowLimit(20, 20)
  const promise = Qvain.editDataset(response.data)
  Qvain.Files.SelectedItemsView.setHideRemoved(true)
  await promise
}

useStores.mockReturnValue(stores)

describe('Qvain filepicker', () => {
  let helper, wrapper

  const cleanup = () => {
    wrapper?.unmount?.()
    wrapper = null
    if (helper) {
      document.body.removeChild(helper)
      helper = null
    }
    Qvain.resetQvainStore()
  }

  const render = async () => {
    cleanup()
    await loadDataset()
    await Qvain.Files.loadAllDirectories()

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <FilePicker />
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
      await Qvain.Files.SelectedItemsView.setAllOpen(true)
      wrapper.update()
      const results = await axe(wrapper.getDOMNode())
      expect(results).toBeAccessible()
    })
  })

  const getSelectedTreeItem = async name => {
    await Qvain.Files.SelectedItemsView.setAllOpen(true)
    wrapper.update()
    return wrapper.find(SelectedItemsTreeItem).filterWhere(i => i.prop('item').name === name)
  }

  describe('Edit file user metadata modal', () => {
    let modal
    beforeAll(async () => {
      await render()
      const file2 = await getSelectedTreeItem('file2.csv')
      file2.find('button').first().simulate('click')
      file2
        .find(Translate)
        .filterWhere(i => i.prop('content') === 'qvain.files.selected.addUserMetadata')
        .find('button')
        .simulate('click')

      modal = wrapper.find(UserMetadataModal).find(Modal)
    })

    it('is open', async () => {
      expect(modal.prop('isOpen')).toBe(true)
    })

    it('is accessible', async () => {
      const results = await axe(modal.getDOMNode())
      expect(results).toBeAccessible()
    })
  })

  describe('Edit file PAS metadata modal', () => {
    let modal
    beforeAll(async () => {
      await render()
      const file2 = await getSelectedTreeItem('file2.csv')
      file2.find('button').first().simulate('click')
      file2
        .find(Translate)
        .filterWhere(i => i.prop('content') === 'qvain.files.metadataModal.buttons.add')
        .find('button')
        .simulate('click')

      modal = wrapper.find(MetadataModal).find(Modal)
    })

    it('is open', async () => {
      expect(modal.prop('isOpen')).toBe(true)
    })

    it('is accessible', async () => {
      const results = await axe(modal.getDOMNode())
      expect(results).toBeAccessible()
    })
  })

  describe('Edit directory user metadata modal', () => {
    let modal
    beforeAll(async () => {
      await render()
      wrapper.update()

      const data = await getSelectedTreeItem('data')
      data.find('button').first().simulate('click')
      data
        .find(Translate)
        .filterWhere(i => i.prop('content') === 'qvain.files.selected.addUserMetadata')
        .find('button')
        .simulate('click')

      modal = wrapper.find(UserMetadataModal).find(Modal)
    })

    it('is open', async () => {
      expect(modal.prop('isOpen')).toBe(true)
    })

    it('is accessible', async () => {
      const results = await axe(modal.getDOMNode())
      expect(results).toBeAccessible()
    })
  })

  describe('Add items modal', () => {
    let modal
    beforeAll(async () => {
      await render()
      wrapper.find('button[aria-label="Add"]').simulate('click')
      await Qvain.Files.AddItemsView.setAllOpen(true)
      wrapper.update()
      modal = wrapper.find(AddItemsModal).find(Modal)
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
