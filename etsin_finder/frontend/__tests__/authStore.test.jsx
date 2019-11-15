import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

import Auth from '../js/stores/domain/auth'

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios)

describe('Auth Store', () => {
  mock
    .onGet('/api/user')
    .reply(200, { is_authenticated: true })

  it('Should be logged in', () => {
    Auth.checkLogin().then(() => {
      expect(Auth.userLogged).toEqual(true)
    })
  })
  it('Should have name and id', () => {
    Auth.checkLogin().then(() => {
      expect(Auth.user.name).toEqual('Testi Käyttäjä')
    })
  })
  it('Should logout with logout()', () => {
    mock.onDelete('/api/session').reply(200)
    Auth.logout().then(() => {
      expect(Auth.userLogged).toEqual(false)
    })
  })
  it('Should not logout with logout() error', () => {
    mock.onDelete('/api/session').reply(401)
    Auth.checkLogin().then(() => {
      Auth.logout().catch(() => {
        expect(Auth.userLogged).toEqual(true)
      })
    })
  })
  it('Login renewal error should clear login', () => {
    mock.onGet('/api/session').reply(401)
    const test = Auth.renewSession()
    test.catch(() => {
      expect(Auth.userLogged).toEqual(false)
    })
  })
  it('Login renewal error should clear user', () => {
    mock.onGet('/api/session').reply(401)
    const test = Auth.renewSession()
    test.catch(() => {
      expect(Auth.user).toEqual({ id: undefined, name: undefined })
    })
  })
})
