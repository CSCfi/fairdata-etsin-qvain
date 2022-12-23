import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import ModalButtons from '@/components/qvain/general/V2/ModalButtons'
import ValidationError from '@/components/qvain/general/errors/validationError'
import { CancelButton, SaveButton } from '@/components/qvain/general/buttons'

const Field = {
  validationError: [],
  editMode: false,
  validateAndSave: jest.fn(),
}

describe('ModalButtons', () => {
  let wrapper

  const props = {
    Field,
    handleRequestClose: jest.fn(),
    translationsRoot: 'someField',
  }

  const render = extraProps => {
    const parsedProps = { ...props, ...extraProps }
    wrapper = shallow(<ModalButtons {...parsedProps} />)
  }

  beforeEach(() => {
    render()
  })

  describe('given minimal props', () => {
    test('should exist', () => {
      wrapper.exists().should.be.true
    })

    describe('ValidationError', () => {
      let validationError

      beforeEach(() => {
        validationError = wrapper.findWhere(n => n.prop('component') === ValidationError)
      })

      test('should have content: Field.validationError', () => {
        validationError.prop('content').should.eql(Field.validationError)
      })
    })

    describe('CancelButton', () => {
      let cancelButton

      beforeEach(() => {
        cancelButton = wrapper.findWhere(elem => elem.prop('component') === CancelButton)
      })

      test('should exist', () => {
        cancelButton.exists().should.be.true
      })

      test('should have cancel text', () => {
        cancelButton.prop('content').should.eql('someField.modal.buttons.cancel')
      })

      describe('when triggering onClick', () => {
        beforeEach(() => {
          cancelButton.simulate('click')
        })

        test('should call handleRequestClose', () => {
          expect(props.handleRequestClose).to.have.beenCalledTimes(1)
        })
      })
    })

    describe('SaveButton', () => {
      let saveButton

      beforeEach(() => {
        saveButton = wrapper.findWhere(elem => elem.prop('component') === SaveButton)
      })

      test('should exist', () => {
        saveButton.exists().should.be.true
      })

      test('should have save text', () => {
        saveButton.prop('content').should.eql('someField.modal.buttons.save')
      })

      test('should have disabled: undefined', () => {
        expect(saveButton.prop('disabled')).to.be.undefined
      })

      describe('when triggering onClick', () => {
        test('should call validateAndSave', () => {
          saveButton.simulate('click')
          expect(Field.validateAndSave).to.have.beenCalledTimes(1)
        })
      })
    })
  })

  describe('given Field.editMode: true and readonly: true', () => {
    beforeEach(() => {
      render({ Field: { ...Field, editMode: true, readonly: true } })
    })

    describe('SaveButton', () => {
      let saveButton

      beforeEach(() => {
        saveButton = wrapper.find({ component: SaveButton })
      })

      test('should have editSave text', () => {
        saveButton.prop('content').should.eql('someField.modal.buttons.editSave')
      })

      test('should have disabled: true', () => {
        saveButton.prop('disabled').should.be.true
      })
    })
  })
})
