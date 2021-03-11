class Matomo {
  constructor(Env) {
    this.Env = Env
    this.serviceMetaTag = document.querySelector('meta[name="fdwe-service"]')
    this.scopeMetaTag = document.querySelector('meta[name="fdwe-scope"]')
  }

  changeService = service => {
    if (this.Env?.Flags?.flagEnabled('MATOMO_TRACKING')) {
      this.serviceMetaTag.setAttribute('content', service)
    }
  }

  recordEvent = scope => {
    if (this.Env?.Flags?.flagEnabled('MATOMO_TRACKING')) {
      this.scopeMetaTag.setAttribute('content', scope)
      if (window.fdweRecordEvent) window.fdweRecordEvent()
    }
  }
}

export default Matomo
