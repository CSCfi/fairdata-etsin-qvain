import React from 'react'
import { shallow } from 'enzyme'

import SearchSelect from '../../../js/components/qvain/general/V2/SearchSelect'
import { useStores, buildStores } from '../../../js/stores/stores'
import {
  onChange,
  onChangeMulti,
  getOptionLabel,
  getOptionValue,
  sortOptions,
  optionsToModels,
} from '../../../js/components/qvain/utils/select'

jest.mock('../../../js/stores/stores')
jest.mock('../../../js/components/qvain/utils/select')

describe('SearchSelect', () => {
  let wrapper
  let select

  const metaxIdentifier = 'metaxIdentifier'
  const setter = jest.fn()
  const model = (label, value) => ({
    label,
    value,
  })
  const name = 'name'

  const props = {
    metaxIdentifier,
    setter,
    model,
    name,
  }

  const Stores = {
    Qvain: { readonly: 'readonly', ReferenceData: { getOptions: jest.fn() } },
    Locale: { lang: 'fi' },
  }

  const createWrapperWithProps = (customProps = {}) => {
    useStores.mockReturnValue(Stores)
    const parsedProps = { ...props, ...customProps }
    wrapper = shallow(<SearchSelect {...parsedProps} />)
    select = wrapper.find(`#select-${props.name}`)
  }

  beforeEach(() => {
    createWrapperWithProps()
    optionsToModels.mockImplementation((model, v) => v)
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
    const opts = [{ value: 'value', label: 'label' }]
    let returnValue

    beforeEach(async () => {
      Stores.Qvain.ReferenceData.getOptions.mockReturnValue(Promise.resolve(opts))
      returnValue = await select.prop('loadOptions')(inputValue)
    })

    test('should call getOptions with model, metaxIdentifier, inputValue', () => {
      expect(Stores.Qvain.ReferenceData.getOptions).toHaveBeenCalledWith(metaxIdentifier, {
        searchText: inputValue,
      })
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
