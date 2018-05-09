import { observable } from 'mobx'

class Auth {
  @observable userLogged = true
}

export default new Auth()
