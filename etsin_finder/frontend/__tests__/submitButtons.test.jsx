import React from 'react'
import { shallow } from 'enzyme'
import axios from 'axios'

import '../locale/translations'
import { CUMULATIVE_STATE } from '../js/utils/constants'
import Env from '../js/stores/domain/env'
import QvainStoreClass from '../js/stores/view/qvain'
import Locale from '../js/stores/view/locale'
import { SubmitButtons as SubmitButtonsBase } from '../js/components/qvain/views/editor/submitButtons'
import {
  metaxDataset,
  dataset,
  fileActions,
  metadataActions,
} from './__testdata__/submitButtons.data'
import { runInAction } from 'mobx'

global.Promise = require('bluebird')

Promise.config({
  cancellation: true,
})

jest.mock('axios')

const Qvain = new QvainStoreClass(Env)
const getMockProps = () => ({
  history: {
    replace: jest.fn(),
    push: jest.fn(),
  },
  submitButtonsRef: React.createRef(),
  handleSubmitResponse: () => {},
  handleSubmitError: jest.fn(),
})

Env.setMetaxApiV2(true)
const stores = {
  Env,
  Qvain,
  Locale,
}

// Helper to keep track of order of calls for multiple mock functions
const calls = []
const logCalls = (name, func) => {
  return (...args) => {
    calls.push([name, ...args])
    return func(...args)
  }
}

describe('Qvain SubmitButtons.patchDataset', () => {
  let patchDataset, handlePublishDataset, props

  beforeEach(() => {
    calls.length = 0
    axios.get.mockReset()
    axios.post.mockReset()
    axios.put.mockReset()
    axios.patch.mockReset()
    axios.get.mockImplementation(logCalls('get', () => ({ data: metaxDataset })))
    axios.patch.mockImplementation(logCalls('patch', v => ({ data: v })))
    axios.put.mockImplementation(logCalls('put', v => ({ data: v })))
    axios.post.mockImplementation(logCalls('post', v => ({ data: v })))
    Qvain.resetQvainStore()

    props = getMockProps()
    const wrapper = shallow(<SubmitButtonsBase Stores={stores} {...props} />)
    patchDataset = wrapper.instance().patchDataset
    handlePublishDataset = wrapper.instance().handlePublishDataset
  })

  it('sends requests in correct order when patching dataset', async () => {
    const values = {
      dataset,
      fileActions,
      metadataActions,
      newCumulativeState: CUMULATIVE_STATE.CLOSED,
    }

    await patchDataset(values)
    expect(calls).toEqual([
      ['patch', '/api/v2/qvain/datasets/12345', dataset],
      ['post', '/api/v2/qvain/datasets/12345/files', fileActions],
      ['put', '/api/v2/common/datasets/12345/user_metadata', metadataActions],
      [
        'post',
        '/api/v2/rpc/datasets/change_cumulative_state',
        { identifier: '12345', cumulative_state: CUMULATIVE_STATE.CLOSED },
      ],
      ['get', '/api/v2/qvain/datasets/12345'],
    ])
  })

  it('avoids calling cumulative state RPC when it is unchanged', async () => {
    const values = {
      dataset,
      newCumulativeState: dataset.cumulativeState,
    }

    await patchDataset(values)
    expect(calls).toEqual([['patch', '/api/v2/qvain/datasets/12345', dataset]])
  })

  it('updates dataset', async () => {
    const values = {
      dataset,
    }

    await patchDataset(values)
    expect(calls).toEqual([['patch', '/api/v2/qvain/datasets/12345', dataset]])
  })

  it('updates files', async () => {
    const values = {
      dataset,
      fileActions,
    }

    await patchDataset(values)
    expect(calls).toEqual([
      ['patch', '/api/v2/qvain/datasets/12345', dataset],
      ['post', '/api/v2/qvain/datasets/12345/files', fileActions],
      ['get', '/api/v2/qvain/datasets/12345'],
    ])
  })

  it('updates user metadata', async () => {
    const values = {
      dataset,
      metadataActions,
    }
    await patchDataset(values)
    expect(calls).toEqual([
      ['patch', '/api/v2/qvain/datasets/12345', dataset],
      ['put', '/api/v2/common/datasets/12345/user_metadata', metadataActions],
      ['get', '/api/v2/qvain/datasets/12345'],
    ])
  })

  it('when deprecated, should call handleSubmitError', async () => {
    runInAction(() => {
      stores.Qvain.deprecated = true
    })
    await handlePublishDataset()
    expect(props.handleSubmitError).toHaveBeenCalledWith(
      new Error(
        'Cannot publish dataset because it is deprecated. Please resolve deprecation first.'
      )
    )
  })
})
