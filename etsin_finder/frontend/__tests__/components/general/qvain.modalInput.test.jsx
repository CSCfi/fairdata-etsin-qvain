import { shallow } from 'enzyme'
import React from 'react'
import 'chai/register-expect'

import ModalInput, {
  ModalError,
  ModalInputElem,
} from '../../../js/components/qvain/general/modal/modalInput'
import { Label } from '../../../js/components/qvain/general/modal/form'

describe('ModalInput', () => {
  let wrapper

  const Field = { changeAttribute: jest.fn(), inEdit: {} }

  const props = {
    Field,
    datum: 'datum',
    translationsRoot: 'translationsRoot',
    handleBlur: jest.fn(),
  }

  const getTranslations = props => ({
    label: `${props.translationsRoot}.modal.${props.datum}Input.label`,
    placeholder: `${props.translationsRoot}.modal.${props.datum}Input.placeholder`,
  })

  const render = extraProps => {
    const parsedProps = { ...props, ...extraProps }
    wrapper = shallow(<ModalInput {...parsedProps} />)
  }

  beforeEach(() => {})

  describe('given minimal props', () => {
    beforeEach(() => {
      render()
    })

    test('should exist', () => {
      wrapper.exists().should.be.true
    })

    describe('Label', () => {
      let label

      beforeEach(() => {
        label = wrapper.find(Label)
      })

      test('should have <Translate content={translations.label} />', () => {
        const content = label.find(`[content="${getTranslations(props).label}"]`)
        content.exists().should.be.true
      })
    })

    describe('ModalInputElem', () => {
      let modalInputElem

      beforeEach(() => {
        modalInputElem = wrapper.findWhere(elem => elem.prop('component') === ModalInputElem)
      })

      test('should exist', () => {
        modalInputElem.exists().should.be.true
      })

      test('should have expectedProps', () => {
        const expectedProps = {
          type: 'text',
          id: `${props.datum}Field`,
          autoFocus: true,
          attributes: { placeholder: getTranslations(props).placeholder },
          disabled: undefined,
          value: '',
        }

        modalInputElem.props().should.deep.include(expectedProps)
      })

      describe('when triggering onChange', () => {
        const event = { target: 'value' }

        beforeEach(() => {
          modalInputElem.simulate('change', event)
        })

        test('should call Field.changeAttribute with datum and event.target.value', () => {
          expect(Field.changeAttribute).to.have.beenCalledWith(props.datum, event.target.value)
        })
      })

      describe('when triggering onBlur', () => {
        beforeEach(() => {
          modalInputElem.simulate('blur')
        })

        test('should call handleBlur', () => {
          expect(props.handleBlur).to.have.beenCalledTimes(1)
        })
      })
    })
  })

  describe('given error', () => {
    const error = 'error'

    beforeEach(() => {
      render({ error })
    })

    describe('ModalError', () => {
      let modalError

      beforeEach(() => {
        modalError = wrapper.find(ModalError)
      })

      test('should exist', () => {
        modalError.exists().should.be.true
      })
    })
  })

  describe('given isRequired', () => {
    const isRequired = true
    beforeEach(() => {
      render({ isRequired })
    })

    describe('Label', () => {
      let label

      beforeEach(() => {
        label = wrapper.find(Label)
      })

      test("should render '*'", () => {
        label.text().should.include('*')
      })
    })
  })

  describe('given Field.inEdit.datum', () => {
    const Field = {
      inEdit: {
        datum: 'some data',
      },
    }

    beforeEach(() => {
      render({ Field })
    })

    describe('ModalInputElem', () => {
      let modalInputElem

      beforeEach(() => {
        modalInputElem = wrapper.findWhere(elem => elem.props().component === ModalInputElem)
      })

      test('should have value: Field.inEdit[datum]', () => {
        modalInputElem.props().value.should.eql(Field.inEdit.datum)
      })
    })
  })
})
