import React from 'react'
import { shallow } from 'enzyme'
import 'chai/register-should'
import 'chai/register-expect'

import {
  ConfirmClose,
  ConfirmDialog,
} from '../../../js/components/qvain/general/modal/confirmClose'

import {
  DangerCancelButton,
  DangerButton,
  ConfirmButtonContainer,
} from '../../../js/components/qvain/general/buttons'
import { ResponseOverlay } from '../../../js/components/qvain/general/modal/modalOverlay'

describe('ConfirmDialog', () => {
  let wrapper

  const props = {
    show: true,
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    content: {
      warning: 'warning',
      cancel: 'cancel',
      confirm: 'confirm',
    },
  }

  const render = extraProps => {
    const parsedProps = { ...props, ...extraProps }
    wrapper = shallow(<ConfirmDialog {...parsedProps} />)
  }

  describe('given show is false', () => {
    beforeEach(() => {
      render({ show: false })
    })

    test('should not render', () => {
      expect(wrapper.html()).to.be.null
    })
  })

  describe('given minimal props (with show:true)', () => {
    beforeEach(() => {
      render()
    })

    describe('ResponseOverlay', () => {
      let responsiveOverlay

      beforeEach(() => {
        responsiveOverlay = wrapper.find(ResponseOverlay)
      })

      test('should exist', () => {
        responsiveOverlay.exists().should.be.true
      })

      test('should have content of content.warning', () => {
        responsiveOverlay.prop('children').should.include(props.content.warning)
      })

      describe.skip('DangerCancelButton', () => {
        test('should not be disabled', () => {})
        test('should have content of content.cancel', () => {})
        describe('when triggering onClick', () => {
          test('should call onCancel function', () => {})
        })
      })

      describe.skip('DangerButton', () => {
        test('should not be disabled', () => {})
        test('should have content of content.confirm', () => {})
        describe('when triggering onClick', () => {
          test('should call onConfirm function', () => {})
        })
      })
    })
  })
})
