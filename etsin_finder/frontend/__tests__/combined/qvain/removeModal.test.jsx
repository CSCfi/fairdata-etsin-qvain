import React from 'react'
import { shallow } from 'enzyme'
import axios from 'axios'

import '../../../locale/translations.js'
import { RemoveModal as RemoveModalBase } from '../../../js/components/qvain/views/datasets/removeModal'
import QvainStoreClass from '../../../js/stores/view/qvain'
import LocaleStore from '../../../js/stores/view/locale'
import EnvStore from '../../../js/stores/domain/env'

jest.mock('axios')

const mockEnv = EnvStore
const mockStores = new QvainStoreClass(mockEnv)
const mockLocale = LocaleStore

jest.mock('../../../js/stores/stores', () => {
  const getStores = () => {
    mockStores.resetQvainStore()
    mockEnv.Flags.setFlag('METAX_API_V2', true)
    return {
      Qvain: mockStores,
      Env: mockEnv,
      Locale: mockLocale,
    }
  }

  return {
    ...jest.requireActual('../../../js/stores/stores'),
    useStores: getStores,
  }
})

describe('Qvain.RemoveModal', () => {
  let wrapper, stores
  const postRemoveUpdate = jest.fn()
  const onClose = jest.fn()

  beforeEach(() => {
    axios.delete.mockReset()
    wrapper = shallow(
      <RemoveModalBase postRemoveUpdate={postRemoveUpdate} onClose={onClose} location={{}} />
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
    expect(axios.delete.mock.calls).toEqual([['/api/v2/qvain/datasets/1']])
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
    expect(axios.delete.mock.calls).toEqual([['/api/v2/qvain/datasets/2']])
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
    expect(axios.delete.mock.calls).toEqual([
      ['/api/v2/qvain/datasets/2'],
      ['/api/v2/qvain/datasets/1'],
    ])
  })
})
