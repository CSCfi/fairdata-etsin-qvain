// ORCID format: DDDD-DDDD-DDDD-DDDY where D is a digit and Y is a digit or
// capital letter X. See:
// https://support.orcid.org/hc/en-us/articles/360006897674-Structure-of-the-ORCID-Identifier.
// Also, trailing slash is allowed, ^ and $ anchors ensure the entire string
// must match the ORCID format.
const orcidWithOptionalSlashRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]\/?$/

function isValidOrcid(identifier: string): boolean {
  // Check if the identifier is compliant with ORCID format:
  return orcidWithOptionalSlashRegex.test(identifier)
}

export function orcidToUrl(externalId: string | undefined): string {
  // Normalize an ORCID identifier to an ORCID url.
  // Returns the normalized URL, or an empty string if the identifier is not a
  // recognized ORCID or ORCID URL.
  if (!externalId) {
    return ''
  }

  const domains = [
    'http://orcid.org/',
    'http://www.orcid.org/',
    'https://orcid.org/',
    'https://www.orcid.org/',
    'www.orcid.org/',
    'orcid.org/',
  ]

  for (const domain of domains) {
    if (!externalId.startsWith(domain)) {
      continue
    }
    const idPart = externalId.substring(domain.length)
    if (!isValidOrcid(idPart)) {
      continue
    }

    if (!(domain.startsWith('http://') || domain.startsWith('https://'))) {
      return `https://${externalId}`
    }

    return externalId
  }

  if (externalId.toLowerCase().startsWith('orcid:')) {
    const orcid = externalId.substring('orcid:'.length).trimStart()
    if (isValidOrcid(orcid)) {
      return `https://orcid.org/${orcid}`
    }
    // ORCID may itself be a full ORCID URL, e.g.
    // "https://orcid.org/0009-0000-0000-0000":
    const url = orcidToUrl(orcid)
    if (url !== '') {
      return url
    }
  }

  if (isValidOrcid(externalId)) {
    return `https://orcid.org/${externalId}`
  }

  return ''
}
