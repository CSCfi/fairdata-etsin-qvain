import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import {
  ConfirmClose,
  ConfirmDialog,
} from '../../../js/components/qvain/general/modal/confirmClose'

import { DangerCancelButton, DangerButton } from '../../../js/components/qvain/general/buttons'
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

    afterEach(() => {
      jest.clearAllMocks()
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

      describe('CancelButton', () => {
        let cancelButton

        beforeEach(() => {
          cancelButton = wrapper.find(DangerCancelButton)
        })

        test('should not be disabled', () => {
          cancelButton.prop('disabled').should.be.false
        })

        test('should have content of content.cancel', () => {
          cancelButton.prop('children').should.include(props.content.cancel)
        })

        describe('when triggering onClick', () => {
          beforeEach(() => {
            cancelButton.simulate('click')
          })

          test('should call onCancel function', () => {
            expect(props.onCancel).to.have.beenCalledTimes(1)
          })
        })
      })

      describe('ConfirmButton', () => {
        let confirmButton

        beforeEach(() => {
          confirmButton = wrapper.find(DangerButton)
        })

        test('should not be disabled', () => {
          confirmButton.prop('disabled').should.be.false
        })

        test('should have content of content.confirm', () => {
          confirmButton.prop('children').should.include(props.content.confirm)
        })

        describe('when triggering onClick', () => {
          beforeEach(() => {
            confirmButton.simulate('click')
          })

          test('should call onConfirm function', () => {
            expect(props.onConfirm).to.have.beenCalledTimes(1)
          })
        })
      })
    })
  })
})

describe('ConfirmClose', () => {
  let wrapper

  describe('given minimal props', () => {
    beforeEach(() => {
      const props = {
        show: true,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      }

      wrapper = shallow(<ConfirmClose {...props} />)
    })

    describe('ConfirmDialog', () => {
      let dialog

      beforeEach(() => {
        dialog = wrapper.find(ConfirmDialog)
      })

      test('should render ConfirmDialog', () => {
        dialog.exists().should.be.true
      })
    })
  })
})
