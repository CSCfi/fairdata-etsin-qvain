export const changeService = service => {
  const metaTag = document.querySelector('meta[name="fdwe-service"]')
  metaTag.setAttribute('content', service)
  console.log('service', metaTag)
}

export const changeScope = scope => {
  const metaTag = document.querySelector('meta[name="fdwe-scope"]')
  metaTag.setAttribute('content', scope)
  console.log('scope', metaTag)
}

export default {
  changeScope,
  changeService,
}
