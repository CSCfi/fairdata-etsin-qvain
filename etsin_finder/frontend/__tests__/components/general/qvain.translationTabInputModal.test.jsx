import React from 'react'
import { shallow } from 'enzyme'
import 'chai/register-expect'
import { configure } from 'mobx'

import TranslationTabInputModal, {
  TranslationTabInputElem,
} from '../../../js/components/qvain/general/input/translationTabInputModal'
import FieldClass from '../../../js/stores/view/qvain/qvain.field'
import { buildStores } from '../../../js/stores'

configure({ safeDescriptors: false })

const template = () => ({})
const model = () => ({})

describe('TranslationsTabInputModal', () => {
  let wrapper, inputElement
  let Field, Stores

  let props

  describe('given all props', () => {
    const render = extraProps => {
      Stores = buildStores()
      Field = new FieldClass(Stores.Qvain, template, model)
      Field.create()

      props = {
        Field,
        datum: 'datum',
        translationsRoot: 'translationsRoot',
        language: 'en',
        handleBlur: jest.fn(),
      }

      const parsedProps = { ...props, ...extraProps }

      wrapper = shallow(<TranslationTabInputModal {...parsedProps} />)
      inputElement = wrapper.find('#datumField')
    }

    beforeEach(() => {
      render()
    })

    test('wrapper should exist', () => {
      wrapper.exists().should.be.true
    })

    describe('InputElement', () => {
      test('inputElement should exist', () => {
        inputElement.exists().should.be.true
      })

      test('should include expectedProps', () => {
        const expectedProps = {
          component: TranslationTabInputElem,
          type: 'text',
          autoFocus: true,
          attributes: { placeholder: 'translationsRoot.modal.datumInput.en.placeholder' },
          disabled: Stores.Qvain.readonly,
          value: undefined,
        }

        inputElement.props().should.deep.include(expectedProps)
      })

      describe('when triggering onChange', () => {
        const newValue = 'value'
        beforeEach(() => {
          Field.changeAttribute = jest.fn()
          wrapper = shallow(<TranslationTabInputModal {...props} />)
          inputElement = wrapper.find('#datumField')

          inputElement.simulate('change', { target: { value: newValue } })
        })

        test('should call changeAttribute from Field with new value set in correlating language', () => {
          expect(Field.changeAttribute).to.have.beenCalledWith(props.datum, { en: newValue })
        })
      })

      describe('when triggering onBlur', () => {
        beforeEach(() => {
          inputElement.simulate('blur')
        })

        test('should call props.handleBlur', () => {
          expect(props.handleBlur).to.have.beenCalled()
        })
      })
    })
  })
})
