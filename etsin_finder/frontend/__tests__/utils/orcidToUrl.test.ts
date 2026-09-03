import { orcidToUrl } from '@/utils/orcidToUrl'

describe('orcidToUrl', () => {
  test('returns URL unchanged for http orcid URL', () => {
    expect(orcidToUrl('http://orcid.org/0009-0000-0000-0000')).toBe(
      'http://orcid.org/0009-0000-0000-0000'
    )
  })

  test('returns URL unchanged for https orcid URL', () => {
    expect(orcidToUrl('https://orcid.org/0009-0000-0000-000X')).toBe(
      'https://orcid.org/0009-0000-0000-000X'
    )
  })

  test('returns URL unchanged for https orcid URL with trailing slash', () => {
    expect(orcidToUrl('https://orcid.org/0009-0000-0000-0000/')).toBe(
      'https://orcid.org/0009-0000-0000-0000/'
    )
  })

  test('returns URL unchanged for http www orcid URL', () => {
    expect(orcidToUrl('http://www.orcid.org/0009-0000-0000-0000')).toBe(
      'http://www.orcid.org/0009-0000-0000-0000'
    )
  })

  test('returns URL unchanged for https www orcid URL', () => {
    expect(orcidToUrl('https://www.orcid.org/0009-0000-0000-000X')).toBe(
      'https://www.orcid.org/0009-0000-0000-000X'
    )
  })

  test('adds https to www orcid URL', () => {
    expect(orcidToUrl('www.orcid.org/0009-0000-0000-0000')).toBe(
      'https://www.orcid.org/0009-0000-0000-0000'
    )
  })

  test('adds https to orcid URL without scheme', () => {
    expect(orcidToUrl('orcid.org/0000-0001-5000-0007')).toBe(
      'https://orcid.org/0000-0001-5000-0007'
    )
  })

  test('converts bare orcid to https URL', () => {
    expect(orcidToUrl('0009-0000-0000-0000')).toBe('https://orcid.org/0009-0000-0000-0000')
  })

  test('converts orcid prefix with bare orcid to https URL', () => {
    expect(orcidToUrl('orcID:   0009-0000-0000-0000')).toBe('https://orcid.org/0009-0000-0000-0000')
  })

  test('converts orcid prefix with https orcid to https URL', () => {
    expect(orcidToUrl('orcid:https://orcid.org/0009-0000-0000-0000')).toBe(
      'https://orcid.org/0009-0000-0000-0000'
    )
  })

  test('returns empty string for invalid http orcid URL', () => {
    expect(orcidToUrl('http://orcid.org/0009-0000-0000-000x')).toBe('')
  })

  test('returns empty string for invalid https orcid URL', () => {
    expect(orcidToUrl('https://orcid.org/0009-0000-0000-000X11')).toBe('')
  })

  test('returns empty string for orcid prefix with invalid orcid', () => {
    expect(orcidToUrl('orcid: 0009-0000-0000-0000\n')).toBe('')
  })

  test('returns empty string for invalid bare orcid', () => {
    expect(orcidToUrl('0ab0-0000-0000-000X')).toBe('')
  })

  test('returns empty string for non orcid URL', () => {
    expect(orcidToUrl('https://example.com/123')).toBe('')
  })

  test('returns empty string for empty input', () => {
    expect(orcidToUrl('')).toBe('')
  })

  test('returns empty string for none input', () => {
    expect(orcidToUrl(undefined)).toBe('')
  })

  test('returns empty string for orcid URL with duplicate domain', () => {
    expect(orcidToUrl('https://orcid.org/orcid.org/0009-0000-0000-0000')).toBe('')
  })
})
