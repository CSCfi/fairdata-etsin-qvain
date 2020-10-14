/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import axios from 'axios'
import { action, computed, makeObservable, observable } from 'mobx'
import { RouterStore } from 'mobx-react-router'

import { getCookieValue } from '../../utils/cookies'


const routingStore = new RouterStore()

async function importValuesAsync() {
  const response = await axios.get('/api/app_config')
  return response.data
}

class Env {
  constructor() {
    makeObservable(this)
  }

  @observable etsinHost = ''

  @observable qvainHost = ''

  async fetchAppConfig() {
    const values = await importValuesAsync()
    this.setEtsinHost(values.SERVER_ETSIN_DOMAIN_NAME)
    this.setQvainHost(values.SERVER_QVAIN_DOMAIN_NAME)
    this.setDownloadApiV2(!!values.DOWNLOAD_API_V2_ENABLED)
  }

  @action setEtsinHost(host) {
    this.etsinHost = host
  }

  @action setQvainHost(host) {
    this.qvainHost = host
  }

  @action setDownloadApiV2(enabled) {
    this.downloadApiV2 = enabled
  }

  @observable metaxApiV2 =
    process.env.NODE_ENV !== 'production' && localStorage.getItem('metax_api_v2') === '1'

  @observable downloadApiV2 = false

  @observable app = getCookieValue('etsin_app')

  @computed
  get isQvain() {
    return this.app === 'qvain'
  }

  @computed
  get isEtsin() {
    return this.app !== 'qvain'
  }

  @computed
  get separateQvain() {
    return this.qvainHost !== this.etsinHost
  }

  @action setMetaxApiV2 = value => {
    this.metaxApiV2 = value
  }

  getEtsinUrl = path => {
    if (this.isEtsin) {
      return path
    }
    if (this.etsinHost && this.separateQvain) {
      return `https://${this.etsinHost}${path}`
    }
    return path
  }

  getQvainUrl = path => {
    if (this.isQvain) {
      return path
    }
    if (this.qvainHost && this.separateQvain) {
      return `https://${this.qvainHost}${path}`
    }
    return `/qvain${path}`
  }

  history = routingStore
}

export default new Env()
