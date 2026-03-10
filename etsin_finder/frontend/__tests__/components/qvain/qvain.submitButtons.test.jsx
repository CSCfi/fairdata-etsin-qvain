import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import ReactModal from 'react-modal'

import etsinTheme from '@/styles/theme'
import SubmitButtons from '@/components/qvain/views/headers/submitButtons'
import { useStores } from '@/stores/stores'

ReactModal.setAppElement(document.createElement('div'))

vi.mock('@/stores/stores', async () => {
  const actual = await vi.importActual('@/stores/stores')
  return {
    ...actual,
    useStores: vi.fn(),
  }
})

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  }
})

vi.mock('@/utils/Translate', () => ({
  __esModule: true,
  default: ({ content, component: Component = 'span' }) => <Component>{content}</Component>,
}))

const createStores = (overrides = {}) => {
  const matomo = {
    recordEvent: vi.fn(),
    ...(overrides.Matomo || {}),
  }

  const qvainDefaults = {
    Submit: {
      submitDraft: vi.fn(),
      submitPublish: vi.fn(),
      draftValidationError: { errors: [] },
      publishValidationError: { errors: [] },
      prevalidate: vi.fn(),
      isDraftButtonDisabled: false,
      isPublishButtonDisabled: false,
      ...(overrides.Qvain?.Submit || {}),
    },
    original: {
      identifier: '123',
      metadata_owner_admin_org: 'org-1',
      ...(overrides.Qvain?.original || {}),
    },
    readonly: false,
    hasApprovedREMSApplications: false,
    publishWillChangeREMSLicenses: false,
    remsApplicationCounts: { approved: 0 },
    userIsQvainAdmin: false,
    AdminOrg: {
      selectedAdminOrg: { value: 'org-1' },
      adminOrgs: [],
      ...(overrides.Qvain?.AdminOrg || {}),
    },
    ...(overrides.Qvain || {}),
  }

  const stores = {
    Qvain: qvainDefaults,
    Env: {
      getQvainUrl: path => path,
      ...(overrides.Env || {}),
    },
    QvainDatasets: {
      publishedDataset: null,
      setPublishedDataset: vi.fn(),
      ...(overrides.QvainDatasets || {}),
    },
    Matomo: matomo,
    Locale: {
      translate: key => {
        switch (key) {
          case 'qvain.saveDraft':
            return 'Save as draft'
          case 'qvain.submit':
            return 'Save and Publish'
          case 'qvain.common.cancel':
            return 'Cancel'
          case 'qvain.common.close':
            return 'Close'
          default:
            return key
        }
      },
      ...(overrides.Locale || {}),
    },
    ...(overrides.rest || {}),
  }

  return stores
}

const renderSubmitButtons = stores => {
  useStores.mockReturnValue(stores)

  return render(
    <ThemeProvider theme={etsinTheme}>
      <SubmitButtons submitButtonsRef={null} idSuffix="" disabled={false} />
    </ThemeProvider>
  )
}

