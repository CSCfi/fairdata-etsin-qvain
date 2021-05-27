import React from 'react'
import axios from 'axios'
import { mount } from 'enzyme'
import ReactModal from 'react-modal'
import { BrowserRouter } from 'react-router-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ThemeProvider } from 'styled-components'
import Translate from 'react-translate-component'

expect.extend(toHaveNoViolations)

import { buildStores } from '../../../../js/stores'
import '../../../../locale/translations'
import FilePicker from '../../../../js/components/qvain/fields/files/ida'
import AddItemsModal from '../../../../js/components/qvain/fields/files/ida/addItems'
import UserMetadataModal from '../../../../js/components/qvain/fields/files/ida/forms/formModal'
import PASModal from '../../../../js/components/qvain/fields/files/metadataModal'
import etsinTheme from '../../../../js/styles/theme'
import urls from '../../../../js/utils/urls'

import { get } from '../../../__testdata__/qvain.files.data'
import { StoresProvider, useStores } from '../../../../js/stores/stores'
import Modal from '../../../../js/components/general/modal'
import SelectedItemsTreeItem from '../../../../js/components/qvain/fields/files/ida/selectedItemsTreeItem'


global.Promise = require('bluebird')

const stores = buildStores()

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

stores.Auth = {
  user: { idaProjects: ['project-identifier'] },
}

const datasetIdentifier = '6d2cb5f5-4867-47f7-9874-09357f2901a3'

const { Qvain } = stores
const { Files } = Qvain

const loadDataset = async () => {
  const response = await axios.get(urls.qvain.dataset(datasetIdentifier))
  Qvain.Files.AddItemsView.setDefaultShowLimit(20, 20)
  Qvain.Files.SelectedItemsView.setDefaultShowLimit(20, 20)
  const promise = stores.Qvain.editDataset(response.data)
  Files.SelectedItemsView.setHideRemoved(true)
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
    await Files.loadAllDirectories()

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <FilePicker />
              <PASModal />
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
      await Files.SelectedItemsView.setAllOpen(true)
      wrapper.update()
      const results = await axe(wrapper.getDOMNode())
      expect(results).toHaveNoViolations()
    })
  })

  const getSelectedTreeItem = async name => {
    await Files.SelectedItemsView.setAllOpen(true)
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
      expect(results).toHaveNoViolations()
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
        .filterWhere(i => i.prop('content') === 'qvain.files.metadataModal.buttons.show')
        .find('button')
        .simulate('click')

      modal = wrapper.find(PASModal).find(Modal)
    })

    it('is open', async () => {
      expect(modal.prop('isOpen')).toBe(true)
    })

    it('is accessible', async () => {
      const results = await axe(modal.getDOMNode())
      expect(results).toHaveNoViolations()
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
      expect(results).toHaveNoViolations()
    })
  })

  describe('Add items modal', () => {
    let modal
    beforeAll(async () => {
      await render()
      wrapper.find('button#show-add-items').simulate('click')
      await Files.AddItemsView.setAllOpen(true)
      wrapper.update()
      modal = wrapper.find(AddItemsModal).find(Modal)
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
