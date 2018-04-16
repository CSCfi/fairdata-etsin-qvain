import getIdentifierFromQuery from '../js/utils/getIdentifierFromQuery'

describe('getIdentifierFromQuery function', () => {
  const emptyQuery = ''
  const queryWithNoAttIdentifier = 'test query'
  const queryWithHttpAndNoIdentifier = 'http://urn.fi/abc123'
  const queryWithUrnFiAndNoIdentifier = 'urn.fi/abc123'
  const queryWithUrnAndSomethingElse = 'urn:nbn:fi:att:12345 query'
  const queryWithOtherThanAttUrn = 'urn:nbn:fi:lb:12345'

  const validAttUrn = 'urn:nbn:fi:att:12345'
  const queryWithHttp = 'http://urn.fi/' + validAttUrn
  const queryWithUrnFi = 'urn.fi/' + validAttUrn
  const queryWithUrn = validAttUrn
  const queryWithWhitespaces = ' ' + validAttUrn + ' '

  it('should return empty identifier for an empty query', () => {
    const identifier = getIdentifierFromQuery(emptyQuery)
    expect(identifier).toEqual(false)
  })
  it('should return empty identifier for a query without att-urn identifier I', () => {
    const identifier = getIdentifierFromQuery(queryWithNoAttIdentifier)
    expect(identifier).toEqual(false)
  })
  it('should return empty identifier for a query without att-urn identifier II', () => {
    const identifier = getIdentifierFromQuery(queryWithHttpAndNoIdentifier)
    expect(identifier).toEqual(false)
  })
  it('should return empty identifier for a query without att-urn identifier III', () => {
    const identifier = getIdentifierFromQuery(queryWithUrnFiAndNoIdentifier)
    expect(identifier).toEqual(false)
  })
  it('should return empty identifier for a query with att-urn and something else separated by whitespace', () => {
    const identifier = getIdentifierFromQuery(queryWithUrnAndSomethingElse)
    expect(identifier).toEqual(false)
  })
  it('should return empty identifier for a query with a urn that is nott an att urn', () => {
    const identifier = getIdentifierFromQuery(queryWithOtherThanAttUrn)
    expect(identifier).toEqual(false)
  })
  it('should return the identifier for a query containing att-urn identifier I', () => {
    const identifier = getIdentifierFromQuery(queryWithHttp)
    expect(identifier).toEqual(validAttUrn)
  })
  it('should return the identifier for a query containing att-urn identifier II', () => {
    const identifier = getIdentifierFromQuery(queryWithUrnFi)
    expect(identifier).toEqual(validAttUrn)
  })
  it('should return the identifier for a query containing att-urn identifier III', () => {
    const identifier = getIdentifierFromQuery(queryWithUrn)
    expect(identifier).toEqual(validAttUrn)
  })
  it('should return the identifier for a query containing att-urn identifier having whitespaces around', () => {
    const identifier = getIdentifierFromQuery(queryWithWhitespaces)
    expect(identifier).toEqual(validAttUrn)
  })
})
