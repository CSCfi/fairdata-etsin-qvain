/* eslint-disable testing-library/no-render-in-lifecycle */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { configure } from 'mobx'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AccessType from '@/components/qvain/sections/DataOrigin/general/AccessRights/AccessType'
import { ACCESS_TYPE_URL, DATA_CATALOG_IDENTIFIER } from '@/utils/constants'
import { buildStores } from '@/stores'
import { onChange } from '@/components/qvain/utils/select'

import { access_types as accessTypes } from '@testdata/metaxv3/refs/access_rights.data'
import { data_catalog_ida as idaCatalog } from '@testdata/metaxv3/refs/data_catalogs.data'
import { StoresProvider } from '@/stores/stores'

configure({
  safeDescriptors: false,
})

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet().reply(200, accessTypes)

vi.mock('@/components/qvain/utils/select', async () => {
  const actual = await vi.importActual('@/components/qvain/utils/select')
  return {
    ...actual,
    onChange: vi.fn(() => () => {}),
  }
})

describe('Qvain Access Type', () => {
  let Stores, Qvain

  const getOptions = async () => {
    await userEvent.click(screen.getByLabelText(/Access Type/))
    return screen.getAllByRole('option').map(o => o.textContent)
  }

  beforeEach(() => {
    Stores = buildStores()
    Qvain = Stores.Qvain
    Qvain.Env.Flags.setFlag('QVAIN.METAX_V3', true)
    Qvain.dataCatalogConfigs[idaCatalog.id] = { ...idaCatalog }
    Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.IDA)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderAccessType = () => {
    render(
      <StoresProvider store={Stores}>
        <AccessType />
      </StoresProvider>
    )
  }

  describe('given AccessType is OPEN and QVAIN.REMS is false ', () => {
    beforeEach(() => {
      Stores.Env.Flags.setFlag('QVAIN.REMS', false)
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.OPEN })
      renderAccessType()
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

  describe('given AccessType is OPEN and QVAIN.REMS is true ', () => {
    beforeEach(() => {
      Stores.Env.Flags.setFlag('QVAIN.REMS', true)
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.OPEN })
      renderAccessType()
    })

    it('all access types are shown', async () => {
      const options = await getOptions()
      expect(options.length).toBe(5)
      expect(options.filter(opt => opt.includes('permission')).length).toBe(1)
    })
  })

  describe('given AccessType is OPEN and catalog has rems_enabled=false ', () => {
    beforeEach(() => {
      Stores.Env.Flags.setFlag('QVAIN.REMS', true)
      Qvain.dataCatalogConfigs[idaCatalog.id].rems_enabled = false
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.OPEN })
      renderAccessType()
    })

    it('restricts which access types are shown', async () => {
      const options = await getOptions()
      expect(options.length).toBe(4)
      expect(options.filter(opt => opt.includes('permission')).length).toBe(0)
    })
  })

  describe('given AccessType is Permit but QVAIN.REMS is false', () => {
    beforeEach(async () => {
      Stores.Env.Flags.setFlag('QVAIN.REMS', false)
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.PERMIT })
      renderAccessType()
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

  describe('given AccesType is EMBARGO', () => {
    beforeEach(async () => {
      Qvain.AccessType.set({ url: ACCESS_TYPE_URL.EMBARGO })
      renderAccessType()
    })

    it('renders EmbargoExpires', () => {
      expect(screen.getByLabelText('Embargo expiration date')).toBeInTheDocument()
    })
  })

  describe('Select', () => {
    beforeEach(async () => {
      Qvain.AccessType.setValidationError = vi.fn()
      Qvain.AccessType.validate = vi.fn()
      renderAccessType()
    })

    it('should call onChange', async () => {
      await userEvent.click(screen.getByLabelText(/Access Type/))
      await userEvent.click(screen.getAllByRole('option')[0])
      expect(onChange).toHaveBeenCalled()
      expect(Qvain.AccessType.setValidationError).toHaveBeenCalledWith(null)
    })

    it('should validate on blur', async () => {
      await userEvent.click(screen.getByLabelText(/Access Type/))
      await userEvent.click(document.body)
      expect(Qvain.AccessType.validate).toHaveBeenCalled()
    })
  })
})
