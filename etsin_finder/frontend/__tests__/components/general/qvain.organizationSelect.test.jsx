import React from 'react'
import { shallow } from 'enzyme'
import 'chai/register-should'
import axios from 'axios'

import OrganizationSelect from '../../../js/components/qvain/general/input/organizationSelect'
import { withStores } from '../../../js/stores/stores'

jest.mock('../../../js/stores/stores', () => ({
  withStores: jest.fn(c => c),
}))

jest.mock('axios')

describe('OrganizationSelect', () => {
  let wrapper
  let organizationSelect
  let departmentSelect
  let subDepartmentSelect

  const Stores = {
    Qvain: {},
    Locale: {
      lang: 'fi',
    },
  }

  const onChange = jest.fn()

  let value = {
    organization: 'organization',
    department: undefined,
    subDepartment: undefined,
  }

  const name = 'name'

  const inputId = 'inputId'

  const placeholder = {
    organization: 'placeholder',
    department: 'department placeholder',
  }

  const creatable = true

  let props = {
    Stores,
    value,
    onChange,
    name,
    inputId,
    placeholder,
    creatable,
  }

  const departmentOption = {
    value: 'department',
    label: 'fi_department',
    name: {
      fi: 'fi_department',
      en: 'en_department',
      und: 'und_department',
    },
  }

  const subDepartmentOption = {
    value: 'subdepartment',
    label: 'fi_subdepartment',
    name: {
      fi: 'fi_subdepartment',
      en: 'en_subdepartment',
      und: 'und_subdepartment',
    },
  }

  beforeEach(() => {
    axios.get.mockReturnValue({
      status: 200,
      data: {
        hits: {
          hits: [
            {
              _source: {
                uri: 'value',
                label: {
                  fi: 'fi_label',
                  en: 'en_label',
                  und: 'und_label',
                },
              },
            },
          ],
        },
      },
    })
    withStores.mockReturnValue(Stores)
    wrapper = shallow(<OrganizationSelect {...props} />)
  })

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.unmount()
  })

  test('it exists', () => {
    wrapper.exists().should.be.true
  })

  describe('given no values', () => {
    const setupState = () => {
      props.value = {
        organization: undefined,
        department: undefined,
        subDepartment: undefined,
      }

      wrapper = shallow(<OrganizationSelect {...props} />)

      wrapper.setState({
        options: {
          organization: {
            value: 'value',
            label: 'fi_label',
            name: { fi: 'fi_label', en: 'en_label', und: 'und_label' },
          },
        },
      })
    }

    describe('OrganizationSelect', () => {
      beforeEach(() => {
        setupState()
        organizationSelect = wrapper.find('#org-select')
      })

      test('should exist', () => {
        organizationSelect.exists().should.be.true
      })
    })
  })

  describe('given value only for organization', () => {
    const setupState = () => {
      props.value = {
        organization: 'organization',
        department: undefined,
        subDepartment: undefined,
      }

      wrapper = shallow(<OrganizationSelect {...props} />)

      wrapper.setState({
        options: {
          organization: {
            value: 'value',
            label: 'fi_label',
            name: { fi: 'fi_label', en: 'en_label', und: 'und_label' },
          },
          department: {
            fi: departmentOption,
            en: departmentOption,
          },
        },
      })

      wrapper.update()
    }

    describe('OrganizationSelect', () => {
      beforeEach(() => {
        setupState()
        organizationSelect = wrapper.find('#org-select')
      })

      test('it exists', () => {
        organizationSelect.exists().should.be.true
      })

      test('name should be props.name', () => {
        organizationSelect.prop('name').should.eql(props.name)
      })

      test('inputId should be props.inputId', () => {
        organizationSelect.prop('inputId').should.eql(props.inputId)
      })

      test('value should be props.value.organization', () => {
        organizationSelect.prop('value').should.eql(props.value.organization)
      })

      test('options should be fetched and parsed from backend', () => {
        organizationSelect = wrapper.find('#org-select') // updates state changes
        organizationSelect.prop('options').should.eql([
          {
            value: 'value',
            label: 'fi_label',
            name: { fi: 'fi_label', en: 'en_label', und: 'und_label' },
          },
        ])
      })

      test('placeholder should be props.placeholder.organization', () => {
        organizationSelect.prop('placeholder').should.eql(props.placeholder.organization)
      })

      test('creatable should be props.creatable', () => {
        organizationSelect.prop('creatable').should.eql(props.creatable)
      })

      test('allowReset should be true', () => {
        organizationSelect.prop('allowReset').should.be.true
      })
    })
  })

  describe('given organization and department but NOT subdepartment', () => {
    const setupState = () => {
      props.value = {
        organization: 'organization',
        department: 'department',
        subDepartment: undefined,
      }

      wrapper = shallow(<OrganizationSelect {...props} />)

      wrapper.setState({
        options: {
          organization: {
            value: 'value',
            label: 'fi_label',
            name: { fi: 'fi_label', en: 'en_label', und: 'und_label' },
          },
          department: {
            fi: departmentOption,
            en: departmentOption,
          },
        },
      })
    }

    describe('DepartmentSelect', () => {
      beforeEach(() => {
        setupState()
        departmentSelect = wrapper.find('#department-select')
      })

      test('it exists', () => {
        departmentSelect.exists().should.be.true
      })

      test('name should be props.name', () => {
        departmentSelect.prop('name').should.eql(props.name)
      })

      test('inputId should be props.inputId', () => {
        departmentSelect.prop('inputId').should.eql(`${props.inputId}-department`)
      })

      test('value should equal props.value.department', () => {
        expect(departmentSelect.prop('value')).toBe(props.value.department)
      })

      test('options should be predetermined department option', () => {
        departmentSelect.prop('options').should.eql(departmentOption)
      })

      test('placeholder should equal props.placeholder.department', () => {
        departmentSelect.prop('placeholder').should.eql(placeholder.department)
      })

      test('creatable should be props.creatable', () => {
        departmentSelect.prop('creatable').should.eql(props.creatable)
      })

      test('allowReset should be true', () => {
        departmentSelect.prop('allowReset').should.be.true
      })
    })

    describe('SubDepartmentSelect', () => {
      beforeEach(() => {
        setupState()
        subDepartmentSelect = wrapper.find('#subdepartment-select')
      })

      test('should exist', () => {
        subDepartmentSelect.exists().should.be.true
      })

      test('value should be null', () => {
        expect(subDepartmentSelect.prop('value')).toBe(null)
      })

      test('allowReset should be false', () => {
        subDepartmentSelect.prop('allowReset').should.be.false
      })
    })
  })

  describe('given fully populated value (organization, department, subDepartment)', () => {
    beforeEach(() => {
      props.value = {
        organization: 'organization',
        department: 'department',
        subDepartment: 'subDepartment',
      }

      wrapper = shallow(<OrganizationSelect {...props} />)

      wrapper.setState({
        options: {
          organization: {
            value: 'value',
            label: 'fi_label',
            name: { fi: 'fi_label', en: 'en_label', und: 'und_label' },
          },
          department: {
            fi: departmentOption,
            en: departmentOption,
          },
          subDepartment: {
            fi: subDepartmentOption,
            en: subDepartmentOption,
          },
        },
      })
    })

    describe('DepartmentSelect', () => {
      beforeEach(() => {
        wrapper.setState({
          options: {
            organization: {
              value: 'value',
              label: 'fi_label',
              name: { fi: 'fi_label', en: 'en_label', und: 'und_label' },
            },
            department: {
              fi: departmentOption,
              en: departmentOption,
            },
            subDepartment: {
              fi: subDepartmentOption,
              en: subDepartmentOption,
            },
          },
        })

        departmentSelect = wrapper.find('#department-select')
      })

      test('allowReset should be false', () => {
        departmentSelect.prop('allowReset').should.be.false
      })
    })

    describe('SubDepartmentSelect', () => {
      beforeEach(() => {
        wrapper.setState({
          options: {
            organization: {
              value: 'value',
              label: 'fi_label',
              name: { fi: 'fi_label', en: 'en_label', und: 'und_label' },
            },
            department: {
              fi: departmentOption,
              en: departmentOption,
            },
            subDepartment: {
              fi: subDepartmentOption,
              en: subDepartmentOption,
            },
          },
        })

        subDepartmentSelect = wrapper.find('#subdepartment-select')
      })

      test('should exist', () => {
        subDepartmentSelect.exists().should.be.true
      })

      test('name should equal props.name', () => {
        subDepartmentSelect.prop('name').should.eql(name)
      })

      test('inputId should be props.inputId-subdepartment', () => {
        subDepartmentSelect.prop('inputId').should.be.string(`${inputId}-subdepartment`)
      })

      test('value should eql props.value.subDepartment', () => {
        subDepartmentSelect.prop('value').should.eql(props.value.subDepartment)
      })

      test('options should be predetermined subDepartmentOption', () => {
        subDepartmentSelect.prop('options').should.eql(subDepartmentOption)
      })

      test('placeholder should equal props.placeholder.department', () => {
        subDepartmentSelect.prop('placeholder').should.eql(placeholder.department)
      })

      test('allowReset should be true', () => {
        subDepartmentSelect.prop('allowReset').should.be.true
      })
    })
  })
})
