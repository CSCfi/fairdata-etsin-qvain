/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, toJS } from 'mobx'
import axios from 'axios'

class Auth {
  @observable userLogged = false

  @observable cscUserLogged = false

  @observable loading = false

  @observable user = { name: undefined, idaGroups: [] }

  @action
  checkLogin() {
    return new Promise((resolve, reject) => {
      this.loading = true
      axios
        .get('/api/user', {
          headers: { 'content-type': 'application/json', charset: 'utf-8' },
        })
        .then(res => {
          console.log(res.data)
          this.userLogged = res.data.is_authenticated
          this.cscUserLogged = res.data.is_authenticated_CSC_user
          this.user = {
            name: res.data.user_csc_name,
            idaGroups: res.data.user_ida_groups,
          }
          console.log(toJS(this.user))
          this.loading = false
          resolve(res)
        })
        .catch(err => {
          this.loading = false
          console.log(err)
          reject(err)
        })
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
          this.user = { name: undefined }
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
