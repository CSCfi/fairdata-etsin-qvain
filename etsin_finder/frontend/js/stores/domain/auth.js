/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, runInAction } from 'mobx'
// import { observable, action, toJS } from 'mobx'
import axios from 'axios'

class Auth {
  @observable userLogged = false

  @observable cscUserLogged = false

  @observable loading = false

  @observable user = {
    name: undefined,
    loggedIn: false,
    homeOrganizationName: undefined,
    idaGroups: [],
  }

  @action
  checkLogin() {
    return new Promise((resolve, reject) => {
      runInAction(() => {
        this.loading = true
      })
      axios
        .get('/api/user', {
          headers: { 'content-type': 'application/json', charset: 'utf-8' },
        })
        .then(action(res => {
          this.user = {
            name: res.data.user_csc_name,
            loggedIn: res.data.is_authenticated,
            homeOrganizationName: res.data.home_organization_name,
            idaGroups: res.data.user_ida_groups,
          }
          if (res.data.is_authenticated && !res.data.is_authenticated_CSC_user) {
            // The user was able to verify themself using HAKA or some other external verification,
            // but do not have a valid CSC account and should not be granted permission.
            this.userLogged = false
            this.cscUserLogged = false
          } else if (!res.data.home_organization_name) {
            // The user was able to verify themself using their CSC account,
            // but do not have a home organization set (sui.csc.fi) and should not be granted permission.
            this.userLogged = false
            this.cscUserLogged = false
          } else if (res.data.is_authenticated && res.data.is_authenticated_CSC_user && res.data.home_organization_name) {
            // The user has a valid CSC account with a defined home organization. Login successful.
            this.userLogged = res.data.is_authenticated
            this.cscUserLogged = res.data.is_authenticated_CSC_user
          } else {
            // If any of the checks failed, the user should not be logged in. The variables keep their 'false' value.
            this.userLogged = false
            this.cscUserLogged = false
          }
          this.loading = false
          resolve(res)
        }))
        .catch(action(err => {
          this.loading = false
          console.log(err)
          reject(err)
        }))
    })
  }

  @action
  logout() {
    return new Promise((resolve, reject) => {
      axios
        .delete('/api/session')
        .then(res => {
          this.userLogged = false
          this.cscUserLogged = false

          // Since the user will be logged out, all user.* variables should be reset to default values.
          this.user = {
            name: undefined,
            loggedIn: false,
            homeOrganizationName: undefined,
            idaGroups: [],
          }
          resolve(res)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  }

  /* keepAlive component calls renewsession if user is active */
  @action
  renewSession() {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/session')
        .then(() => resolve())
        .catch(err => {
          if (err.response.status === 401) {
            this.userLogged = false
            this.cscUserLogged = false
            this.user = { name: undefined }
          }
          return reject(err)
        })
    })
  }
}

export default new Auth()
