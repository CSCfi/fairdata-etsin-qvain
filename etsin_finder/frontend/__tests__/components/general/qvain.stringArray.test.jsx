import React from 'react'
import { shallow } from 'enzyme'
import 'chai/register-expect'
import { useStores } from '../../../js/stores/stores'

import StringArray from '../../../js/components/qvain/general/input/stringArray'

jest.mock('../../../js/stores/stores')

test('no test', () => {})
/*
describe('StringArray', () => {
  let wrapper, stringArray
  const mockStores = {
    Qvain: {
      field: {
        itemStr: 'itemStr',
        addItemStr: jest.fn(),
        setItemStr: jest.fn(),
        storage: [],
        set: jest.fn(),
        translationsRoot: 'translationsRoot',
        validationError: [],
        setValidationError: jest.fn(),
        validate: jest.fn(),
      },
    },
  }

  const props = {
    id: 'some-id',
    fieldName: 'field',
  }

  const render = (extraProps = {}) => {
    const combinedProps = { ...props, ...extraProps }
    wrapper = shallow(<StringArray {...combinedProps} />)
    stringArray = wrapper.find(`#string-array-${combinedProps.id}`)
  }

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
    render()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('given defaultProps', () => {
    test('should exist', () => {
      wrapper.exists().should.be.true
    })

    //onChange
    describe('when triggering onChange', () => {
      const updatedOptions = []

      beforeEach(() => {
        stringArray.simulate('change', updatedOptions)
      })

      test('should call set with given args', () => {
        expect(props.set).to.have.beenCalledWith(updatedOptions)
      })

      test('should call setValidationError with null', () => {
        expect(props.setValidationError).to.have.beenCalledWith(null)
      })
    })

    //onInputChange
    describe('when triggering onInputChange with trivial str and non-blur, non-close action', () => {
      const str = 'str'
      const meta = { action: 'some action' }
      beforeEach(() => {
        stringArray.simulate('inputChange', str, meta)
      })

      test('should call setItemStr with str', () => {
        expect(props.setItemStr).to.have.beenCalledWith(str)
      })
    })

    //onInputChange
    describe('when triggering onInputChange with trivial str and blur-action', () => {
      const str = 'str'
      const meta = { action: 'input-blur' }

      beforeEach(() => {
        stringArray.simulate('inputChange', str, meta)
      })

      test('should not call setItemStr', () => {
        expect(props.setItemStr).to.not.have.beenCalled()
      })
    })
  })

  describe('given optional props', () => {
    const optionalProps = {
      required: true,
      readonly: true,
    }

    beforeEach(() => {
      render(optionalProps)
    })

    test('props should include expectedProps', () => {
      const expectedProps = {
        inputId: optionalProps.id,
        isDisabled: optionalProps.readonly,
        required: optionalProps.required,
      }

      stringArray.props().should.include(expectedProps)
    })

    //onChange
    describe('when triggering onChange (without arguments)', () => {
      beforeEach(() => {
        stringArray.simulate('change')
      })

      test('should call set with empty array', () => {
        expect(props.set).to.have.beenCalledWith([])
      })
    })

    //onBlur
    describe('given changed is false', () => {
      describe('when triggering onBlur', () => {
        beforeEach(() => {
          stringArray.simulate('blur')
        })

        test('itemSchema.validateSync should NOT have been called', () => {
          expect(optionalProps.itemSchema.validateSync).to.not.have.beenCalled()
        })

        test('schema.validateSync should NOT have been called', () => {
          expect(optionalProps.schema.validateSync).to.not.have.beenCalled()
        })
      })
    })

    //onBlur
    describe('given changed is true', () => {
      beforeEach(() => {
        props.itemStr = 'test'
        render(optionalProps)
        stringArray.simulate('change')
      })

      describe('when triggering onBlur', () => {
        beforeEach(() => {
          stringArray.simulate('blur')
        })

        test('should call validate', () => {
          expect(mockStores.Qvain.field.validate).to.have.beenCalled()
        })
      })
    })
  })
})
*/
