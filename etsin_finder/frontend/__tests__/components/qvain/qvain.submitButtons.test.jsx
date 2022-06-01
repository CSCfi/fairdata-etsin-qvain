import React from 'react'
import { shallow } from 'enzyme'
import Harness from '../componentTestHarness'

import { SubmitButtons } from '@/components/qvain/views/headers/submitButtons'
import { useStores } from '@/stores/stores'

const mockSubmitDraft = jest.fn()
const mockSubmitPublish = jest.fn()
const mockGetQvainUrl = jest.fn()

jest.mock('@/stores/stores', () => {
  return {
    useStores: jest.fn(),
  }
})

const mockHistory = { replace: jest.fn() }

describe('SubmitButtons', () => {
  let wrapper
  let disabled = false

  const basicRender = () => {
    useStores.mockReturnValue({
      Qvain: {
        Submit: {
          submitDraft: mockSubmitDraft,
          submitPublish: mockSubmitPublish,
        },
      },
      Env: { getQvainUrl: mockGetQvainUrl },
      QvainDatasets: {
        setPublishedDataset: jest.fn(),
      },
      Matomo: {
        recordEvent: jest.fn(),
      },
    })

    wrapper = shallow(
      <SubmitButtons
        history={mockHistory}
        submitButtonsRef={React.createRef()}
        disabled={disabled}
      />
    )
  }

  beforeEach(() => {
    basicRender()
  })

  describe('basic render tests', () => {
    test('should call useStores', () => {
      expect(useStores).toHaveBeenCalledTimes(1)
    })
  })

  describe('when setting disabled to true', () => {
    beforeEach(() => {
      disabled = true
      basicRender()
    })

    test(`should set both buttons' props to disbled`, () => {
      expect(wrapper.find('#draft-btn').prop('disabled')).toBe(true)
      expect(wrapper.find('#publish-btn').prop('disabled')).toBe(true)
    })
  })

  describe('when the User clicks save draft button', () => {
    let button

    beforeEach(() => {
      button = wrapper.find('#draft-btn')
      button.simulate('click')
    })

    test('should call submitDraft', () => {
      expect(useStores().Qvain.Submit.submitDraft).toHaveBeenCalled()
    })
  })

  describe('when the User clicks save publish button', () => {
    let button

    beforeEach(() => {
      button = wrapper.find('#publish-btn')
      button.simulate('click')
    })

    test('should call submitPublish', () => {
      expect(useStores().Qvain.Submit.submitPublish).toHaveBeenCalled()
    })
  })
})

let getMockStores = () => {
  const stores = {
    Qvain: {
      Submit: {
        submitDraft: jest.fn(),
        submitPublish: jest.fn(),
        draftValidationError: { errors: [] },
        publishValidationError: { errors: [] },
        prevalidate: jest.fn(),
        isDraftButtonDisabled: false,
        isPublishButtonDisabled: false,
      },
      original: {},
      hasBeenPublishedWithDoi: false,
      useDoi: false,
    },
    Env: {
      getQvainUrl: jest.fn(),
    },
    QvainDatasets: {
      setPublishedDataset: jest.fn(),
    },
    Matomo: {
      recordEvent: jest.fn(),
    },
  }
  return stores
}

describe('given mockStores and required props', () => {
  const mockStores = getMockStores()

  const props = {
    submitButtonsRef: {},
    disabled: false,
    idSuffix: '-idSuffix',
  }

  const harness = new Harness(SubmitButtons, props)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('SubmitButtons', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected props', () => {
      const children = [
        {
          label: 'DraftTooltip',
          findType: 'prop',
          findArgs: ['description', 'qvain.validationMessages.draft.description'],
        },
        { label: 'DraftButtonWrapper', findType: 'prop', findArgs: ['id', 'draft-button-wrapper'] },
        { label: 'DraftButton', findType: 'prop', findArgs: ['id', 'draft-btn-idSuffix'] },
        {
          label: 'PublishTooltip',
          findType: 'prop',
          findArgs: ['description', 'qvain.validationMessages.publish.description'],
        },
        {
          label: 'PublishButtonWrapper',
          findType: 'prop',
          findArgs: ['id', 'publish-button-wrapper'],
        },
        {
          label: 'PublishButton',
          findType: 'prop',
          findArgs: ['id', 'publish-btn-idSuffix'],
        },
      ]

      const expectedProps = {
        DraftTooltip: {
          isOpen: false,
          errors: [],
        },
        DraftButton: {
          disabled: false,
        },
        PublishTooltip: {
          isOpen: false,
          errors: [],
        },
        PublishButton: {
          disabled: false,
        },
      }

      harness.shouldIncludeChildren(children, expectedProps)
    })
  })

  describe('DraftButton', () => {
    beforeEach(() => {
      harness.restoreWrapper('DraftButton')
    })

    describe('when triggering click and no original', () => {
      beforeEach(() => {
        harness.trigger('click')
      })

      test('should call handleDraftClick', () => {
        expect(mockStores.Qvain.Submit.submitDraft).toHaveBeenCalledWith()
      })

      test('should call recordEvent with DRAFT', () => {
        expect(mockStores.Matomo.recordEvent).toHaveBeenCalledWith('DRAFT')
      })

      test('should call recordEvent with DRAFT', () => {
        expect(mockStores.Matomo.recordEvent).toHaveBeenCalledWith('DRAFT')
      })
    })

    describe('when triggering click and original', () => {
      beforeEach(() => {
        mockStores.Qvain.original = { identifier: 'id' }
        harness.shallow()
        harness.findWithProp('id', 'draft-btn-idSuffix')
        harness.trigger('click')
      })

      test('should call recordEvent with DRAFT / id', () => {
        expect(mockStores.Matomo.recordEvent).toHaveBeenCalledWith('DRAFT / id')
      })
    })
  })

  describe('PublishButton', () => {
    beforeEach(() => {
      harness.restoreWrapper('PublishButton')
    })

    describe('when triggering click and no original', () => {
      beforeEach(() => {
        harness.trigger('click')
      })

      test('should call handlePublishClick', () => {
        expect(mockStores.Qvain.Submit.submitPublish).toHaveBeenCalled()
      })

      test('should call recordEvent with PUBLISH', () => {
        expect(mockStores.Matomo.recordEvent).toHaveBeenCalledWith('PUBLISH')
      })
    })
  })
})
