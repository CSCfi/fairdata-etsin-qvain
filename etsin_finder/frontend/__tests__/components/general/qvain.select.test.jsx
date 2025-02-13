import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import ReactSelect from 'react-select'
import { setImmediate } from 'timers'

import Select from '../../../js/components/qvain/general/V2/Select'
import {
  getCurrentOption,
  getOptionLabel,
  getOptionValue,
  getGroupLabel,
  onChange,
  optionsToModels,
} from '../../../js/components/qvain/utils/select'

const mockOptions = [{ value: 'value', label: 'label' }]
const modelMockOptions = [{ uri: 'value', label: 'label' }]
const getOptions = jest.fn(() => Promise.resolve(mockOptions))

const mockStores = {
  Qvain: { readonly: 'readonly', ReferenceData: { getOptions } },
  Locale: {
    lang: 'fi',
    translate: v => v,
  },
}

jest.mock('../../../js/stores/stores', () => ({
  withStores: Component => props => <Component Stores={mockStores} {...props} />,
}))
jest.mock('../../../js/components/qvain/utils/select')

describe('Select', () => {
  let wrapper, select

  const modelImplementation = (label, uri) => ({ label, uri })

  const props = {
    metaxIdentifier: 'metaxIdentifier',
    setter: jest.fn(),
    model: jest.fn(modelImplementation),
    name: 'name',
  }

  const getCurrentOptionReturnValue = 'getCurrentOptionReturnValue'
  const onChangeReturnValue = 'onChangeReturnValue'
  const getOptionValueReturnValue = 'getOptionValueReturnValue'
  const emptyGetReferenceDataRes = { data: { hits: { hits: [] } } }

  beforeEach(async () => {
    getCurrentOption.mockReturnValue(getCurrentOptionReturnValue)
    onChange.mockReturnValue(onChangeReturnValue)
    getOptionValue.mockReturnValue(getOptionValueReturnValue)

    wrapper = shallow(<Select {...props} />)
  })

  afterEach(() => {})

  test('should exist', () => {
    wrapper.exists().should.be.true
  })

  describe('Select', () => {
    beforeEach(() => {
      select = wrapper.dive()
    })

    test('should exist', () => {
      select.exists().should.be.true
    })

    test('props should include expectedProps (set by defaultProps)', () => {
      const defaultProps = {
        getter: undefined,
        inModal: false,
        isClearable: true,
        isMulti: false,
        getRefGroups: null,
        sortFunc: null,
      }

      const expectedProps = {
        Stores: mockStores,
        ...defaultProps,
        ...props,
      }

      select.props().should.include(expectedProps)
    })

    test('props should include expectedProps (parsed from props and imports)', () => {
      const expectedProps = {
        component: ReactSelect,
        attributes: { placeholder: '' },
        isDisabled: mockStores.Qvain.readonly,
        value: getCurrentOptionReturnValue,
        classNamePrefix: 'select',
        onChange: onChangeReturnValue,
        isClearable: true,
        isMulti: false,
        getOptionValue: getOptionValueReturnValue,
        options: modelMockOptions,
      }

      select.props().should.deep.include(expectedProps)
    })

    describe('given inModal is true', () => {
      beforeEach(async () => {
        props.inModal = true
        wrapper = shallow(<Select {...props} />)
        select = wrapper.dive()
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

    describe('given modifyGroupLabel', () => {
      const groupLabelFuncReturnValue = 'groupLabelFuncReturnValue'
      const getGroupLabelReturnFunction = jest.fn(() => groupLabelFuncReturnValue)
      const modifyGroupLabel = jest.fn()

      beforeEach(() => {
        getGroupLabel.mockReturnValue(getGroupLabelReturnFunction)
        props.modifyGroupLabel = modifyGroupLabel
        wrapper = shallow(<Select {...props} />)
        select = wrapper.dive()
      })

      describe('when calling formatGroupLabel', () => {
        const group = 'group'

        beforeEach(() => {
          select.props().formatGroupLabel(group)
        })

        test('should call getGroupLabel return function with group', () => {
          expect(getGroupLabelReturnFunction).to.have.beenCalledWith(group)
        })

        test('should call modifyGroupLabel with groupLabelFuncReturnValue and group', () => {
          expect(select.props().modifyGroupLabel).to.have.beenCalledWith(
            groupLabelFuncReturnValue,
            group
          )
        })
      })
    })

    describe('given modifyOptionLabel', () => {
      const option = 'option'
      const modifyOptionLabel = jest.fn()
      const optionLabelFuncReturnValue = 'optionLabelFuncReturnValue'
      const getOptionLabelReturnFunction = jest.fn(() => optionLabelFuncReturnValue)

      beforeEach(() => {
        props.modifyOptionLabel = modifyOptionLabel
        getOptionLabel.mockReturnValue(getOptionLabelReturnFunction)
        wrapper = shallow(<Select {...props} />)
        select = wrapper.dive()
      })

      describe('when calling getOptionLabel', () => {
        beforeEach(() => {
          select.props().getOptionLabel(option)
        })

        test('should call optionLabel return function with option', () => {
          expect(getOptionLabelReturnFunction).to.have.beenCalledWith(option)
        })

        test('should call modifyOptionLabel with optionLabelFuncReturnValue and option', () => {
          expect()
        })
      })
    })
  })
})
