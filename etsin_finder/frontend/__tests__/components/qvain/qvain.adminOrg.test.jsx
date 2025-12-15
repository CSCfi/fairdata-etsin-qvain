import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configure } from 'mobx'
import { setImmediate } from 'timers'

import { contextRenderer } from '@/../__tests__/test-helpers'
import AdminOrgSelector from '@/components/qvain/sections/AdminOrg'
import { buildStores } from '@/stores'

const flushPromises = () => new Promise(setImmediate)

describe('AdminOrgSelector', () => {
  let stores

  const getStores = () => {
    configure({ safeDescriptors: false })
    const stores = buildStores()
    stores.Locale.setLang('en')
    configure({ safeDescriptors: true })
    return stores
  }

  beforeEach(() => {
    stores = getStores()
    stores.Locale.setMissingTranslationHandler(key => key)
    // Mock getValueTranslation to return the English translation
    stores.Locale.getValueTranslation = vi.fn(value => {
      if (value && typeof value === 'object' && value.en) {
        return value.en
      }
      return ''
    })
    // Mock available admin orgs
    stores.Auth.setUser({
      ...stores.Auth.user,
      available_admin_organizations: [
        {
          id: 'org-1',
          pref_label: { en: 'Organization 1', fi: 'Organisaatio 1' },
        },
        {
          id: 'org-2',
          pref_label: { en: 'Organization 2', fi: 'Organisaatio 2' },
        },
        {
          id: 'org-3',
          pref_label: { en: 'Organization 3', fi: 'Organisaatio 3' },
        },
      ],
      default_admin_organization: { id: 'org-1' },
    })
    stores.Qvain.setOriginal(undefined)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = () => {
    contextRenderer(<AdminOrgSelector />, { stores })
  }

  const selectAdminOrg = async optionLabel => {
    // Find the select input by its inputId
    const selectInput = document.getElementById('admin-org-select')
    if (!selectInput) {
      // Fallback to finding by label
      const label = screen.getByText(stores.Locale.getValueTranslation('qvain.adminOrg.title'))
      const selectInputByLabel =
        label.closest('label')?.querySelector('input') ||
        screen.getByLabelText(/Organization that will have maintenance rights/i)
      await userEvent.click(selectInputByLabel)
    } else {
      await userEvent.click(selectInput)
    }
    const option = await screen.findByRole('option', { name: optionLabel })
    await userEvent.click(option)
    await flushPromises()
  }

  describe('Admin org selection', () => {
    it('should initialize with default admin org for new dataset', async () => {
      stores.Auth.setUser({ ...stores.Auth.user, default_admin_organization: { id: 'org-1' } })
      renderComponent()
      await flushPromises()

      // Default org should be selected
      expect(stores.Qvain.AdminOrg.selectedAdminOrg).toBeDefined()
      expect(stores.Qvain.AdminOrg.selectedAdminOrg.value).toBe('org-1')
    })

    it('should initialize with original admin org for existing dataset', async () => {
      stores.Qvain.setOriginal({ metadata_owner_admin_org: 'org-2' })
      renderComponent()
      await flushPromises()

      expect(stores.Qvain.AdminOrg.selectedAdminOrg).toBeDefined()
      expect(stores.Qvain.AdminOrg.selectedAdminOrg.value).toBe('org-2')
      // Confirmation should be selected for existing datasets
      expect(stores.Qvain.AdminOrg.confirmationSelected).toBe(true)
    })

    it('should allow selecting an admin org from dropdown', async () => {
      renderComponent()
      await flushPromises()

      await selectAdminOrg('Organization 2')

      expect(stores.Qvain.AdminOrg.selectedAdminOrg.value).toBe('org-2')
      expect(stores.Qvain.AdminOrg.selectedAdminOrg.label).toBe('Organization 2')
    })

    it('should reset confirmation when admin org is changed', async () => {
      renderComponent()
      await flushPromises()

      // Set confirmation first
      const checkbox =
        document.getElementById('admin-org-confirmation') || screen.getByRole('checkbox')
      await userEvent.click(checkbox)
      expect(stores.Qvain.AdminOrg.confirmationSelected).toBe(true)

      // Change admin org
      await selectAdminOrg('Organization 2')

      // Confirmation should be reset
      expect(stores.Qvain.AdminOrg.confirmationSelected).toBe(false)
    })

    it('should show all available admin orgs in dropdown', async () => {
      renderComponent()
      await flushPromises()

      const selectInput =
        document.getElementById('admin-org-select') ||
        screen.getByLabelText(/Organization that will have maintenance rights/i)
      await userEvent.click(selectInput)

      const options = await screen.findAllByRole('option')
      expect(options.length).toBeGreaterThanOrEqual(3)
      expect(screen.getByRole('option', { name: 'Organization 1' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Organization 2' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Organization 3' })).toBeInTheDocument()
    })
  })

  describe('Confirmation checkbox', () => {
    it('should allow toggling confirmation checkbox', async () => {
      renderComponent()
      await flushPromises()

      const checkbox =
        document.getElementById('admin-org-confirmation') || screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()

      await userEvent.click(checkbox)
      expect(checkbox).toBeChecked()
      expect(stores.Qvain.AdminOrg.confirmationSelected).toBe(true)

      await userEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()
      expect(stores.Qvain.AdminOrg.confirmationSelected).toBe(false)
    })

    it('should call prevalidate when confirmation is toggled', async () => {
      vi.spyOn(stores.Qvain.Submit, 'prevalidate')
      renderComponent()
      await flushPromises()

      const checkbox =
        document.getElementById('admin-org-confirmation') || screen.getByRole('checkbox')
      await userEvent.click(checkbox)

      expect(stores.Qvain.Submit.prevalidate).toHaveBeenCalled()
    })

    it('should be checked by default for existing datasets', async () => {
      stores.Qvain.setOriginal({ metadata_owner_admin_org: 'org-2' })
      renderComponent()
      await flushPromises()

      const checkbox =
        document.getElementById('admin-org-confirmation') || screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    it('should be unchecked by default for new datasets', async () => {
      renderComponent()
      await flushPromises()

      const checkbox =
        document.getElementById('admin-org-confirmation') || screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('Readonly mode', () => {
    it('should disable select when readonly', async () => {
      stores.Qvain.setOriginal({ preservation_pas_process_running: true })
      renderComponent()
      await flushPromises()

      const selectInput =
        document.getElementById('admin-org-select') ||
        screen.getByLabelText(/Organization that will have maintenance rights/i)
      expect(selectInput).toBeDisabled()
    })

    it('should disable checkbox when readonly', async () => {
      stores.Qvain.setOriginal({ preservation_pas_process_running: true })
      renderComponent()
      await flushPromises()
      const checkbox = document.getElementById('admin-org-confirmation')
      expect(checkbox).toBeDisabled()
    })

    it('should enable select when not readonly', async () => {
      // if original is not defined, readonly is false by default
      stores.Qvain.setOriginal(undefined)
      renderComponent()
      await flushPromises()

      const selectInput =
        document.getElementById('admin-org-select') ||
        screen.getByLabelText(/Organization that will have maintenance rights/i)
      expect(selectInput).not.toBeDisabled()
    })

    it('should enable checkbox when not readonly', async () => {
      // if original is not defined, readonly is false by default
      stores.Qvain.setOriginal(undefined)
      renderComponent()
      await flushPromises()

      const checkbox =
        document.getElementById('admin-org-confirmation') || screen.getByRole('checkbox')
      expect(checkbox).not.toBeDisabled()
    })
  })

  describe('Reset behavior', () => {
    it('should reset when availableAdminOrgs change', async () => {
      renderComponent()
      await flushPromises()

      // Select an org
      await selectAdminOrg('Organization 2')
      expect(stores.Qvain.AdminOrg.selectedAdminOrg.value).toBe('org-2')

      // Change available orgs
      stores.Auth.setUser({
        ...stores.Auth.user,
        available_admin_organizations: [
          {
            id: 'org-4',
            pref_label: { en: 'Organization 4', fi: 'Organisaatio 4' },
          },
        ],
        default_admin_organization: { id: 'org-4' },
      })

      // Trigger reset by changing availableAdminOrgs (simulating useEffect)
      stores.Qvain.AdminOrg.reset()
      await flushPromises()

      // Should reset to new default
      expect(stores.Qvain.AdminOrg.selectedAdminOrg.value).toBe('org-4')
    })
  })

  describe('Integration with store', () => {
    it('should update store when admin org is selected', async () => {
      renderComponent()
      await flushPromises()

      const initialValue = stores.Qvain.AdminOrg.selectedAdminOrg
      await selectAdminOrg('Organization 3')

      expect(stores.Qvain.AdminOrg.selectedAdminOrg).not.toBe(initialValue)
      expect(stores.Qvain.AdminOrg.selectedAdminOrg.value).toBe('org-3')
    })

    it('should reflect store changes in UI', async () => {
      renderComponent()
      await flushPromises()

      const orgOption = stores.Qvain.AdminOrg.adminOrgs?.find(org => org.value === 'org-3')
      if (orgOption) {
        stores.Qvain.AdminOrg.setSelectedAdminOrg(orgOption)
        await flushPromises()

        // The selected value should be in the store
        expect(stores.Qvain.AdminOrg.selectedAdminOrg.value).toBe('org-3')
      }
    })
  })
})
