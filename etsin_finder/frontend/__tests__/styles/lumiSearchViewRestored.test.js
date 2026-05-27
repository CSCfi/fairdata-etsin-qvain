import etsinTheme, { lumiAifEtsinTheme } from '@/styles/theme'

describe('LUMI search view restored styling', () => {
  test('should include hero image treatment, centered white content panel and dark count text', () => {
    expect(lumiAifEtsinTheme.ui.hero.primaryBackgroundSize).toBe('50% auto')
    expect(etsinTheme.ui.hero.primaryBackgroundSize).toBe('cover')
    expect(lumiAifEtsinTheme.ui.search.resultsPanel.margin).toBe('0.75rem auto')
    expect(lumiAifEtsinTheme.ui.search.resultsPanel.width).toBe('calc(100% - 1.5rem)')
    expect(lumiAifEtsinTheme.ui.search.resultsPanel.marginTop).toBe('1rem')
    expect(etsinTheme.ui.search.resultsPanel.marginTop).toBe('3rem')
    expect(lumiAifEtsinTheme.ui.search.resultsAmountPeriod.color).toBe('#231f20')
    expect(lumiAifEtsinTheme.ui.search.noResultsHint.color).toBe('#231f20')
  })
})
