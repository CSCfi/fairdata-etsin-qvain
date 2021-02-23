let isMatomoLoaded = false

export const changeService = service => {
  const metaTag = document.querySelector('meta[name="fdwe-service"]')
  metaTag.setAttribute('content', service)
  console.log('service', metaTag)
}

export const changeScope = scope => {
  const metaTag = document.querySelector('meta[name="fdwe-scope"]')
  metaTag.setAttribute('content', scope)
  console.log('scope', metaTag)
  if (!isMatomoLoaded) {
    loadMatomo()
  } else {
    fdweRecordEvent()
  }
}

export const loadMatomo = () => {
  const script = document.createElement('script')
  script.setAttribute('src', 'https://matomo.fd-test.csc.fi/fdwe.js')
  document.head.appendChild(script)
  isMatomoLoaded = true
}

export default {
  changeScope,
  changeService,
}
