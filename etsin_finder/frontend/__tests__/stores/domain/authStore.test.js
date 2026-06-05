import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

import AuthClass from '../../../js/stores/domain/auth'
import EnvClass from '../../../js/stores/domain/env'

const Auth = new AuthClass(new EnvClass())

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios)

const mockUser = {
  is_authenticated: true,
  organization: 'example.com/org',
  csc_projects: ['project_x', 'project_y'],
  username: 'test_user',
  admin_organizations: [],
}

describe('Auth Store', () => {
  // catch logged errors instead of printing
  let errorSpy

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockReturnValue()
    mock.reset()
    mock.onGet('https:///v3/auth/user').reply(200, mockUser)
    mock.onGet('/api/user').reply(200, mockUser)
    Auth.reset()
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  it('Should be logged in', async () => {
    await Auth.checkLogin()
    expect(Auth.isAuthenticated).toBe(true)
  })

  it('Should have user data', async () => {
    await Auth.checkLogin()
    expect(Auth.user).toEqual(
      expect.objectContaining({
        name: 'test_user',
        isAuthenticated: true,
        homeOrganizationId: 'example.com/org',
        idaProjects: ['project_x', 'project_y'],
      })
    )
  })

  it('Should logout with logout()', async () => {
    mock.onDelete('/api/session').reply(200)
    await Auth.checkLogin()
    expect(Auth.isAuthenticated).toBe(true)
    await Auth.logout()
    expect(Auth.isAuthenticated).toBe(false)
  })

  it('Should not logout with logout() error', async () => {
    mock.onDelete('/api/session').reply(401)
    await Auth.checkLogin()
    expect(Auth.isAuthenticated).toBe(true)
    try {
      await Auth.logout()
    } catch {
      // pass
    }
    expect(errorSpy.mock.calls.length).toBe(1)
    expect(Auth.isAuthenticated).toBe(true)
  })
})
