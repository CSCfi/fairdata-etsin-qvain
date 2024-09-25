/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, computed, runInAction, makeObservable } from 'mobx'
import axios from 'axios'

class Auth {
  constructor(Env) {
    this.Env = Env
    makeObservable(this)
  }

  @observable interceptor = null

  @observable userLogged = false

  @observable cscUserLogged = false

  @observable loading = false

  @observable initializing = true

  @observable user = {
    name: undefined,
    firstName: undefined,
    lastName: undefined,
    loggedIn: false,
    homeOrganizationId: undefined,
    idaProjects: [],
    isUsingRems: undefined,
    csrfToken: undefined,
  }

  @computed get userName() {
    return this.user?.name
  }

  @action.bound
  resetUser = () => {
    this.user = {
      name: undefined,
      firstName: undefined,
      lastName: undefined,
      loggedIn: false,
      homeOrganizationId: undefined,
      idaProjects: [],
      isUsingRems: undefined,
      csrfToken: undefined,
    }
  }

  @action.bound
  reset = () => {
    this.resetUser()
    this.userLogged = false
    this.cscUserLogged = false
    this.loading = false
  }

  @action.bound
  setUser(user) {
    this.user = user
  }

  @action.bound
  enableRequestInterceptor() {
    // Axios interceptor that enables SSO cookies and
    // CSRF token for requests to Metax V3
    if (this.interceptor) {
      return
    }
    this.interceptor = axios.interceptors.request.use(config => {
      // Use location.href as base to avoid errors for relative URLs here
      const requestUrl = new URL(config.url, global.location.href)
      const metaxUrl = new URL(this.Env.metaxV3Url(''))
      if (this.user.loggedIn && requestUrl.origin === metaxUrl.origin) {
        config.withCredentials = true // enables sending SSO cookies to Metax v3
        // Only write methods need a CSRF token
        if (['post', 'patch', 'put', 'delete'].includes(config.method)) {
          config.headers['X-CSRFToken'] = this.user.csrfToken
        }
      }
      return config
    })
  }

  @action.bound
  async updateCsrf() {
    let csrfToken
    if (this.user.loggedIn) {
      // load v3 auth info
      const v3Enabled =
        (this.Env.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND') && this.Env.isQvain) ||
        (this.Env.Flags.flagEnabled('ETSIN.METAX_V3.FRONTEND') && this.Env.isEtsin)
      if (v3Enabled) {
        const csrfRes = await axios.get(this.Env.metaxV3Url('user'), {
          withCredentials: true,
        })
        csrfToken = csrfRes.data.metax_csrf_token
      }
    }
    this.setUser({
      ...this.user,
      csrfToken,
    })
  }

  @action.bound
  async checkLogin() {
    this.loading = true
    try {
      const res = await axios.get('/api/user', {
        headers: { 'content-type': 'application/json', charset: 'utf-8' },
        withCredentials: true,
      })

      this.setUser({
        name: res.data.user_csc_name,
        firstName: res.data.first_name,
        lastName: res.data.last_name,
        loggedIn: res.data.is_authenticated,
        homeOrganizationId: res.data.home_organization_id,
        idaProjects: res.data.user_ida_projects,
        isUsingRems: res.data.is_using_rems,
      })

      await this.updateCsrf()

      runInAction(() => {
        // User verified through HAKA or other external verification, but no valid CSC account -> no permission
        if (res.data.is_authenticated && !res.data.is_authenticated_CSC_user) {
          this.userLogged = false
          this.cscUserLogged = false

          // User verified through CSC account, but no set home organization -> no permission
        } else if (
          res.data.is_authenticated &&
          res.data.is_authenticated_CSC_user &&
          !res.data.home_organization_id
        ) {
          this.userLogged = false
          this.cscUserLogged = false

          // User verified through CSC account and has set home organization -> login successful
        } else if (
          res.data.is_authenticated &&
          res.data.is_authenticated_CSC_user &&
          res.data.home_organization_id
        ) {
          this.userLogged = res.data.is_authenticated
          this.cscUserLogged = res.data.is_authenticated_CSC_user

          // Error handling, if above conditions are not met, user should not be logged in
        } else {
          this.userLogged = false
          this.cscUserLogged = false
        }
      })
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      runInAction(() => {
        this.loading = false
        this.initializing = false
      })
    }
  }

  @action.bound
  logout() {
    return new Promise((resolve, reject) => {
      axios
        .delete('/api/session')
        .then(
          action(res => {
            this.userLogged = false
            this.cscUserLogged = false

            // Since the user will be logged out, all user.* variables should be reset to default values.
            this.resetUser()
            resolve(res)
          })
        )
        .catch(err => {
          console.error(err)
          reject(err)
        })
    })
  }

  /* keepAlive component calls renewsession if user is active */
  @action.bound
  async renewSession() {
    try {
      await axios.get('/api/session')
    } catch (err) {
      if (err?.response?.status === 401) {
        this.reset()
      }
    }
  }
}

export default Auth
