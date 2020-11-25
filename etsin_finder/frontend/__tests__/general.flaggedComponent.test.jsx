import React from 'react'
import { shallow } from 'enzyme'
import FlaggedComponent from '../js/components/general/flaggedComponent'
import { useStores } from '../js/stores/stores'

jest.mock('../js/stores/stores', () => ({
  useStores: jest.fn(),
}))

describe('FlaggedComponent', () => {
  let wrapper
  const TestComponent = () => <div>test component</div>
  const WhenDisabledComponent = () => <div>test component 2</div>

  describe('when flag is true', () => {
    beforeEach(() => {
      useStores.mockReturnValue({ Env: { flag: true } })
      wrapper = shallow(
        <FlaggedComponent flag="flag" whenDisabled={<WhenDisabledComponent />}>
          <TestComponent />
        </FlaggedComponent>
      )
    })

    test('should render TestComponent', () => {
      expect(wrapper.find(TestComponent).exists()).toBe(true)
    })
  })

  describe('when flag is false', () => {
    beforeEach(() => {
      useStores.mockReturnValue({ Env: { flag: false } })
      wrapper = shallow(
        <FlaggedComponent flag="flag" whenDisabled={<WhenDisabledComponent />}>
          <TestComponent />
        </FlaggedComponent>
      )
    })

    test('should render WhenDisabledComponent', () => {
      expect(wrapper.find(WhenDisabledComponent).exists()).toBe(true)
    })
  })
})
