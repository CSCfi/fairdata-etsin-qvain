import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

import AuthClass from '../../../js/stores/domain/auth'
import EnvClass from '../../../js/stores/domain/env'

const Auth = new AuthClass(new EnvClass())

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios)

const mockUser = {
  is_authenticated: true,
  is_authenticated_CSC_user: true,
  home_organization_id: 'example.com/org',
  home_organization_name: 'organisaatio',
  user_ida_projects: ['IDA:project_x', 'IDA:project_y'],
  is_using_rems: true,
  user_csc_name: 'Testi Käyttäjä',
}

describe('Auth Store', () => {
  // catch logged errors instead of printing
  let errorSpy

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockReturnValue()
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
    expect(Auth.userLogged).toBe(true)
  })

  it('Should have user data', async () => {
    await Auth.checkLogin()
    expect(Auth.user).toEqual(
      expect.objectContaining({
        name: 'Testi Käyttäjä',
        loggedIn: true,
        homeOrganizationId: 'example.com/org',
        idaProjects: ['IDA:project_x', 'IDA:project_y'],
        isUsingRems: true,
      })
    )
  })

  it('Should fail to login without organization id', async () => {
    const user = { ...mockUser, home_organization_id: undefined }
    mock.onGet('/api/user').reply(200, user)
    await Auth.checkLogin()
    expect(Auth.userLogged).toBe(false)
  })

  it('Should logout with logout()', async () => {
    mock.onDelete('/api/session').reply(200)
    await Auth.checkLogin()
    expect(Auth.userLogged).toBe(true)
    await Auth.logout()
    expect(Auth.userLogged).toBe(false)
  })

  it('Should not logout with logout() error', async () => {
    mock.onDelete('/api/session').reply(401)
    await Auth.checkLogin()
    expect(Auth.userLogged).toBe(true)
    try {
      await Auth.logout()
    } catch {
      // pass
    }
    expect(errorSpy.mock.calls.length).toBe(1)
    expect(Auth.userLogged).toBe(true)
  })
})
