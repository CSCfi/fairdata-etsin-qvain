import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import etsinTheme from '@/styles/theme'
import OwnerBanner from '@/components/qvain/sections/OwnerBanner'
import { useStores } from '@/stores/stores'

vi.mock('@/stores/stores', async () => {
  const actual = await vi.importActual('@/stores/stores')
  return {
    ...actual,
    useStores: vi.fn(),
  }
})

vi.mock('@/utils/Translate', () => ({
  __esModule: true,
  default: ({ content, component: Component = 'span' }) => <Component>{content}</Component>,
}))

const renderOwnerBanner = ({ userRoles } = {}) => {
  useStores.mockReturnValue({
    Qvain: {
      original: {
        user_roles: userRoles,
      },
    },
    Auth: {
      userName: 'test-user',
      user: {},
    },
  })

  return render(
    <ThemeProvider theme={etsinTheme}>
      <OwnerBanner />
    </ThemeProvider>
  )
}

describe('OwnerBanner', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows banner when user has only organization_admin role', () => {
    renderOwnerBanner({ userRoles: ['organization_admin'] })

    expect(screen.getByText('qvain.ownerBanner.adminOrg')).toBeInTheDocument()
  })

  it('does not show banner when user has additional roles', () => {
    renderOwnerBanner({ userRoles: ['organization_admin', 'editor'] })

    expect(screen.queryByText('qvain.ownerBanner.adminOrg')).not.toBeInTheDocument()
  })

  it('does not show banner when user does not have organization_admin role', () => {
    renderOwnerBanner({ userRoles: ['editor'] })

    expect(screen.queryByText('qvain.ownerBanner.adminOrg')).not.toBeInTheDocument()
  })

  it('does not show banner when user roles are missing', () => {
    renderOwnerBanner()

    expect(screen.queryByText('qvain.ownerBanner.adminOrg')).not.toBeInTheDocument()
  })
})