describe('SubmitButtons confirmation modal', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('opens confirm modal for REMS license changes when publishing and uses publish text', async () => {
    const stores = createStores({
      Qvain: {
        hasApprovedREMSApplications: true,
        publishWillChangeREMSLicenses: true,
        remsApplicationCounts: { approved: 2 },
      },
    })

    renderSubmitButtons(stores)

    const user = userEvent.setup()
    const publishButton = screen.getByRole('button', { name: 'Save and Publish' })
    await user.click(publishButton)

    expect(
      screen.getByText('qvain.submitConfirm.remsLicenseChange', { exact: false })
    ).toBeInTheDocument()

    const dialog = screen.getByRole('dialog', { name: 'confirm-submit' })
    const confirmButton = within(dialog).getByRole('button', { name: 'Save and Publish' })
    await user.click(confirmButton)

    expect(stores.Qvain.Submit.submitPublish).toHaveBeenCalledTimes(1)
    const [callback] = stores.Qvain.Submit.submitPublish.mock.calls[0]
    expect(typeof callback).toBe('function')
    expect(stores.Matomo.recordEvent).toHaveBeenCalledWith('PUBLISH / 123')
  })

  it('opens confirm modal for REMS org changes when publishing', async () => {
    const stores = createStores({
      Qvain: {
        hasApprovedREMSApplications: true,
        publishWillChangeREMSLicenses: false,
        userIsQvainAdmin: false,
        remsApplicationCounts: { approved: 2 },
        AdminOrg: {
          selectedAdminOrg: { value: 'org-2' },
          adminOrgs: [],
        },
      },
    })
    renderSubmitButtons(stores)

    const user = userEvent.setup()
    const publishButton = screen.getByRole('button', { name: 'Save and Publish' })
    await user.click(publishButton)

    expect(
      screen.getByText('qvain.submitConfirm.changedREMSOrg', { exact: false })
    ).toBeInTheDocument()

    const dialog = screen.getByRole('dialog', { name: 'confirm-submit' })
    const confirmButton = within(dialog).getByRole('button', { name: 'Save and Publish' })
    await user.click(confirmButton)

    expect(stores.Qvain.Submit.submitPublish).toHaveBeenCalledTimes(1)
    const [callback] = stores.Qvain.Submit.submitPublish.mock.calls[0]
    expect(typeof callback).toBe('function')
    expect(stores.Matomo.recordEvent).toHaveBeenCalledWith('PUBLISH / 123')
  })

  it('opens confirm modal for admin org change when saving draft and uses draft text', async () => {
    const stores = createStores({
      Qvain: {
        userIsQvainAdmin: true,
        AdminOrg: {
          selectedAdminOrg: { value: 'org-2' },
          adminOrgs: [],
        },
      },
    })

    renderSubmitButtons(stores)

    const user = userEvent.setup()
    const draftButton = screen.getByRole('button', { name: 'Save as draft' })
    await user.click(draftButton)

    expect(
      screen.getByText('qvain.submitConfirm.changedAdminOrg', { exact: false })
    ).toBeInTheDocument()

    const dialog = screen.getByRole('dialog', { name: 'confirm-submit' })
    const confirmButton = within(dialog).getByRole('button', { name: 'Save as draft' })
    await user.click(confirmButton)

    expect(stores.Qvain.Submit.submitDraft).toHaveBeenCalledTimes(1)
    const [callback] = stores.Qvain.Submit.submitDraft.mock.calls[0]
    expect(typeof callback).toBe('function')
    expect(stores.Matomo.recordEvent).toHaveBeenCalledWith('DRAFT / 123')
  })

  it('shows REMS confirmations first and then admin org confirmations when all are required for publish', async () => {
    const stores = createStores({
      Qvain: {
        hasApprovedREMSApplications: true,
        publishWillChangeREMSLicenses: true,
        userIsQvainAdmin: true,
        remsApplicationCounts: { approved: 5 },
        AdminOrg: {
          selectedAdminOrg: { value: 'org-2' },
          adminOrgs: [],
        },
      },
    })

    renderSubmitButtons(stores)

    const user = userEvent.setup()
    const publishButton = screen.getByRole('button', { name: 'Save and Publish' })
    await user.click(publishButton)

    // First confirmation: REMS license change
    expect(
      screen.getByText('qvain.submitConfirm.remsLicenseChange', { exact: false })
    ).toBeInTheDocument()

    let dialog = screen.getByRole('dialog', { name: 'confirm-submit' })
    let confirmButton = within(dialog).getByRole('button', { name: 'Save and Publish' })
    await user.click(confirmButton)

    // Second confirmation: REMS license change
    expect(
      screen.getByText('qvain.submitConfirm.changedREMSOrg', { exact: false })
    ).toBeInTheDocument()

    dialog = screen.getByRole('dialog', { name: 'confirm-submit' })
    confirmButton = within(dialog).getByRole('button', { name: 'Save and Publish' })
    await user.click(confirmButton)

    // Third confirmation: admin org change
    expect(
      screen.getByText('qvain.submitConfirm.changedAdminOrg', { exact: false })
    ).toBeInTheDocument()

    dialog = screen.getByRole('dialog', { name: 'confirm-submit' })
    confirmButton = within(dialog).getByRole('button', { name: 'Save and Publish' })
    await user.click(confirmButton)

    expect(stores.Qvain.Submit.submitPublish).toHaveBeenCalledTimes(1)
    const [callback] = stores.Qvain.Submit.submitPublish.mock.calls[0]
    expect(typeof callback).toBe('function')
    expect(stores.Matomo.recordEvent).toHaveBeenCalledWith('PUBLISH / 123')
  })

  it('does not submit when confirmation is cancelled', async () => {
    const stores = createStores({
      Qvain: {
        hasApprovedREMSApplications: true,
        publishWillChangeREMSLicenses: true,
        remsApplicationCounts: { approved: 1 },
      },
    })

    renderSubmitButtons(stores)

    const user = userEvent.setup()
    const publishButton = screen.getByRole('button', { name: 'Save and Publish' })
    await user.click(publishButton)

    const dialog = screen.getByRole('dialog', { name: 'confirm-submit' })
    const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    expect(stores.Qvain.Submit.submitPublish).not.toHaveBeenCalled()
    expect(stores.Qvain.Submit.submitDraft).not.toHaveBeenCalled()
  })
})
