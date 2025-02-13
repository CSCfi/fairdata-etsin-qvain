import React from 'react'
import { mount } from 'enzyme'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { configure } from 'mobx'
import Select from 'react-select'

import AccessType from '@/components/qvain/sections/DataOrigin/general/AccessRights/AccessType'
import { ACCESS_TYPE_URL } from '@/utils/constants'
import { buildStores } from '@/stores'
import { onChange } from '@/components/qvain/utils/select'

import accessTypeResponse from '../../__testdata__/accessTypes.data'
import { StoresProvider } from '../../../js/stores/stores'

configure({
  safeDescriptors: false,
})

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet().reply(200, accessTypeResponse)

jest.mock('@/components/qvain/utils/select', () => {
  const actual = jest.requireActual('@/components/qvain/utils/select')
  return {
    ...actual,
    onChange: jest.fn(() => () => {}),
  }
})

describe('Qvain Access Type', () => {
  let Stores, Auth, Qvain
  let component

  const getOptions = () => {
    component.update()
    return component.find('Select').first().prop('options')
  }

  beforeEach(() => {
    Stores = buildStores()
    Auth = Stores.Auth
    Qvain = Stores.Qvain
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const setAuthUserAndRender = (userSettings = {}) => {
    Auth.setUser({ ...Auth.user, ...userSettings })
    component = mount(
      <StoresProvider store={Stores}>
        <AccessType />
      </StoresProvider>
    )
  }

  describe('given AccessType is OPEN and isUsingRems is false ', () => {
    beforeEach(() => {
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.OPEN })
      setAuthUserAndRender({ isUsingRems: false })
    })

    it('restricts which access types are shown', async () => {
      const options = getOptions()
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
      const options = getOptions()
      expect(options.length).toBe(5)
      expect(options.filter(opt => opt.url === ACCESS_TYPE_URL.PERMIT).length).toBe(1)
    })

    it('renders permitInfo', () => {
      const permitInfo = component.find({
        content: 'qvain.rightsAndLicenses.accessType.permitInfo',
      })
      expect(permitInfo.exists()).toBe(true)
    })
  })

  describe('given AccessType is Permit and isUsingRems is true', () => {
    beforeEach(async () => {
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.PERMIT })
      await setAuthUserAndRender({ isUsingRems: true })
    })

    it('shows all access type options', async () => {
      const options = getOptions()
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
      select = component.find(Select).find('input#accessTypeSelect')
    })

    describe('when triggering onChange', () => {
      beforeEach(() => {
        component.find('Select').instance().selectOption({ label: '...', value: 50 })
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
