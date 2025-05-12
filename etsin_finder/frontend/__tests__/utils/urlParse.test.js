import UrlParse from '../../js/utils/urlParse'

describe('urlParse function', () => {
  it('Split url by params', () => {
    const test = UrlParse.searchParams('?number=ten&s=search')
    expect(test).toEqual({ number: 'ten', s: 'search' })
  })
  it('Build url from params', () => {
    const test = UrlParse.makeSearchParams({ s: 'search', p: 10 })
    expect(test).toEqual('?s=search&p=10')
  })
})
