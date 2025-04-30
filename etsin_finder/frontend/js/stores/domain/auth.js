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

  @observable interceptors = null

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

  isMetaxV3Request(requestConfig) {
    // Return true if Axios request config object is a Metax V3 request
    const requestUrl = new URL(requestConfig.url, global.location.href)
    let metaxUrl
    try {
      metaxUrl = new URL(this.Env.metaxV3Url(''))
    } catch (error) {
      console.error(`Failed to construct Metax V3 URL, host=${this.Env.metaxV3Host}`)
      throw error
    }
    return requestUrl.origin === metaxUrl.origin
  }

  @action.bound
  enableRequestInterceptors() {
    // Enable interceptors for handling Metax V3 authentication

    if (this.interceptors) {
      return
    }
    this.interceptors = {}

    // Axios request interceptor that enables SSO cookies and
    // CSRF token for requests to Metax V3
    this.interceptors.request = axios.interceptors.request.use(config => {
      // Use location.href as base to avoid errors for relative URLs here
      if (this.user.loggedIn && this.isMetaxV3Request(config)) {
        config.withCredentials = true // enables sending SSO cookies to Metax v3
        // Only write methods need a CSRF token
        if (['post', 'patch', 'put', 'delete'].includes(config.method)) {
          config.headers['X-CSRFToken'] = this.user.csrfToken
        }
      }
      return config
    })

    // Axios response interceptor that handles CSRF errors and retries
    // the original request with updated token
    this.interceptors.response = axios.interceptors.response.use(
      response => response,
      async error => {
        const requestConfig = error.config
        if (this.user.loggedIn && this.isMetaxV3Request(requestConfig)) {
          const response = error.response
          if (response?.status === 403 && response.data?.detail?.startsWith?.('CSRF Failed')) {
            // CSRF error, try updating the token and retry the original request.
            if (await this.updateCsrf()) {
              return axios.request(requestConfig)
            }
          }
        }

        return Promise.reject(error)
      }
    )
  }

  @action.bound
  async updateCsrf() {
    // Retrieve CSRF token from Metax V3
    let csrfToken
    if (this.user.loggedIn) {
      // load v3 auth info
      const res = await axios.get(this.Env.metaxV3Url('user'), {
        withCredentials: true,
      })

      if (res.data.username === this.user.name) {
        csrfToken = res.data.metax_csrf_token
      }
    }

    // Update user and return true if token found
    if (csrfToken) {
      this.setUser({
        ...this.user,
        csrfToken,
      })
      return true
    }
    return false
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
        const markAsLoggedOut = () => {
          this.userLogged = false
          this.cscUserLogged = false
        }

        if (res.data.is_authenticated && !res.data.is_authenticated_CSC_user) {
          markAsLoggedOut()
          // User verified through CSC account, but no set home organization -> no permission
        } else if (
          res.data.is_authenticated &&
          res.data.is_authenticated_CSC_user &&
          !res.data.home_organization_id
        ) {
          markAsLoggedOut()
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
          markAsLoggedOut()
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
