import React from 'react'
import Harness from '../componentTestHarness'
import Tooltip, {
  AlignedTooltip,
  TooltipRight,
  TooltipArrowRight,
  TooltipLeft,
  TooltipArrowLeft,
  TooltipUp,
  TooltipArrowUp,
  TooltipDown,
  TooltipArrowDown,
} from '../../../js/components/qvain/general/V2/Tooltip'
import { expect } from 'chai'

jest.spyOn(window, 'addEventListener')
jest.spyOn(document, 'addEventListener')
jest.spyOn(window, 'removeEventListener')
jest.spyOn(document, 'removeEventListener')

describe('Tooltip', () => {
  const props = {
    isOpen: true,
    close: jest.fn(),
    align: 'Down',
    text: <div id="text">text</div>,
    children: <div id="children">children</div>,
  }

  const harness = new Harness(Tooltip, props)

  const findCallWithArgument = (mockFunc, arg) => {
    return mockFunc.mock.calls.find(call => call.find(_arg => _arg === arg))
  }

  beforeEach(() => {
    harness.shallow()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('given required props', () => {
    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have AlignedTooltip with expectedProps', () => {
      const expectedProps = {
        alignment: props.align,
        text: props.text,
        children: props.children,
      }

      const alignedTooltip = harness.shouldExist(AlignedTooltip)
      alignedTooltip.props().should.include(expectedProps)
    })

    describe('when mount', () => {
      beforeEach(() => {
        harness.mount()
      })

      afterEach(() => {
        harness.unmount()
      })

      test('should call addEventListener for scroll, resize and mousedown', () => {
        const scrollCall = findCallWithArgument(window.addEventListener, 'scroll')
        const resizeCall = findCallWithArgument(window.addEventListener, 'resize')
        const mousedownCall = findCallWithArgument(document.addEventListener, 'mousedown')

        expect(scrollCall).to.not.be.undefined
        expect(resizeCall).to.not.be.undefined
        expect(mousedownCall).to.not.be.undefined
      })
    })

    // cannot find the way to test useEffect's unmount callback
    // FeelsBadMan
  })
})

describe('AlignedTooltip', () => {
  const props = {
    buttonRef: {},
    cardRef: {},
    text: <div id="text">text</div>,
    children: <div id="children">children</div>,
  }

  const harness = new Harness(AlignedTooltip, props)

  beforeEach(() => {
    harness.shallow()
  })

  test('should have children', () => {
    harness.shouldExist('#children')
  })

  test('should have text', () => {
    harness.shouldExist('#text')
  })

  describe('given alignment Right', () => {
    beforeEach(() => {
      harness.shallow({ alignment: 'Right' })
    })

    test('should have TooltipRight', () => {
      harness.shouldExist(TooltipRight)
    })

    test('should have TooltipArrowRight', () => {
      harness.shouldExist(TooltipArrowRight)
    })
  })

  describe('given alignment Left', () => {
    beforeEach(() => {
      harness.shallow({ alignment: 'Left' })
    })

    test('should have TooltipLeft', () => {
      harness.shouldExist(TooltipLeft)
    })

    test('should have TooltipArrowLeft', () => {
      harness.shouldExist(TooltipArrowLeft)
    })
  })

  describe('given alignment Up', () => {
    beforeEach(() => {
      harness.shallow({ alignment: 'Up' })
    })

    test('should have TooltipUp', () => {
      harness.shouldExist(TooltipUp)
    })

    test('should have TooltipArrowUp', () => {
      harness.shouldExist(TooltipArrowUp)
    })
  })

  describe('given alignment Down', () => {
    beforeEach(() => {
      harness.shallow({ alignment: 'Down' })
    })

    test('should have TooltipDown', () => {
      harness.shouldExist(TooltipDown)
    })

    test('should have TooltipArrowDown', () => {
      harness.shouldExist(TooltipArrowDown)
    })
  })
})
