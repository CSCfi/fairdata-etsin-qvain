import { observable } from 'mobx'

// metax url
let metax = (process.env.NODE_ENV !== 'production') ? 'https://metax-test.csc.fi' : 'https://metax-test.csc.fi'

class Env {
  @observable environment = process.env.NODE_ENV
  @observable metaxUrl = metax
}

export default new Env();
