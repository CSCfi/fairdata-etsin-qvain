import {
  buildEtsinSearchTo,
  LUMI_AIF_ETSIN_APP_COOKIE,
  mergeEtsinSearchQueryParams,
  stripLumiAifFacetParamsFromSearchParams,
} from '@/utils/lumiAifEtsinSearch'
import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'

describe('lumiAifEtsinSearch', () => {
  describe('mergeEtsinSearchQueryParams', () => {
    it('adds fixed Daas + LUMI AI Factory facets for the LUMI-AIF portal app', () => {
      const p = mergeEtsinSearchQueryParams(LUMI_AIF_ETSIN_APP_COOKIE, '')
      expect(p.get('data_catalog__id')).toBe(DATA_CATALOG_IDENTIFIER.DAAS)
      expect(p.get('facet_data_service')).toBe('LUMI AI Factory')
      expect(p.get('facet_data_catalog')).toBeNull()
    })

    it('does not add facets for default Etsin', () => {
      const p = mergeEtsinSearchQueryParams('etsin', '')
      expect(p.get('data_catalog__id')).toBeNull()
      expect(p.get('facet_data_service')).toBeNull()
    })
  })

  describe('buildEtsinSearchTo', () => {
    it('uses root path and omits hidden facet keys from the URL string for LUMI-AIF', () => {
      const params = mergeEtsinSearchQueryParams(LUMI_AIF_ETSIN_APP_COOKIE, '?search=test')
      const to = buildEtsinSearchTo(LUMI_AIF_ETSIN_APP_COOKIE, params)
      expect(to).toBe('/?search=test')
    })

    it('keeps facets in the URL for standard Etsin', () => {
      const params = new URLSearchParams(
        `facet_data_catalog=${encodeURIComponent(DATA_CATALOG_IDENTIFIER.DAAS)}&facet_data_service=LUMI AI Factory`
      )
      const to = buildEtsinSearchTo('etsin', params)
      expect(to).toContain('/datasets?')
      expect(to).toContain('facet_data_catalog=')
    })
  })

  describe('stripLumiAifFacetParamsFromSearchParams', () => {
    it('removes both facet keys', () => {
      const q = new URLSearchParams(
        `facet_data_catalog=${encodeURIComponent(DATA_CATALOG_IDENTIFIER.DAAS)}&` +
          `data_catalog__id=${encodeURIComponent(DATA_CATALOG_IDENTIFIER.DAAS)}&` +
          `facet_data_service=LUMI AI Factory&search=x`
      )
      const stripped = stripLumiAifFacetParamsFromSearchParams(q)
      expect(stripped.has('facet_data_catalog')).toBe(false)
      expect(stripped.has('data_catalog__id')).toBe(false)
      expect(stripped.has('facet_data_service')).toBe(false)
      expect(stripped.get('search')).toBe('x')
    })
  })
})
