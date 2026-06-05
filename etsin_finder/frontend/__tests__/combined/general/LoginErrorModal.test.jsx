import { ThemeProvider } from 'styled-components'
import ReactModal from 'react-modal'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import etsinTheme from '@/styles/theme'
import { StoresProvider } from '@/stores/stores'
import LoginErrorModal from '@/layout/LoginErrorModal'
import { buildStores } from '@/stores'

const mockAdapter = new MockAdapter(axios)

const mockLocation = {
  pathname: '/',
}

const unauthenticated = {
  is_authenticated: false,
  organization: null,
  csc_projects: [],
}

const authenticated = {
  is_authenticated: true,
  organization: 'csc.fi',
  csc_projects: ['test_project'],
  username: 'masa',
  first_name: 'Matti',
  last_name: 'Tepponen',
}

const noUserName = { detail: 'Missing user identifier.', code: 'missing_fairdata_user_id' }

const noOrganizationId = { detail: 'Missing organization', code: 'missing_organization_id' }

beforeEach(() => {
  mockAdapter.reset()
})

describe('Etsin frontpage', () => {
  let helper

  const renderModal = async () => {
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)
    const stores = buildStores()
    await stores.Auth.checkLogin()

    render(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <main>
            <LoginErrorModal data-testid="modal" location={mockLocation} />
          </main>
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )
  }
  beforeAll(async () => {})

  it('should not show modal for successful login', async () => {
    mockAdapter.onGet().reply(200, authenticated)
    await renderModal()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should not show modal for unauthenticated user', async () => {
    mockAdapter.onGet().reply(200, unauthenticated)
    await renderModal()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should show modal for login with missing username', async () => {
    mockAdapter.onGet().reply(403, noUserName)
    await renderModal()
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveTextContent('Please make sure that you have a valid CSC account.')
  })

  it('should show modal for login with missing home organization', async () => {
    mockAdapter.onGet().reply(403, noOrganizationId)
    await renderModal()
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveTextContent('your account does not seem to have a home organization')
  })

  it('should delete session when modal is closed', async () => {
    mockAdapter.onDelete().reply(200, '')
    mockAdapter.onGet().reply(403, noOrganizationId)
    await renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockAdapter.history.delete).toHaveLength(1)
  })

  afterEach(() => {
    document.body.removeChild(helper)
  })
})
