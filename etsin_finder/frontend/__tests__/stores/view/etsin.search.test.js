import EtsinSearch from '@/stores/view/etsin/etsin.search'
import { addHostToUrls } from '@/utils/addHostToUrls'
import urls from '@/utils/urls'

describe('EtsinSearch aggregates url', () => {
  it('adds expand_data_services to aggregates request', async () => {
    const Env = {
      metaxUrls: addHostToUrls(urls.metaxV3, 'example.test'),
    }
    const Locale = { lang: 'en' }
    const Etsin = { errors: { search: [] } }
    const search = new EtsinSearch(Env, Locale, Etsin)

    search.client = {
      abort: vi.fn().mockResolvedValue(undefined),
      get: vi
        .fn()
        .mockResolvedValueOnce({
          data: {
            data_catalog: {
              query_parameter: 'facet_data_catalog',
              hits: [],
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            count: 0,
            results: [],
          },
        }),
    }

    await search.submit(new URLSearchParams('search=test'))

    const firstCallUrl = search.client.get.mock.calls[0][0]
    expect(firstCallUrl).toContain('expand_data_services=true')
  })
})
