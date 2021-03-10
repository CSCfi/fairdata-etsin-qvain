class Matomo {
  constructor(Env) {
    this.Env = Env
    this.serviceMetaTag = document.querySelector('meta[name="fdwe-service"]')
    this.scopeMetaTag = document.querySelector('meta[name="fdwe-scope"]')
  }

  /*
  loadMatomoWithScope = scope => {
    const scopeMetaTag = document.createElement('meta')
    scopeMetaTag.setAttribute('name', 'fdwe-scope')
    scopeMetaTag.setAttribute('content', scope)
    document.head.appendChild(scopeMetaTag)

    const script = document.createElement('script')
    script.setAttribute('src', 'https://matomo.fd-test.csc.fi/fdwe.js')
    document.head.appendChild(script)
    this.isMatomoLoaded = true
  }
*/
  changeService = service => {
    if (this.Env?.Flags?.flagEnabled('MATOMO_TRACKING')) {
      this.serviceMetaTag.setAttribute('content', service)
    }
  }

  recordEvent = scope => {
    if (this.Env?.Flags?.flagEnabled('MATOMO_TRACKING')) {
      this.scopeMetaTag.setAttribute('content', scope)
      // eslint-disable-next-line
      fdweRecordEvent()
    }
  }
}

export default Matomo
