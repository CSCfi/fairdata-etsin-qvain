import React from 'react'
import { shallow } from 'enzyme'
import axios from 'axios'
import { configure } from 'mobx'

import '../../../locale/translations'
import { AccessType } from '../../../js/components/qvain/fields/licenses/accessType'
import { ACCESS_TYPE_URL } from '../../../js/utils/constants'
import { buildStores } from '../../../js/stores'
import accessTypeResponse from '../../__testdata__/accessTypes.data'
import { onChange } from '../../../js/components/qvain/utils/select'

configure({
  safeDescriptors: false,
})

jest.mock('axios')

jest.mock('../../../js/components/qvain/utils/select', () => {
  const actual = jest.requireActual('../../../js/components/qvain/utils/select')
  return {
    ...actual,
    onChange: jest.fn(() => () => {}),
  }
})

describe('Qvain Access Type', () => {
  let Stores, Auth, Qvain
  let component, options

  beforeEach(() => {
    Stores = buildStores()
    Auth = Stores.Auth
    Qvain = Stores.Qvain
    axios.get.mockReturnValueOnce(Promise.resolve({ data: accessTypeResponse }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const setAuthUserAndRender = async (userSettings = {}) => {
    Auth.setUser({ ...Auth.user, ...userSettings })
    component = shallow(<AccessType Stores={Stores} />)
    await Promise.resolve()
    options = component.instance().state.options
  }

  describe('given AccessType is OPEN and isUsingRems is false ', () => {
    beforeEach(async () => {
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.OPEN })
      await setAuthUserAndRender({ isUsingRems: false })
    })

    it('restricts which access types are shown', async () => {
      expect(options.length).toBe(4)
      expect(options.filter(opt => opt.url === ACCESS_TYPE_URL.PERMIT).length).toBe(0)
    })

    it('should not render RestrictionGrounds', () => {
      const restrictionGrounds = component.find('RestrictionGrounds')
      expect(restrictionGrounds.exists()).toBe(false)
    })
  })

  describe('given AccessType is Permit but isUsingRems is false', () => {
    beforeEach(async () => {
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.PERMIT })
      await setAuthUserAndRender({ isUsingRems: false })
    })

    it('always allows the current access type', async () => {
      expect(options.length).toBe(5)
      expect(options.filter(opt => opt.url === ACCESS_TYPE_URL.PERMIT).length).toBe(1)
    })

    it('renders permitInfo', () => {
      const permitInfo = component.find('accessType__PermitHelp')
      expect(permitInfo.exists()).toBe(true)
    })
  })

  describe('given AccessType is Permit and isUsingRems is true', () => {
    beforeEach(async () => {
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.PERMIT })
      await setAuthUserAndRender({ isUsingRems: true })
    })

    it('shows all access type options', async () => {
      expect(options.length).toBe(5)
      expect(options.filter(opt => opt.url === ACCESS_TYPE_URL.PERMIT).length).toBe(1)
    })
  })

  describe('given AccesType is EMBARGO', () => {
    beforeEach(async () => {
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.EMBARGO })
      await setAuthUserAndRender()
    })

    it('renders EmbargoExpires', () => {
      const embargoExp = component.find('EmbargoExpires')
      expect(embargoExp.exists()).toBe(true)
    })
  })

  describe('Select', () => {
    let select

    beforeEach(async () => {
      Qvain.AccessType.setValidationError = jest.fn()
      Qvain.AccessType.validate = jest.fn()
      await setAuthUserAndRender()
      select = component.find('Translate').at(1) // aka Select
    })

    describe('when triggering onChange', () => {
      beforeEach(() => {
        select.simulate('change')
      })

      it('should call onChange', () => {
        expect(onChange).toHaveBeenCalled()
      })

      it('should call setValidationError with null', () => {
        expect(Qvain.AccessType.setValidationError).toHaveBeenCalledWith(null)
      })
    })

    describe('when triggering onBlur', () => {
      beforeEach(() => {
        select.simulate('blur')
      })

      it('should call validate', () => {
        expect(Qvain.AccessType.validate).toHaveBeenCalled()
      })
    })
  })
})
