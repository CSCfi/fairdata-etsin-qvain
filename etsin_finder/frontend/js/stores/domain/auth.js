import { observable, action } from 'mobx'
import axios from 'axios'

class Auth {
  @observable userLogged = false
  @observable user = { id: undefined, name: undefined }
  @action
  checkLogin() {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/user', {
          headers: { 'content-type': 'application/json', charset: 'utf-8' },
        })
        .then(res => {
          this.userLogged = res.data.is_authenticated
          this.user = { id: res.data.user_id, name: res.data.user_display_name }
          resolve(res)
        })
        .catch(err => {
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
          this.user = { id: undefined, name: undefined }
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
            this.user = { id: undefined, name: undefined }
          }
          return reject(err)
        })
    })
  }
}

export default new Auth()
