let isMatomoLoaded = false

export const changeService = service => {
  const metaTag = document.querySelector('meta[name="fdwe-service"]')
  metaTag.setAttribute('content', service)
  console.log('service', metaTag)
}

export const changeScope = scope => {
  if (!isMatomoLoaded) {
    loadMatomo()
  } else {
    // eslint-disable-next-line
    fdweRecordEvent(null, scope)
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
