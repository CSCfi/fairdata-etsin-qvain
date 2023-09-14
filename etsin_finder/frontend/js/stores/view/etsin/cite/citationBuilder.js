import { capitalizeFirst } from './utils'

class CitationBuilder {
  parts = []

  constructor(parts) {
    this.parts = parts
    this.joinStrings = this.joinStrings.bind(this)
    this.renderPart = this.renderPart.bind(this)
    this.get = this.get.bind(this)
  }

  joinStrings(stringArray, sep, space = ' ') {
    // if part already ends with separator, don't add another one
    for (let i = 0; i < stringArray.length - 1; i += 1) {
      if (stringArray[i].slice(-1) === sep) {
        stringArray[i] = stringArray[i].slice(0, -1)
      }
    }
    return stringArray.join(`${sep}${space}`)
  }

  // Tree structure instead here
  renderPart(part, level = 0) {
    const parts = []
    for (const subpart of part.parts || []) {
      if (typeof subpart === 'object' && subpart !== undefined) {
        const rendered = this.renderPart(subpart, level + 1)
        if (rendered !== undefined) {
          parts.push(rendered)
        }
      } else if (subpart !== undefined) {
        parts.push(subpart)
      }
    }
    if (parts.length === 0) {
      return undefined
    }
    if (part.wrapper) {
      return part.wrapper(this.joinStrings(parts, part.sep, part.space))
    }
    return this.joinStrings(parts, part.sep, part.space)
  }

  get({ capitalize = true } = {}) {
    if (!capitalize) {
      return this.renderPart(this.parts) || ''
    }
    return capitalizeFirst(this.renderPart(this.parts)) || ''
  }
}

export default CitationBuilder
