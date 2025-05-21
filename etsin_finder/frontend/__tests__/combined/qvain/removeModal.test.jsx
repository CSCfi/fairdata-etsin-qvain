import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import ReactModal from 'react-modal'

import { contextRenderer } from '@/../__tests__/test-helpers'
import { RemoveModal as RemoveModalBase } from '../../../js/components/qvain/views/datasetsV2/removeModal'
import { buildStores } from '../../../js/stores'

jest.mock('axios')

const helper = document.createElement('div')
document.body.appendChild(helper)
ReactModal.setAppElement(helper)

describe('Qvain.RemoveModal', () => {
  let stores

  beforeEach(() => {
    stores = buildStores()
    axios.delete.mockReset()
  })

  const renderModal = () => {
    contextRenderer(<RemoveModalBase />, { stores })
  }

  describe('given dataset with no changes', () => {
    let modalData

    it('deletes dataset', async () => {
      modalData = {
        dataset: {
          identifier: 1,
        },
        onlyChanges: false,
        postRemoveCallback: jest.fn(),
      }
      stores.QvainDatasets.removeModal.open(modalData)
      renderModal()

      await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
      expect(axios.delete.mock.calls).toEqual([['/api/qvain/datasets/1']])
      expect(modalData.postRemoveCallback.mock.calls).toHaveLength(1)
    })
  })

  describe('given onlyChanges with changed dataset', () => {
    let modalData

    it('deletes changes', async () => {
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
      renderModal()

      await userEvent.click(screen.getByRole('button', { name: 'Revert' }))
      expect(axios.delete.mock.calls).toEqual([['/api/qvain/datasets/2']])
      expect(modalData.postRemoveCallback.mock.calls).toHaveLength(1)
    })
  })

  describe('given onlyChanges with unchanged dataset', () => {
    let modalData

    it('does not delete anything', async () => {
      modalData = {
        dataset: {
          identifier: 1,
        },
        onlyChanges: true,
        postRemoveCallback: jest.fn(),
      }
      stores.QvainDatasets.removeModal.open(modalData)
      renderModal()

      await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
      expect(modalData.postRemoveCallback.mock.calls).toHaveLength(0)
    })
  })

  describe('given changed dataset', () => {
    let modalData

    it('deletes unpublished changes before deleting dataset', async () => {
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
      renderModal()

      await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

      expect(axios.delete.mock.calls).toEqual([
        ['/api/qvain/datasets/2'],
        ['/api/qvain/datasets/1'],
      ])
      expect(modalData.postRemoveCallback.mock.calls).toHaveLength(1)
    })
  })
})
