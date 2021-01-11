import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

import Auth from '../../../js/stores/domain/auth'

global.Promise = require('bluebird')
Promise.config({
  cancellation: true,
})

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
        homeOrganizationName: 'organisaatio',
        idaProjects: ['IDA:project_x', 'IDA:project_y'],
        isUsingRems: true,
      })
    )
  })
  it('Should fail to login without CSC user id', async () => {
    const user = { ...mockUser, is_authenticated_CSC_user: false }
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
    } catch {}
    expect(errorSpy.mock.calls.length).toBe(1)
    expect(Auth.userLogged).toBe(true)
  })
  it('Login renewal error should clear login', async () => {
    mock.onGet('/api/session').reply(401)
    await Auth.checkLogin()
    expect(Auth.userLogged).toBe(true)
    try {
      await Auth.renewSession()
    } catch {}
    expect(Auth.userLogged).toBe(false)
  })
  it('Login renewal error should clear user', async () => {
    mock.onGet('/api/session').reply(401)
    await Auth.checkLogin()
    expect(Auth.userLogged).toBe(true)
    try {
      await Auth.renewSession()
    } catch {}
    expect(Auth.user).toEqual({
      name: undefined,
      loggedIn: false,
      homeOrganizationName: undefined,
      idaProjects: [],
      isUsingRems: undefined,
    })
  })
})
