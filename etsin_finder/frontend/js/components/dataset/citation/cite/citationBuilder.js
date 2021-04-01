import { capitalizeFirst } from './utils'

class CitationBuilder {
  parts = []

  constructor(parts) {
    this.parts = parts
  }

  addPart(part, format = val => val) {
    if (part !== undefined) {
      this.parts.push(format(part))
    }
  }

  joinStrings(stringArray, sep) {
    // if part already ends with separator, don't add another one
    for (let i = 0; i < stringArray.length - 1; i += 1) {
      if (stringArray[i].slice(-1) === sep) {
        stringArray[i] = stringArray[i].slice(0, -1)
      }
    }
    return stringArray.join(`${sep} `)
  }

  // Tree structure instead here
  renderPart(part, level = 0) {
    const parts = []
    for (const subpart of (part.parts || [])) {
      if (typeof subpart === 'object' && subpart !== undefined) {
        const rendered = this.renderPart(subpart, level + 1)
        // const rendered = 'huoh'
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
    return this.joinStrings(parts, part.sep)
  }

  get() {
    return capitalizeFirst(this.renderPart(this.parts)) || ''
  }
}

export default CitationBuilder
