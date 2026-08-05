import axios from 'axios'
import { action, computed, observable } from 'mobx'
import RouterStore from '@/utils/RouterStore'

import Flags from './env.flags'

import { getCookieValue } from '@/utils/cookies'
import { getEtsinPortalConfig } from '@/etsinPortals/registry'
import { etsinSearchPathname } from '@/utils/lumiAifEtsinSearch'
import urls from '@/utils/urls'
import { addHostToUrls } from '@/utils/addHostToUrls'
import getOS, { type OSOption } from '@/utils/getOS'

async function importValuesAsync() {
  const response = await axios.get('/api/app_config')
  return response.data
}

class Env {
  Flags: Flags
  history: RouterStore

  constructor() {
    this.Flags = new Flags(this)
    this.history = new RouterStore()
  }

  @observable accessor metaxUrls: typeof urls.metaxV3 = addHostToUrls(urls.metaxV3, '')

  @action.bound
  updateMetaxUrls() {
    this.metaxUrls = addHostToUrls(urls.metaxV3, this.metaxV3Host)
  }

  @observable accessor metaxV3Host = ''

  @observable accessor etsinHost = ''

  @observable accessor qvainHost = ''

  @observable accessor appConfigLoaded = false

  @observable accessor ssoCookieDomain = ''

  @observable accessor ssoPrefix = ''

  @observable accessor packageSizeLimit = 0 // max downloadable package size in bytes

  @observable accessor app = getCookieValue('etsin_app')

  async fetchAppConfig() {
    const values = await importValuesAsync()
    this.setMetaxV3Host(values.METAX_V3_DOMAIN_NAME, values.METAX_V3_PORT)
    this.setEtsinHost(values.SERVER_ETSIN_DOMAIN_NAME)
    this.setQvainHost(values.SERVER_QVAIN_DOMAIN_NAME)
    this.Flags.setFlags(values.FLAGS)
    if (import.meta.env.MODE !== 'production') {
      await this.Flags.validateFlags()
    }
    this.setSSOCookieDomain(values.SSO_COOKIE_DOMAIN)
    this.setSSOPrefix(values.SSO_PREFIX)
    this.setPackageSizeLimit(values.PACKAGE_SIZE_LIMIT)
    this.setAppConfigLoaded(true)
  }

  @action setPackageSizeLimit(limit: number) {
    this.packageSizeLimit = limit
  }

  @action setSSOPrefix(prefix: string) {
    this.ssoPrefix = prefix
  }

  @action setSSOCookieDomain(domain: string) {
    this.ssoCookieDomain = domain
  }

  @action setAppConfigLoaded(value: boolean) {
    this.appConfigLoaded = value
  }

  @action setMetaxV3Host(host: string, port: number) {
    this.metaxV3Host = `${host}:${port}`
    this.updateMetaxUrls()
  }

  @action setEtsinHost(host: string) {
    this.etsinHost = host
  }

  @action setQvainHost(host: string) {
    this.qvainHost = host
  }

  @computed
  get isQvain() {
    return this.app === 'qvain'
  }

  @computed
  get isEtsin() {
    return this.app === 'etsin'
  }

  @computed
  get isRetriever() {
    return this.app === 'retriever'
  }

  @observable accessor osChoice: OSOption = getOS() // os choice in ui dialogs

  @action.bound setOSChoice(os: OSOption) {
    this.osChoice = os
  }

  /** Branded Etsin portal config derived from etsin_app cookie (default Fairdata Etsin when unknown). */
  @computed
  get etsinPortal() {
    return getEtsinPortalConfig(this.app)
  }

  @computed
  get isBrandedEtsinPortal() {
    return this.etsinPortal.id !== 'default'
  }

  /** True only for the LUMI-AIF portal (not other future branded portals). */
  @computed
  get isLumiAifEtsinPortal() {
    return this.etsinPortal.id === 'lumi-aif'
  }

  @computed
  get etsinSearchPath() {
    return etsinSearchPathname(this.app)
  }

  @computed
  get separateQvain() {
    return this.qvainHost !== this.etsinHost
  }

  getEtsinUrl = (path: string) => {
    if (this.isEtsin) {
      return path
    }
    if (this.etsinHost && this.separateQvain) {
      return `https://${this.etsinHost}${path}`
    }
    return path
  }

  getQvainUrl = (path: string) => {
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
