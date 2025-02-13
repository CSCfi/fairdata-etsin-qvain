import React from 'react'
import { shallow } from 'enzyme'
import axios from 'axios'

import { RemoveModal as RemoveModalBase } from '../../../js/components/qvain/views/datasetsV2/removeModal'
import { useStores } from '../../../js/stores/stores'
import { buildStores } from '../../../js/stores'

jest.mock('axios')
jest.mock('../../../js/stores/stores')

describe('Qvain.RemoveModal', () => {
  let wrapper, stores

  beforeEach(() => {
    stores = buildStores()
    useStores.mockReturnValue(stores)
    axios.delete.mockReset()
  })

  const render = () => {
    wrapper = shallow(<RemoveModalBase />)
  }

  afterEach(() => {
    wrapper.unmount()
  })

  describe('given dataset with no changes', () => {
    let modalData

    beforeEach(async () => {
      modalData = {
        dataset: {
          identifier: 1,
        },
        onlyChanges: false,
        postRemoveCallback: jest.fn(),
      }
      stores.QvainDatasets.removeModal.open(modalData)
      render()
      wrapper.find('#confirm-remove-dataset').simulate('click')
      await Promise.resolve()
      render()
    })

    it('deletes dataset', async () => {
      expect(axios.delete.mock.calls).toEqual([['/api/qvain/datasets/1']])
    })

    it('calls postRemoveCallback', async () => {
      expect(modalData.postRemoveCallback.mock.calls).toEqual([[]])
    })
  })

  describe('given onlyChanges with changed dataset', () => {
    let modalData

    beforeEach(async () => {
      modalData = {
        dataset: {
          identifier: 1,
          next_draft: {
            identifier: 2,
          },
        },
        onlyChanges: true,
        postRemoveCallback: jest.fn(),
      }
      stores.QvainDatasets.removeModal.open(modalData)
      render()
      wrapper.find('#confirm-remove-dataset').simulate('click')
      await Promise.resolve()
      render()
    })

    it('deletes changes', async () => {
      expect(axios.delete.mock.calls).toEqual([['/api/qvain/datasets/2']])
    })

    it('calls postRemoveCallback', async () => {
      expect(modalData.postRemoveCallback.mock.calls).toEqual([[]])
    })
  })

  describe('given onlyChanges with unchanged dataset', () => {
    let modalData

    beforeEach(async () => {
      modalData = {
        dataset: {
          identifier: 1,
        },
        onlyChanges: true,
        postRemoveCallback: jest.fn(),
      }
      stores.QvainDatasets.removeModal.open(modalData)
      render()
      wrapper.find('#confirm-remove-dataset').simulate('click')
      await Promise.resolve()
      render()
    })

    it('does not delete anything', async () => {
      expect(axios.delete.mock.calls).toEqual([])
    })

    it('does not call postRemoveCallback', async () => {
      expect(modalData.postRemoveCallback.mock.calls).toEqual([])
    })
  })

  describe('given changed dataset', () => {
    let modalData

    beforeEach(async () => {
      modalData = {
        dataset: {
          identifier: 1,
          next_draft: {
            identifier: 2,
          },
        },
        onlyChanges: false,
        postRemoveCallback: jest.fn(),
      }
      stores.QvainDatasets.removeModal.open(modalData)
      render()
      wrapper.find('#confirm-remove-dataset').simulate('click')
      await Promise.resolve()
      render()
    })

    it('deletes unpublished changes before deleting dataset', async () => {
      expect(axios.delete.mock.calls).toEqual([
        ['/api/qvain/datasets/2'],
        ['/api/qvain/datasets/1'],
      ])
    })

    it('calls postRemoveCallback', async () => {
      expect(modalData.postRemoveCallback.mock.calls).toEqual([[]])
    })
  })
})
