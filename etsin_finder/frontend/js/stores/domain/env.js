/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { action, computed, observable } from 'mobx'
import { RouterStore } from 'mobx-react-router'

import axios from 'axios'

const routingStore = new RouterStore()

const getCookieValue = (key) => {
  const entry = document.cookie
    .split('; ')
    .find(row => row.startsWith(key))
  if (entry) {
    return entry.split('=')[1]
  }
  return undefined
}

  async function importValuesAsync () {
    const response = await axios.get('api/app_config')
    console.log(response)
    return response.data
  }

class Env {

  @observable etsinHost = ''

  @observable qvainHost = ''

  async fetchAppConfig() {
    const values = await importValuesAsync()
    this.setEtsinHost(values.SERVER_ETSIN_DOMAIN_NAME)
    this.setQvainHost(values.SERVER_QVAIN_DOMAIN_NAME)
  }

  @action setEtsinHost(host) {
    console.log(host)
    this.etsinHost = host
  }

  @action setQvainHost(host) {
    console.log(host)
    this.qvainHost = host
  }

  @observable environment = process.env.NODE_ENV

  @observable metaxApiV2 = process.env.NODE_ENV !== 'production' && localStorage.getItem('metax_api_v2') === '1'

  @observable app = getCookieValue('etsin_app')

  @computed
  get isQvain() {
    return this.app === 'qvain'
  }

  @computed
  get isEtsin() {
    return this.app !== 'qvain'
  }

  @observable separateQvain = this.qvainHost !== this.etsinHost

  @action setMetaxApiV2 = (value) => {
    this.metaxApiV2 = value
  }

  getQvainUrl = (path) => {
    if (this.isQvain) {
      return path
    }
    if (this.qvainHost && this.separateQvain) {
      return `https://${this.qvainHost}${path}`
    }
    return `/qvain${path}`
  }

  getEtsinUrl = (path) => {
    if (this.isEtsin) {
      return path
    }
    if (this.etsinHost && this.separateQvain) {
      return `https://${this.etsinHost}${path}`
    }
    return path
  }

  history = routingStore
}

export default new Env()
