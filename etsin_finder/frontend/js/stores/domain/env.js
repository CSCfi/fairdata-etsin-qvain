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
import RouterStore from '@/utils/RouterStore'

import Flags from './env.flags'

import { getCookieValue } from '../../utils/cookies'
import urls from '@/utils/urls'

async function importValuesAsync() {
  const response = await axios.get('/api/app_config')
  return response.data
}

class Env {
  constructor() {
    makeObservable(this)
    this.Flags = new Flags()
    this.history = new RouterStore()
    this.metaxV3Url = this.metaxV3Url.bind(this)
  }

  metaxV3Url(endpoint, ...args) {
    return urls.metaxV3[endpoint](`https://${this.metaxV3Host}`, ...args)
  }

  @observable metaxV3Host = ''

  @observable etsinHost = ''

  @observable qvainHost = ''

  @observable appConfigLoaded = false

  @observable ssoCookieDomain = ''

  @observable ssoPrefix = ''

  @observable packageSizeLimit = 0 // max downloadable package size in bytes

  @observable app = getCookieValue('etsin_app')

  async fetchAppConfig() {
    const values = await importValuesAsync()
    this.setMetaxV3Host(values.METAX_V3_DOMAIN_NAME, values.METAX_V3_PORT)
    this.setEtsinHost(values.SERVER_ETSIN_DOMAIN_NAME)
    this.setQvainHost(values.SERVER_QVAIN_DOMAIN_NAME)
    this.Flags.setFlags(values.FLAGS)
    if (BUILD !== 'production') {
      await this.Flags.validateFlags()
    }
    this.setSSOCookieDomain(values.SSO_COOKIE_DOMAIN)
    this.setSSOPrefix(values.SSO_PREFIX)
    this.setPackageSizeLimit(values.PACKAGE_SIZE_LIMIT)
    this.setAppConfigLoaded(true)
  }

  @action setPackageSizeLimit(limit) {
    this.packageSizeLimit = limit
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

  @action setMetaxV3Host(host, port) {
    this.metaxV3Host = `${host}:${port}`
  }

  @action setEtsinHost(host) {
    this.etsinHost = host
  }

  @action setQvainHost(host) {
    this.qvainHost = host
  }

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
}

export default Env
