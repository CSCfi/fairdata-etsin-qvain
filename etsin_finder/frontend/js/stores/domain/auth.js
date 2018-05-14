import { observable, action } from 'mobx'
import axios from 'axios'

class Auth {
  @observable userLogged = false
  @observable user = { id: undefined, name: undefined }
  @action
  checkLogin() {
    axios
      .get('/api/user', {
        headers: { 'content-type': 'application/json', charset: 'utf-8' },
      })
      .then(res => {
        this.userLogged = res.data.is_authenticated
        this.user = { id: res.data.user_id, name: res.data.user_display_name }
      })
      .catch(err => console.log(err))
  }
  @action
  logout() {
    axios
      .delete('api/session')
      .then(() => {
        this.userLogged = false
        this.user = { id: undefined, name: undefined }
      })
      .catch(err => console.log(err))
  }
}

export default new Auth()
