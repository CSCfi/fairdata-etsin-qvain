import Bowser from 'bowser'

const osOptions = ['windows', 'linux', 'macos'] as const

export type OSOption = (typeof osOptions)[number]

export const getOS = (): OSOption => {
  const browser = Bowser.getParser(globalThis.navigator.userAgent)
  const name = browser.getOSName()?.toLowerCase() || 'windows'
  for (const os of osOptions) {
    if (name.includes(os)) {
      return os
    }
  }
  return 'windows'
}

export default getOS