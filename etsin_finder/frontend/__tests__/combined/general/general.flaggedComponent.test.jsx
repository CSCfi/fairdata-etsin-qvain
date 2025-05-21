import '@testing-library/jest-dom'
import { screen, render } from '@testing-library/react'

import FlaggedComponent from '../../../js/components/general/flaggedComponent.jsx'
import { useStores } from '../../../js/stores/stores.jsx'
import FlagsClass from '../../../js/stores/domain/env.flags.js'

const Flags = new FlagsClass()
Flags.setFlags({
  ENABLED_FEATURE: true,
  DISABLED_FEATURE: false,
  ENABLED_GROUP: true,
  'ENABLED_GROUP.DISABLED_SUBFEATURE': false,
  'ENABLED_GROUP.NULL_SUBFEATURE': null,
  DISABLED_GROUP: false,
  'DISABLED_GROUP.ENABLED_SUBFEATURE': true,
  UNSUPPORTED_FEATURE: true,
})

Flags.setSupportedFlags([
  'ENABLED_FEATURE',
  'DISABLED_FEATURE',
  'ENABLED_GROUP.DISABLED_SUBFEATURE',
  'ENABLED_GROUP.SUBFEATURE',
  'ENABLED_GROUP.NULL_SUBFEATURE',
  'DISABLED_GROUP.ENABLED_SUBFEATURE',
  'DISABLED_GROUP.SUBFEATURE',
])

jest.mock('../../../js/stores/stores', () => ({
  useStores: jest.fn(),
}))

useStores.mockReturnValue({ Env: { Flags } })

describe('FlaggedComponent', () => {
  const { flagEnabled } = Flags
  const TestComponent = () => <div>test component</div>
  const WhenDisabledComponent = () => <div>disabled component</div>

  describe('when flag is true', () => {
    test('should render TestComponent', () => {
      const { container } = render(
        <FlaggedComponent flag="ENABLED_FEATURE" whenDisabled={<WhenDisabledComponent />}>
          <TestComponent />
        </FlaggedComponent>
      )
      expect(screen.getByText('test component')).toBeInTheDocument()
      expect(container.children.length).toBe(1)
    })
  })

  describe('when flag is false', () => {
    test('should render WhenDisabledComponent', () => {
      const { container } = render(
        <FlaggedComponent flag="DISABLED_FEATURE" whenDisabled={<WhenDisabledComponent />}>
          <TestComponent />
        </FlaggedComponent>
      )
      expect(screen.getByText('disabled component')).toBeInTheDocument()
      expect(container.children.length).toBe(1)
    })

    test('should render nothing', () => {
      const { container } = render(
        <FlaggedComponent flag="DISABLED_FEATURE">
          <TestComponent />
        </FlaggedComponent>
      )
      expect(container.children.length).toBe(0)
    })
  })

  describe('when group flag is true', () => {
    test('should enable subfeature by default', () => {
      expect(flagEnabled('ENABLED_GROUP.SUBFEATURE')).toBe(true)
    })

    test('should enable null-valued subfeature', () => {
      expect(flagEnabled('ENABLED_GROUP.NULL_SUBFEATURE')).toBe(true)
    })

    test('should respect disabled subfeature flag', () => {
      expect(flagEnabled('ENABLED_GROUP.DISABLED_SUBFEATURE')).toBe(false)
    })
  })

  describe('when group flag is false', () => {
    test('should disable subfeature by default', () => {
      expect(flagEnabled('DISABLED_GROUP.SUBFEATURE')).toBe(false)
    })

    test('should respect enabled subfeature flag', () => {
      expect(flagEnabled('DISABLED_GROUP.ENABLED_SUBFEATURE')).toBe(true)
    })
  })

  describe('when flag is unsupported', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementationOnce(() => {})
    })

    afterEach(() => {
      console.warn.mockRestore()
    })

    test('should warn when state is requested', () => {
      render(
        <FlaggedComponent
          flag="THIS_FEATURE_DOES_NOT_EXIST"
          whenDisabled={<WhenDisabledComponent />}
        >
          <TestComponent />
        </FlaggedComponent>
      )
      expect(console.warn.mock.calls).toEqual([
        [expect.stringContaining('THIS_FEATURE_DOES_NOT_EXIST')],
      ])
    })

    test('should warn when flag is set', () => {
      Flags.validateFlags()
      expect(console.warn.mock.calls).toEqual([[expect.stringContaining('UNSUPPORTED_FEATURE')]])
    })
  })
})
