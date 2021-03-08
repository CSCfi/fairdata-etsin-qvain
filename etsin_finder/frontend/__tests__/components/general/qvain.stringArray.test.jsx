import React from 'react'
import { shallow } from 'enzyme'
import 'chai/register-should'
import 'chai/register-expect'

import StringArray from '../../../js/components/qvain/general/input/stringArray'

describe('StringArray', () => {
  let wrapper, stringArray
  const props = {
    id: 'some-id',
    itemStr: 'itemStr',
    addItemStr: jest.fn(),
    setItemStr: jest.fn(),
    value: [],
    set: jest.fn(),
    translationsRoot: 'translationsRoot',
    validationError: [],
    setValidationError: jest.fn(),
  }

  const render = (extraProps = {}) => {
    const combinedProps = { ...props, ...extraProps }
    wrapper = shallow(<StringArray {...combinedProps} />)
    stringArray = wrapper.find(`#string-array-${combinedProps.id}`)
  }

  beforeEach(() => {
    render()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('given defaultProps', () => {
    test('should exist', () => {
      wrapper.exists().should.be.true
    })

    test('props should include expectedProps', () => {
      const expectedProps = {
        inputValue: props.itemStr,
        isMulti: true,
        isClearable: false,
        isDisabled: false,
        menuIsOpen: false,
        value: [],
        attributes: { placeholder: `${props.translationsRoot}.placeholder` },
        required: false,
      }

      stringArray.props().should.deep.include(expectedProps)
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
      id: 'inputId',
      itemSchema: { validateSync: jest.fn() },
      schema: { validateSync: jest.fn() },
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

      test('should call schema.validateSync with value', () => {
        expect(optionalProps.schema.validateSync).to.have.beenCalledWith(props.value)
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

        test.skip('itemSchema.validateSync should have been called with itemStr', () => {
          // but it doesn't. Issues with enzyme not being able to update state hook in time.
          // in order to fix this component needs refactoring so that everything state related is moved to mobx Field based class
          expect(optionalProps.itemSchema.validateSync).to.have.beenCalled()
        })

        test('schema.validateSync should have been called', () => {
          expect(optionalProps.schema.validateSync).to.have.beenCalled()
        })
      })
    })
  })
})
