/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, runInAction, makeObservable } from 'mobx'
import axios from 'axios'

class Auth {
  constructor() {
    makeObservable(this)
  }

  @observable userLogged = false

  @observable cscUserLogged = false

  @observable loading = false

  @observable initializing = true

  @observable user = {
    name: undefined,
    firstName: undefined,
    lastName: undefined,
    loggedIn: false,
    homeOrganizationName: undefined,
    idaProjects: [],
    isUsingRems: undefined,
  }

  @action
  resetUser = () => {
    this.user = {
      name: undefined,
      firstName: undefined,
      lastName: undefined,
      loggedIn: false,
      homeOrganizationName: undefined,
      idaProjects: [],
      isUsingRems: undefined,
    }
  }

  @action
  reset = () => {
    this.resetUser()
    this.userLogged = false
    this.cscUserLogged = false
    this.loading = false
  }

  @action
  setUser(user) {
    this.user = user
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
          withCredentials: true,
        })
        .then(
          action(res => {
            this.setUser({
              name: res.data.user_csc_name,
              firstName: res.data.first_name,
              lastName: res.data.last_name,
              loggedIn: res.data.is_authenticated,
              homeOrganizationName: res.data.home_organization_name,
              idaProjects: res.data.user_ida_projects,
              isUsingRems: res.data.is_using_rems,
            })

            // User verified through HAKA or other external verification, but no valid CSC account -> no permission
            if (res.data.is_authenticated && !res.data.is_authenticated_CSC_user) {
              this.userLogged = false
              this.cscUserLogged = false

              // User verified through CSC account, but no set home organization -> no permission
            } else if (
              res.data.is_authenticated &&
              res.data.is_authenticated_CSC_user &&
              !res.data.home_organization_name
            ) {
              this.userLogged = false
              this.cscUserLogged = false

              // User verified through CSC account and has set home organization -> login successful
            } else if (
              res.data.is_authenticated &&
              res.data.is_authenticated_CSC_user &&
              res.data.home_organization_name
            ) {
              this.userLogged = res.data.is_authenticated
              this.cscUserLogged = res.data.is_authenticated_CSC_user

              // Error handling, if above conditions are not met, user should not be logged in
            } else {
              this.userLogged = false
              this.cscUserLogged = false
            }
            resolve(res)
          })
        )
        .catch(
          action(err => {
            console.log(err)
            reject(err)
          })
        )
        .finally(
          action(() => {
            this.loading = false
            this.initializing = false
          })
        )
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
          this.resetUser()
          resolve(res)
        })
        .catch(err => {
          console.error(err)
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
          if (err.response && err.response.status === 401) {
            this.reset()
          }
          return reject(err)
        })
    })
  }
}

export default new Auth()
