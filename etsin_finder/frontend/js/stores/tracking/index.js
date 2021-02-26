class Matomo {
  constructor(Env) {
    this.Env = Env
  }

  isMatomoLoaded = false

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

  changeService = service => {
    if (this.Env?.Flags?.flagEnabled('MATOMO_TRACKING')) {
      const metaTag = document.querySelector('meta[name="fdwe-service"]')
      metaTag.setAttribute('content', service)
      console.log('service', metaTag)
    }
  }

  changeScope = scope => {
    if (this.Env?.Flags?.flagEnabled('MATOMO_TRACKING')) {
      if (!this.isMatomoLoaded) {
        this.loadMatomoWithScope(scope)
      } else {
        const scopeMetaTag = document.querySelector('meta[name="fdwe-scope"]')
        scopeMetaTag.setAttribute('content', scope)
        // eslint-disable-next-line
        fdweRecordEvent()
      }
    }
  }
}

export default Matomo
