import React from 'react'
import { shallow } from 'enzyme'
import 'chai/register-should'
import 'chai/register-expect'

import ModalButtons from '../../../js/components/qvain/general/modal/modalButtons'
import ValidationError from '../../../js/components/qvain/general/errors/validationError'
import { CancelButton, SaveButton } from '../../../js/components/qvain/general/buttons'

const Field = {
  validationError: [],
  editMode: false,
}

const translations = {
  buttons: { save: 'save', cancel: 'cancel', editSave: 'editSave' },
}

describe('ModalButtons', () => {
  let wrapper

  const props = {
    Field,
    handleSave: jest.fn(),
    handleRequestClose: jest.fn(),
    translations,
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

      test('should have content: translations.buttons.cancel', () => {
        cancelButton.prop('content').should.eql(translations.buttons.cancel)
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

      test('should have content: translations.buttons.save', () => {
        saveButton.prop('content').should.eql(translations.buttons.save)
      })

      test('should have disabled: undefined', () => {
        expect(saveButton.prop('disabled')).to.be.undefined
      })

      describe('when triggering onClick', () => {
        beforeEach(() => {
          saveButton.simulate('click')
        })

        test('should call handleSave', () => {
          expect(props.handleSave).to.have.beenCalledTimes(1)
        })
      })
    })
  })

  describe('given Field.editMode: true and readonly: true', () => {
    beforeEach(() => {
      render({ Field: { ...Field, editMode: true }, readonly: true })
    })

    describe('SaveButton', () => {
      let saveButton

      beforeEach(() => {
        saveButton = wrapper.findWhere(elem => elem.prop('component') === SaveButton)
      })

      test('should have content: translations.buttons.editSave', () => {
        saveButton.prop('content').should.eql(translations.buttons.editSave)
      })

      test('should have disabled: true', () => {
        saveButton.prop('disabled').should.be.true
      })
    })
  })
})
