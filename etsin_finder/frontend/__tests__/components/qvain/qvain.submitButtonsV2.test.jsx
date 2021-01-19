import React from 'react'
import { shallow } from 'enzyme'
import { SubmitButtonsV2 } from '../../../js/components/qvain/views/editor/submitButtonsV2'
import { useStores } from '../../../js/stores/stores'

const mockSubmitDraft = jest.fn()
const mockSubmitPublish = jest.fn()
const mockGetQvainUrl = jest.fn()

jest.mock('../../../js/stores/stores', () => {
  return {
    useStores: jest.fn(),
  }
})

useStores.mockReturnValue({
  Qvain: {
    Submit: {
      submitDraft: mockSubmitDraft,
      submitPublish: mockSubmitPublish,
    },
  },
  Env: { getQvainUrl: mockGetQvainUrl },
})

const mockHistory = { replace: jest.fn() }

let wrapper
let disabled = false

const basicRender = () => {
  wrapper = shallow(
    <SubmitButtonsV2
      history={mockHistory}
      submitButtonsRef={React.createRef()}
      doiModal={<div id="doi-modal" />}
      disabled={disabled}
    />
  )
}

describe('SubmitButtonsV2', () => {
  beforeEach(() => {
    basicRender()
  })

  describe('basic render tests', () => {
    test('should call useStores', () => {
      expect(useStores).toHaveBeenCalledTimes(1)
    })

    test('should render doiModal', () => {
      expect(wrapper.find('#doi-modal').exists()).toBe(true)
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
