import React, { createRef } from 'react'
import Harness from '../componentTestHarness'
import 'chai/register-expect'
import axios from 'axios'
import { configure } from 'mobx'
import Translate from 'react-translate-component'

import StickyHeader from '../../../js/components/qvain/views/editor/stickyHeader'
import SubmitResponse from '../../../js/components/qvain/views/editor/submitResponse'
import SubmitButtons from '../../../js/components/qvain/views/editor/submitButtons'
import { useStores } from '../../../js/stores/stores'
import { buildStores } from '../../../js/stores'
import { expect } from 'chai'

jest.mock('axios')
axios.get.mockReturnValue(
  Promise.resolve({
    data: {},
  })
)

jest.mock('../../../js/stores/stores', () => {
  return {
    withStores: () => () => <>null</>,
    useStores: jest.fn(),
  }
})

let stores

beforeEach(() => {
  configure({ safeDescriptors: false })
  stores = buildStores()
  configure({ safeDescriptors: true })
  useStores.mockReturnValue(stores)
})

const props = {
  datasetError: false,
  submitButtonsRef: createRef(),
}
const harness = new Harness(StickyHeader, props)

describe('when loading', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    stores.Qvain.Submit.setLoading(true)
    harness.shallow()
  })

  test('should contain loading message', () => {
    const child = {
      findArgs: Translate,
      props: {
        content: 'qvain.titleLoading',
      },
    }
    harness.shouldIncludeChild(child)
  })
})

describe('when loaded', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('SubmitButtons', () => {
    test('should be rendered', () => {
      harness.shallow()
      const child = {
        findArgs: SubmitButtons,
      }
      harness.shouldIncludeChild(child)
    })

    test('should be hidden', () => {
      harness.shallow({ hideSubmitButtons: true })
      const child = {
        findArgs: SubmitButtons,
      }
      expect(() => harness.shouldIncludeChild(child)).to.throw()
    })
  })

  describe('SubmitResponse', () => {
    beforeEach(() => {
      stores.Qvain.Submit.setResponse('some response')
      jest.spyOn(stores.Qvain.Submit, 'clearResponse')
      jest.spyOn(stores.Qvain.Submit, 'clearError')
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    describe('when calling clearSubmitResponse', () => {
      beforeEach(() => {
        harness.find(SubmitResponse)
        harness.props.clearSubmitResponse()
      })

      test('should call Submit.clearResponse', () => {
        expect(stores.Qvain.Submit.clearResponse).to.have.beenCalled()
      })

      test('should call Submit.clearError', () => {
        expect(stores.Qvain.Submit.clearError).to.have.beenCalled()
      })
    })
  })
})
