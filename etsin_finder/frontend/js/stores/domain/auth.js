import { DAAS_CATALOG_SERVICE_USERS } from '@/utils/constants'
import axios from 'axios'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import * as yup from 'yup'

const AdminOrganizationSchema = yup.object().shape({
  id: yup.string().required(),
  pref_label: yup.object().shape({
    en: yup.string().required(),
    fi: yup.string().required(),
  }),
  other_identifier: yup.string().default(''),
  allow_manual_rems_approval: yup.boolean().default(false),
})

const UserSchema = yup.object().shape({
  isAuthenticated: yup.bool().default(false),
  name: yup.string().default(null).nullable(),
  firstName: yup.string().default(null).nullable(),
  lastName: yup.string().default(null).nullable(),
  homeOrganizationId: yup.string().default(null).nullable(),
  idaProjects: yup.array().of(yup.string().required()).default([]),
  csrfToken: yup.string().default(null).nullable(),
  adminOrganizations: yup.array().of(yup.string().required()).default([]),
  availableAdminOrganizations: yup.array().of(AdminOrganizationSchema).default([]),
  defaultAdminOrganization: AdminOrganizationSchema.nullable().default(null),
  groups: yup.array().of(yup.string().required()).default([]),
})

class Auth {
  constructor(Env) {
    this.Env = Env
    makeObservable(this)
  }

  @observable interceptors = null

  @observable loading = false

  @observable initializing = true

  @observable user = UserSchema.validateSync({}) // initialize as unauthenticated user

  @observable loginError = null

  @action.bound
  setLoginError(val) {
    this.loginError = val
  }

  @computed get isAuthenticated() {
    return !!this.user?.isAuthenticated
  }

  @computed get userName() {
    return this.user?.name
  }

  @computed get hasRightsToDaas() {
    return this.user.groups?.find?.(a => a === DAAS_CATALOG_SERVICE_USERS)
  }

  @action.bound
  resetUser() {
    this.setUser({})
    this.loginError = null
  }

  @action.bound
  reset() {
    this.resetUser()
    this.loading = false
  }

  @action.bound
  setUser(user) {
    try {
      this.user = UserSchema.validateSync(user)
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  isMetaxV3Request(requestConfig) {
    // Return true if Axios request config object is a Metax V3 request
    const requestUrl = new URL(requestConfig.url, globalThis.location.href)
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
      if (this.isAuthenticated && this.isMetaxV3Request(config)) {
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
        if (this.user.isAuthenticated && this.isMetaxV3Request(requestConfig)) {
          const response = error.response
          if (response?.status === 403 && response.data?.detail?.startsWith?.('CSRF Failed')) {
            // CSRF error, try updating the token and retry the original request.
            if (await this.updateCsrf()) {
              return axios.request(requestConfig)
            }
          }
        }

        throw error
      }
    )
  }

  @action.bound
  async updateCsrf() {
    // Update CSRF token from Metax V3, return true if the user still matches.
    const username = this.user.name
    await this.fetchUserData()
    // Requests should be retried only if user has not chaned
    return this.user.name == username
  }

  @action.bound
  async fetchUserData() {
    try {
      const res = await axios.get(this.Env.metaxV3Url('user'), {
        headers: { 'content-type': 'application/json' },
        withCredentials: true,
      })
      const data = res.data
      this.setUser({
        isAuthenticated: data.is_authenticated,
        name: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
        homeOrganizationId: data.organization,
        idaProjects: data.csc_projects,
        csrfToken: data.metax_csrf_token,
        adminOrganizations: data.admin_organizations,
        availableAdminOrganizations: data.available_admin_organizations,
        defaultAdminOrganization: data.default_admin_organization,
        groups: data.groups,
      })
      this.setLoginError()
    } catch (err) {
      const code = err?.response?.data?.code
      if (code) {
        this.setLoginError(code)
        return
      }
      const detail = err?.response?.data?.detail
      if (code) {
        this.setLoginError(detail)
        return
      }
    }
  }

  @action.bound
  async checkLogin() {
    this.loading = true
    try {
      await this.fetchUserData()
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
  async logout() {
    try {
      await axios.delete('/api/session')
      // Since the user will be logged out, all user.* variables should be reset to default values.
      this.resetUser()
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

export default Auth
