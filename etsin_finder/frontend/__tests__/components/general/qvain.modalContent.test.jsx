import React from 'react'
import { shallow } from 'enzyme'
import 'chai/register-expect'

import ModalContent from '../../../js/components/qvain/general/modal/modalContent'
import ModalButtons from '../../../js/components/qvain/general/modal/modalButtons'
import { ConfirmClose } from '../../../js/components/qvain/general/modal/confirmClose'

describe('ModalContent', () => {
  let wrapper

  const Form = () => <div id="form" />

  const props = {
    Store: { readonly: false },
    Field: {},
    Form,
    formProps: { someProp: 'someProp' },
    handleSave: jest.fn(),
    translationsRoot: 'translationsRoot',
    language: 'language',
    onConfirmCancel: jest.fn(),
    onConfirm: jest.fn(),
    confirm: true,
    requestClose: jest.fn(),
  }

  const expectedTranslations = props => ({
    title: props.Field.editMode
      ? `${props.translationsRoot}.modal.title.edit`
      : `${props.translationsRoot}.modal.title.add`,
    buttons: {
      cancel: `${props.translationsRoot}.modal.buttons.cancel`,
      save: `${props.translationsRoot}.modal.buttons.save`,
      editSave: `${props.translationsRoot}.modal.buttons.editSave`,
    },
  })

  const render = extraProps => {
    const parsedProps = { ...props, ...extraProps }
    wrapper = shallow(<ModalContent {...parsedProps} />)
  }

  beforeEach(() => {
    render()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('given Field.editMode:false', () => {
    const Field = { editMode: false }
    beforeEach(() => {
      render({ Field })
    })

    test('should exist', () => {
      wrapper.exists().should.be.true
    })

    describe('Header', () => {
      let header

      beforeEach(() => {
        header = wrapper.find('modalContent__Header')
      })

      test('should exist', () => {
        header.exists().should.be.true
      })

      test('should have <Translate content:translations.title />', () => {
        const title = header.find(`[content="${expectedTranslations(props).title}"]`)
        title.exists().should.be.true
      })
    })

    describe('Form', () => {
      let form
      beforeEach(() => {
        form = wrapper.find(Form)
      })

      test('should exist', () => {
        form.exists().should.be.true
      })

      test('should have expectedProps', () => {
        const expectedProps = {
          Store: props.Store,
          Field,
          translationsRoot: props.translationsRoot,
          language: props.language,
          someProp: props.formProps.someProp,
        }

        form.props().should.include(expectedProps)
      })
    })

    describe('ModalButtons', () => {
      let modalButtons

      beforeEach(() => {
        modalButtons = wrapper.find(ModalButtons)
      })

      test('should have correct translations', () => {
        modalButtons.prop('translations').should.eql(expectedTranslations(props))
      })

      test('have readonly: false', () => {
        expect(modalButtons.prop('readonly')).to.be.false
      })

      describe('when calling handleRequestClose', () => {
        beforeEach(() => {
          modalButtons.prop('handleRequestClose')()
        })

        test('should call request close', () => {
          expect(props.requestClose).to.have.beenCalled()
        })
      })

      describe('when calling handleSave', () => {
        beforeEach(() => {
          modalButtons.prop('handleSave')()
        })

        test('should call props.handleSave with Field', () => {
          expect(props.handleSave).to.have.beenCalledWith(Field)
        })
      })
    })

    describe('ConfirmClose', () => {
      let confirmClose

      beforeEach(() => {
        confirmClose = wrapper.find(ConfirmClose)
      })

      test('should have show: true', () => {
        confirmClose.prop('show').should.be.true
      })

      describe('when calling onCancel', () => {
        beforeEach(() => {
          confirmClose.prop('onCancel')()
        })

        test('should call props.onConfirmClose', () => {
          expect(props.onConfirmCancel).to.have.beenCalledTimes(1)
        })
      })

      describe('when calling onConfirm', () => {
        beforeEach(() => {
          confirmClose.prop('onConfirm')()
        })

        test('should call props.onConfirm', () => {
          expect(props.onConfirm).to.have.beenCalledTimes(1)
        })
      })
    })
  })

  describe('given Field.editMode:true', () => {
    const Field = {
      editMode: true,
    }

    beforeEach(() => {
      render({ Field })
    })

    describe('ModalButtons', () => {
      let modalButtons

      beforeEach(() => {
        modalButtons = wrapper.find(ModalButtons)
      })

      test('should have expectedTranslations', () => {
        const translations = expectedTranslations({ ...props, Field })

        modalButtons.prop('translations').should.eql(translations)
      })
    })
  })
})
