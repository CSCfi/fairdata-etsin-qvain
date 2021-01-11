import { transformQuery } from '../../js/utils/transformQuery'

describe('transformQuery function', () => {
  const emptyQuery = ''
  const queryWithNoAttIdentifier = 'test query'
  const queryWithHttpAndNoIdentifier = 'http://urn.fi/abc123'
  const queryWithUrnFiAndNoIdentifier = 'urn.fi/abc123'
  const queryWithUrnAndSomethingElse = 'urn:nbn:fi:csc:12345 query'
  const queryWithOtherThanAttUrn = 'urn:nbn:fi:lb:12345'

  const validAttUrn = 'urn:nbn:fi:att:12345'
  const validCscUrn = 'urn:nbn:fi:csc:12345'
  const validIdaUrn = 'urn:nbn:fi:ida:12345'
  const attQueryWithHttp = 'http://urn.fi/' + validAttUrn
  const cscQueryWithUrnFi = 'urn.fi/' + validCscUrn
  const idaQueryWithUrn = validIdaUrn
  const attQueryWithWhitespaces = ' ' + validAttUrn + ' '

  it('should return empty query for an empty query', () => {
    const identifier = transformQuery(emptyQuery)
    expect(identifier).toEqual(emptyQuery)
  })
  it('should return the original query for a query without att-urn identifier I', () => {
    const identifier = transformQuery(queryWithNoAttIdentifier)
    expect(identifier).toEqual(queryWithNoAttIdentifier)
  })
  it('should return the original query for a query without att-urn identifier II', () => {
    const identifier = transformQuery(queryWithHttpAndNoIdentifier)
    expect(identifier).toEqual(queryWithHttpAndNoIdentifier)
  })
  it('should return the original query for a query without att-urn identifier III', () => {
    const identifier = transformQuery(queryWithUrnFiAndNoIdentifier)
    expect(identifier).toEqual(queryWithUrnFiAndNoIdentifier)
  })
  it('should return the original query for a query with att-urn and something else separated by whitespace', () => {
    const identifier = transformQuery(queryWithUrnAndSomethingElse)
    expect(identifier).toEqual(queryWithUrnAndSomethingElse)
  })
  it('should return the original query for a query with a urn that is not an att urn', () => {
    const identifier = transformQuery(queryWithOtherThanAttUrn)
    expect(identifier).toEqual(queryWithOtherThanAttUrn)
  })
  it('should return the identifier for a query containing att-urn identifier I', () => {
    const identifier = transformQuery(attQueryWithHttp)
    expect(identifier).toEqual(validAttUrn)
  })
  it('should return the identifier for a query containing att-urn identifier II', () => {
    const identifier = transformQuery(cscQueryWithUrnFi)
    expect(identifier).toEqual(validCscUrn)
  })
  it('should return the identifier for a query containing att-urn identifier III', () => {
    const identifier = transformQuery(idaQueryWithUrn)
    expect(identifier).toEqual(validIdaUrn)
  })
  it('should return the identifier for a query containing att-urn identifier having whitespaces around', () => {
    const identifier = transformQuery(attQueryWithWhitespaces)
    expect(identifier).toEqual(validAttUrn)
  })
})
