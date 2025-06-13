/* eslint-disable testing-library/no-render-in-lifecycle */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { configure } from 'mobx'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

  const getOptions = async () => {
    await userEvent.click(screen.getByLabelText('Access Type'))
    return screen.getAllByRole('option').map(o => o.textContent)
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
    render(
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
      const options = await getOptions()
      expect(options.length).toBe(4)
      expect(options.filter(opt => opt.includes('permission')).length).toBe(0)
    })

    it('should not render RestrictionGrounds', () => {
      expect(screen.queryByLabelText('Restriction Grounds')).not.toBeInTheDocument()
    })
  })

  describe('given AccessType is Permit but isUsingRems is false', () => {
    beforeEach(async () => {
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.PERMIT })
      setAuthUserAndRender({ isUsingRems: false })
    })

    it('always allows the current access type', async () => {
      const options = await getOptions()
      expect(options.length).toBe(5)
      expect(options.filter(opt => opt.includes('permission')).length).toBe(1)
      expect(screen.getByLabelText('Restriction Grounds')).toBeInTheDocument()
    })

    it('renders permitInfo', () => {
      expect(screen.getByTestId('permit-help')).toBeInTheDocument()
    })
  })

  describe('given AccessType is Permit and isUsingRems is true', () => {
    beforeEach(async () => {
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.PERMIT })
      setAuthUserAndRender({ isUsingRems: true })
    })

    it('shows all access type options', async () => {
      const options = await getOptions()
      expect(options.length).toBe(5)
      expect(options.filter(opt => opt.includes('permission')).length).toBe(1)
    })
  })

  describe('given AccesType is EMBARGO', () => {
    beforeEach(async () => {
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.EMBARGO })
      setAuthUserAndRender()
    })

    it('renders EmbargoExpires', () => {
      expect(screen.getByLabelText('Embargo expiration date')).toBeInTheDocument()
    })
  })

  describe('Select', () => {
    beforeEach(async () => {
      Qvain.AccessType.setValidationError = jest.fn()
      Qvain.AccessType.validate = jest.fn()
      setAuthUserAndRender()
    })

    it('should call onChange', async () => {
      await userEvent.click(screen.getByLabelText('Access Type'))
      await userEvent.click(screen.getAllByRole('option')[0])
      expect(onChange).toHaveBeenCalled()
      expect(Qvain.AccessType.setValidationError).toHaveBeenCalledWith(null)
    })

    it('should validate on blur', async () => {
      await userEvent.click(screen.getByLabelText('Access Type'))
      await userEvent.click(document.body)
      expect(Qvain.AccessType.validate).toHaveBeenCalled()
    })
  })
})
