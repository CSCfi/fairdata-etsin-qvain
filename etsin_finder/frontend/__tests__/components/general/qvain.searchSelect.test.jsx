import React from 'react'
import { shallow } from 'enzyme'

import SearchSelect from '../../../js/components/qvain/general/V2/SearchSelect'
import { useStores } from '../../../js/stores/stores'
import {
  onChange,
  onChangeMulti,
  getOptions,
  getOptionLabel,
  getOptionValue,
  sortOptions,
} from '../../../js/components/qvain/utils/select'
import etsinTheme from '../../../js/styles/theme'

jest.mock('../../../js/stores/stores')
jest.mock('../../../js/components/qvain/utils/select')

describe('SearchSelect', () => {
  let wrapper
  let select

  const modelReturnValue = {}
  const metaxIdentifier = 'metaxIdentifier'
  const setter = jest.fn()
  const model = jest.fn(() => modelReturnValue)
  const name = 'name'

  const props = {
    metaxIdentifier,
    setter,
    model,
    name,
  }

  const Stores = { Qvain: { readonly: 'readonly' }, Locale: { lang: 'fi' } }

  const createWrapperWithProps = (customProps = {}) => {
    useStores.mockReturnValue(Stores)
    const parsedProps = { ...props, ...customProps }
    wrapper = shallow(<SearchSelect {...parsedProps} />)
    select = wrapper.find(`#select-${props.name}`)
  }

  beforeEach(() => {
    createWrapperWithProps()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('it exists', () => {
    wrapper.should.have.lengthOf(1)
  })

  test('props should include expectedProps', () => {
    const expectedProps = {
      inputId: `${name}-select`,
      isDisabled: Stores.Qvain.readonly,
      value: undefined,
    }

    select.props().should.include(expectedProps)
  })

  test('given isMulti is false (set by defaultProps), onChange should have been called with setter', () => {
    expect(onChange).toHaveBeenCalledWith(setter)
  })

  test('getOptionLabel should have been called with model and Stores.Locale.lang', () => {
    expect(getOptionLabel).toHaveBeenCalledWith(model, Stores.Locale.lang)
  })

  test('getOptionValue should have been called with model', () => {
    expect(getOptionValue).toHaveBeenCalledWith(model)
  })

  describe('when loadOptions is called', () => {
    const inputValue = 'inputValue'
    const opts = 'opts'
    let returnValue

    beforeEach(async () => {
      getOptions.mockReturnValue(opts)
      returnValue = await select.prop('loadOptions')(inputValue)
    })

    test('should call getOptions with model, metaxIdentifier, inputValue', () => {
      expect(getOptions).toHaveBeenCalledWith(model, metaxIdentifier, inputValue)
    })

    test('should call sortOptions with model, Stores.Locale.lang and opts (from getOptions)', () => {
      expect(sortOptions).toHaveBeenCalledWith(model, Stores.Locale.lang, opts)
    })

    test('should return opts', () => {
      returnValue.should.eql(opts)
    })
  })

  describe('given InModal set to false. (set by defaultProps)', () => {
    test('it exists', () => {
      select.should.have.lengthOf(1)
    })

    test('props should not include exculdedProps', () => {
      const excludedProps = ['menuPlacement', 'menuPosition', 'menuShouldScrollIntoView']

      select.props().should.not.have.keys(excludedProps)
    })
  })

  describe('given InModal set to true.', () => {
    beforeEach(() => {
      createWrapperWithProps({ inModal: true })
      select = wrapper.find('#select-in-modal')
    })

    test('it exists', () => {
      select.should.have.lengthOf(1)
    })

    test('props should include expectedProps', () => {
      const expectedProps = {
        menuPlacement: 'auto',
        menuPosition: 'fixed',
        menuShouldScrollIntoView: false,
      }

      select.props().should.include(expectedProps)
    })
  })

  describe('given isMulti', () => {
    beforeEach(() => {
      createWrapperWithProps({ isMulti: true })
    })

    test('onChangeMulti should have been called with setter', () => {
      expect(onChangeMulti).toHaveBeenCalledWith(setter)
    })
  })
})
