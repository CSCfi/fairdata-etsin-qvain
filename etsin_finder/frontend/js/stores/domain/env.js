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
import Flags from './env.flags'

import { getCookieValue } from '../../utils/cookies'

const routingStore = new RouterStore()

async function importValuesAsync() {
  const response = await axios.get('/api/app_config')
  return response.data
}

class Env {
  constructor() {
    makeObservable(this)
    this.Flags = new Flags()
  }

  @observable etsinHost = ''

  @observable qvainHost = ''

  @observable appConfigLoaded = false

  @observable ssoCookieDomain = ''

  @observable ssoPrefix = ''

  async fetchAppConfig() {
    const values = await importValuesAsync()
    this.setEtsinHost(values.SERVER_ETSIN_DOMAIN_NAME)
    this.setQvainHost(values.SERVER_QVAIN_DOMAIN_NAME)
    this.Flags.setFlags(values.FLAGS)
    if (process.env.NODE_ENV !== 'production') {
      await this.Flags.validateFlags()
    }
    this.setSSOCookieDomain(values.SSO_COOKIE_DOMAIN)
    this.setSSOPrefix(values.SSO_PREFIX)
    this.setAppConfigLoaded(true)
  }

  @action setSSOPrefix(prefix) {
    this.ssoPrefix = prefix
  }

  @action setSSOCookieDomain(domain) {
    this.ssoCookieDomain = domain
  }

  @action setAppConfigLoaded(value) {
    this.appConfigLoaded = value
  }

  @action setEtsinHost(host) {
    this.etsinHost = host
  }

  @action setQvainHost(host) {
    this.qvainHost = host
  }

  @computed get metaxApiV2() {
    return this.Flags.flagEnabled('METAX_API_V2.FRONTEND')
  }

  @computed get downloadApiV2() {
    return this.Flags.flagEnabled('DOWNLOAD_API_V2.FRONTEND')
  }

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
