import React from 'react'
import { shallow } from 'enzyme'
import axios from 'axios'

import '../locale/translations.js'
import RemoveModal from '../js/components/qvain/datasets/removeModal'
import QvainStore from '../js/stores/view/qvain'
import LocaleStore from '../js/stores/view/language'

jest.mock('axios')

const getStores = () => {
  QvainStore.resetQvainStore()
  QvainStore.setMetaxApiV2(true)
  return {
    Qvain: QvainStore,
    Locale: LocaleStore,
  }
}

const RemoveModalBase = RemoveModal.WrappedComponent.wrappedComponent

describe('Qvain.RemoveModal', () => {
  let wrapper, stores
  const postRemoveUpdate = jest.fn()
  const onClose = jest.fn()

  beforeEach(() => {
    axios.delete.mockReset()
    stores = getStores()
    wrapper = shallow(
      <RemoveModalBase
        postRemoveUpdate={postRemoveUpdate}
        onClose={onClose}
        Stores={stores}
        location={{}}
      />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('deletes dataset', async () => {
    wrapper.setProps({
      dataset: {
        identifier: 1,
      },
      onlyChanges: false,
    })
    wrapper.update()
    wrapper.find('#confirm-remove-dataset').simulate('click')
    await Promise.resolve()
    expect(axios.delete.mock.calls).toEqual([['/api/v2/dataset/1']])
  })

  it('deletes unpublished changes', async () => {
    wrapper.setProps({
      dataset: {
        identifier: 1,
        next_draft: {
          identifier: 2,
        },
      },
      onlyChanges: true,
    })
    wrapper.update()
    wrapper.find('#confirm-remove-dataset').simulate('click')
    await Promise.resolve()
    expect(axios.delete.mock.calls).toEqual([['/api/v2/dataset/2']])
  })

  it('has no changes to delete', async () => {
    wrapper.setProps({
      dataset: {
        identifier: 1,
      },
      onlyChanges: true,
    })
    wrapper.update()
    wrapper.find('#confirm-remove-dataset').simulate('click')
    await Promise.resolve()
    expect(axios.delete.mock.calls).toEqual([])
  })

  it('deletes unpublished changes before deleting dataset', async () => {
    wrapper.setProps({
      dataset: {
        identifier: 1,
        next_draft: {
          identifier: 2,
        },
      },
      onlyChanges: false,
    })
    wrapper.update()
    wrapper.find('#confirm-remove-dataset').simulate('click')
    await Promise.resolve()
    expect(axios.delete.mock.calls).toEqual([['/api/v2/dataset/2'], ['/api/v2/dataset/1']])
  })
})
