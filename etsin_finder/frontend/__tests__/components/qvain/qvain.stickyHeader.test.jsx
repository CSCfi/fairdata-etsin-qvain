import React, { createRef } from 'react'
import Harness from '../componentTestHarness'
import { expect } from 'chai'
import axios from 'axios'
import { configure } from 'mobx'
import Translate from '@/utils/Translate'

import StickyHeader, { DatasetState } from '@/components/qvain/views/headers/stickyHeader'
import SubmitResponse from '@/components/qvain/views/headers/submitResponse'
import { useStores } from '@/stores/stores'
import { buildStores } from '@/stores'

jest.mock('axios')
axios.get.mockReturnValue(
  Promise.resolve({
    data: {},
  })
)

jest.mock('@/stores/stores', () => {
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

describe('state texts', () => {
  const mockStores = {
    Qvain: {
      original: {},
      Submit: {
        error: null,
        response: null,
        isLoading: false,
        clearError: () => {},
        clearResponse: () => {},
      },
    },
  }

  const harness = new Harness(StickyHeader, { datasetError: false })

  describe('when state is "published"', () => {
    beforeEach(() => {
      mockStores.Qvain.original.state = 'published'
      useStores.mockReturnValue(mockStores)
      harness.shallow()
    })

    test('should have published translation path', () => {
      const child = {
        findType: 'prop',
        findArgs: ['component', DatasetState],
      }

      const props = {
        content: 'qvain.state.published',
      }

      harness.shouldIncludeChild({ ...child, props })
    })
  })

  describe('when state is "changed"', () => {
    beforeEach(() => {
      mockStores.Qvain.original.state = 'draft'
      mockStores.Qvain.original.draft_of = true
      useStores.mockReturnValue(mockStores)
      harness.shallow()
    })

    test('should have changed translation path', () => {
      const child = {
        findType: 'prop',
        findArgs: ['component', DatasetState],
      }

      const props = {
        content: 'qvain.state.changed',
      }

      harness.shouldIncludeChild({ ...child, props })
    })
  })

  describe('when state is "draft"', () => {
    beforeEach(() => {
      mockStores.Qvain.original.state = 'draft'
      mockStores.Qvain.original.draft_of = false
      useStores.mockReturnValue(mockStores)
      harness.shallow()
    })

    test('should have draft translation path', () => {
      const child = {
        findType: 'prop',
        findArgs: ['component', DatasetState],
      }

      const props = {
        content: 'qvain.state.draft',
      }

      harness.shouldIncludeChild({ ...child, props })
    })
  })
})
