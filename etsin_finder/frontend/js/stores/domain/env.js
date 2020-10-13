/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { action, computed, makeObservable, observable } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import { getCookieValue } from '../../utils/cookies'

const routingStore = new RouterStore()

const qvainHost = process.env.REACT_APP_QVAIN_HOST
const etsinHost = process.env.REACT_APP_ETSIN_HOST

class Env {
  constructor() {
    makeObservable(this)
  }

  @observable environment = process.env.NODE_ENV

  @observable metaxApiV2 =
    process.env.NODE_ENV !== 'production' && localStorage.getItem('metax_api_v2') === '1'

  @observable app = getCookieValue('etsin_app')

  @computed
  get isQvain() {
    return this.app === 'qvain'
  }

  @computed
  get isEtsin() {
    return this.app !== 'qvain'
  }

  @observable separateQvain = qvainHost !== etsinHost

  @action setMetaxApiV2 = value => {
    this.metaxApiV2 = value
  }

  getQvainUrl = path => {
    if (this.isQvain) {
      return path
    }
    if (qvainHost && this.separateQvain) {
      return `https://${qvainHost}${path}`
    }
    return `/qvain${path}`
  }

  getEtsinUrl = path => {
    if (this.isEtsin) {
      return path
    }
    if (etsinHost && this.separateQvain) {
      return `https://${etsinHost}${path}`
    }
    return path
  }

  history = routingStore
}

export default new Env()
