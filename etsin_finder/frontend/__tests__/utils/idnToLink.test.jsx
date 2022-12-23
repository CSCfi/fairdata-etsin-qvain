import idnToLink from '../../js/utils/idnToLink'

describe('idnToLink', () => {
  test('should create DOI url', () => {
    idnToLink('doi:10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b').should.eql(
      'https://doi.org/10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b'
    )
  })

  test('should create URN url', () => {
    idnToLink('urn:nbn:fi:att:d00d').should.eql('http://urn.fi/urn:nbn:fi:att:d00d')
  })

  test('should create Reportronic url', () => {
    idnToLink('reportronic.fi/aineisto').should.eql('https://reportronic.fi/aineisto')
  })

  test('should create Reportronic url in the correct form', () => {
    idnToLink('url:reportronic.fi/aineisto').should.eql('https://reportronic.fi/aineisto')
  })

  test('should create URN url fom capitalized characters', () => {
    idnToLink('URN:NBN:fi:att:d00d').should.eql('http://urn.fi/urn:nbn:fi:att:d00d')
  })

  test('should return HTTP url', () => {
    idnToLink('http://example.org/something').should.eql('http://example.org/something')
  })

  test('should return HTTPS url', () => {
    idnToLink('https://example.org/something').should.eql('https://example.org/something')
  })

  test('should not return url for unknown identifier type', () => {
    idnToLink('some-identifier').should.eql('')
  })
})
