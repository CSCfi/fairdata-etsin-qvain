import React from 'react'
import { shallow } from 'enzyme'
import 'chai/register-should'
import chai from 'chai'
import axios from 'axios'
import OrganizationSelect from '../../../js/components/qvain/general/input/organizationSelect'
import { withStores } from '../../../js/stores/stores'
import { validate } from '../../../js/components/qvain/fields/project/utils'
import { organizationSelectSchema } from '../../../js/components/qvain/utils/formValidation'

jest.mock('../../../js/stores/stores', () => ({
  withStores: jest.fn(c => c),
}))

jest.mock('axios')

jest.mock('../../../js/components/qvain/fields/project/utils')

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
    jest.resetAllMocks()
    wrapper.unmount()
  })

  test('it exists', () => {
    wrapper.should.exist
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
        organizationSelect.should.exist
      })

      test('props should include expectedProps', () => {
        organizationSelect = wrapper.find('#org-select') // updates state changes
        const expectedProps = {
          name,
          inputId,
          value: null,
          options: [
            {
              value: 'value',
              label: 'fi_label',
              name: { fi: 'fi_label', en: 'en_label', und: 'und_label' },
            },
          ],
          placeholder: props.placeholder.organization,
          creatable,
          allowReset: false,
        }

        organizationSelect.props().should.deep.include(expectedProps)
      })
    })

    describe('DepartmentSelect', () => {
      beforeEach(() => {
        setupState()
        departmentSelect = wrapper.find('#department-select')
      })

      test('should NOT exist', () => {
        departmentSelect.exists().should.be.false
      })
    })

    describe('SubDepartmentSelect', () => {
      beforeEach(() => {
        setupState()
        subDepartmentSelect = wrapper.find('#subdepartment-select')
      })

      test('should NOT exist', () => {
        subDepartmentSelect.exists().should.be.false
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
        organizationSelect.should.exist
      })

      test('props should include expectedProps', () => {
        const expectedProps = { value: props.value.organization, allowReset: true }
        organizationSelect.props().should.include(expectedProps)
      })
    })

    describe('DepartmentSelect', () => {
      beforeEach(() => {
        setupState()
        departmentSelect = wrapper.find('#department-select')
      })

      test('it exists', () => {
        departmentSelect.should.exist
      })

      test('props should include expectedProps', () => {
        const expectedProps = {
          name,
          inputId: `${props.inputId}-department`,
          options: departmentOption,
          placeholder: placeholder.department,
          creatable: props.creatable,
          allowReset: false,
        }
        departmentSelect.props().should.include(expectedProps)
      })
    })

    describe('SubDepartmentSelect', () => {
      beforeEach(() => {
        subDepartmentSelect = wrapper.find('#subdepartment-select')
      })

      test('should NOT exist', () => {
        subDepartmentSelect.exists().should.be.false
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

      wrapper.update()
    }

    describe('DepartmentSelect', () => {
      beforeEach(() => {
        setupState()
        departmentSelect = wrapper.find('#department-select')
      })

      test('it exists', () => {
        departmentSelect.should.exist
      })

      test('props should include expectedProps', () => {
        const expectedProps = { value: props.value.department, allowReset: true }
        departmentSelect.props().should.include(expectedProps)
      })
    })

    describe('SubDepartmentSelect', () => {
      beforeEach(() => {
        setupState()
        subDepartmentSelect = wrapper.find('#subdepartment-select')
      })

      test('should exist', () => {
        subDepartmentSelect.should.exist
      })

      test('props should include expectedProps', () => {
        const expectedProps = {
          name,
          inputId: `${inputId}-subdepartment`,
          value: null,
          placeholder: placeholder.department,
          allowReset: false,
        }
        subDepartmentSelect.props().should.include(expectedProps)
      })
    })
  })

  describe('given fully populated value (organization, department, subDepartment)', () => {
    beforeEach(() => {
      props.value = {
        organization: { formIsOpen: false, name: 'name', email: 'email', value: 'value' },
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

    describe('OrganizationSelect', () => {
      beforeEach(() => {
        organizationSelect = wrapper.find('#org-select')
      })

      describe('when triggering onChange with empty string', () => {
        const eventValue = ''
        const expectedValue = { organization: null, department: null, subDepartment: null }
        beforeEach(() => {
          organizationSelect.simulate('change', eventValue)
        })

        test('should call props.onChange with expectedValue', () => {
          chai.expect(props.onChange).to.have.beenCalledWith(expectedValue)
        })
      })

      describe('when triggering onChange with {formIsOpen: false}', () => {
        const eventValue = { formIsOpen: false }
        const expectedValue = { organization: eventValue, department: null, subDepartment: null }
        beforeEach(() => {
          organizationSelect.simulate('change', eventValue)
        })

        test('should call props.onChange with expectedValue', () => {
          // sets organization with evantValue and clears department and subDepartment
          chai.expect(props.onChange).to.have.beenCalledWith(expectedValue)
        })

        test('should clear state.options.department', () => {
          wrapper.state().options.department.should.eql({})
        })

        test('should clear state.options.subDepartment', () => {
          wrapper.state().options.subDepartment.should.eql({})
        })
      })

      describe('when calling onBlur', () => {
        let expectedValue
        beforeEach(async () => {
          expectedValue = {
            ...props.value,
            organization: { ...props.value.organization },
          }

          validate.mockReturnValue(Promise.resolve(undefined))
          organizationSelect = wrapper.find('#org-select')
          organizationSelect.simulate('blur')
          await Promise.resolve()
        })

        test('should call props.onChange with expectedValue', () => {
          expect(props.onChange).toHaveBeenCalledWith(expectedValue)
        })

        test('should call validate with correct args', () => {
          const { name, email, value } = props.value.organization
          const expectedArgs = [organizationSelectSchema, { name, email, identifier: value }]
          chai.expect(validate).to.have.beenCalledWith(...expectedArgs)
        })
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

      describe('when triggering onChange with empty string', () => {
        const eventValue = ''
        let expectedValue

        beforeEach(() => {
          expectedValue = {
            ...props.value,
            department: null,
            subDepartment: null,
          }
          departmentSelect.simulate('change', eventValue)
        })

        test('should call props.onChange with expectedValue', () => {
          // clears department and subDepartment
          chai.expect(props.onChange).to.have.beenCalledWith(expectedValue)
        })
      })

      describe('when triggering onChange with {formIsOpen: false}', () => {
        const eventValue = { formIsOpen: false }
        let expectedValue

        beforeEach(() => {
          expectedValue = {
            ...props.value,
            department: eventValue,
            subDepartment: null,
          }
          departmentSelect.simulate('change', eventValue)
        })

        test('should call props.onChange with expectedValue', () => {
          // clears subDepartment and sets department
          chai.expect(props.onChange).to.have.beenCalledWith(expectedValue)
        })
      })

      describe('when triggering onChange with {formIsOpen: true}', () => {
        const eventValue = { formIsOpen: true }
        let expectedValue

        beforeEach(() => {
          expectedValue = {
            ...props.value,
            department: eventValue,
            subDepartment: 'subDepartment',
          }
          departmentSelect.simulate('change', eventValue)
        })

        test('should call props.onChange with expectedValue', () => {
          // does NOT clear subDepartment and sets department
          chai.expect(props.onChange).to.have.beenCalledWith(expectedValue)
        })
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
        subDepartmentSelect.should.exist
      })

      test('options should be predetermined subDepartmentOption', () => {
        const expectedProps = {
          options: subDepartmentOption,
          value: props.value.subDepartment,
          allowReset: true,
        }

        subDepartmentSelect.props().should.include(expectedProps)
      })

      describe('when triggering onChange with empty string', () => {
        const eventValue = ''

        beforeEach(() => {
          subDepartmentSelect.simulate('change', eventValue)
        })

        test('should call props.onChange with expectedValue', () => {
          const expectedValue = {
            ...props.value,
            subDepartment: '',
          }
          chai.expect(props.onChange).to.have.beenCalledWith(expectedValue)
        })
      })

      describe('when triggering onChange with any other value', () => {
        const eventValue = { formIsOpen: false }

        beforeEach(() => {
          subDepartmentSelect.simulate('change', eventValue)
        })

        test('should call props.onChange with expectedValue', () => {
          const expectedValue = {
            ...props.value,
            subDepartment: eventValue,
          }

          chai.expect(props.onChange).to.have.beenCalledWith(expectedValue)
        })
      })
    })
  })
})
