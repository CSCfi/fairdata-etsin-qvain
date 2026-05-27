import etsinTheme, { lumiAifEtsinTheme } from '@/styles/theme'

describe('LUMI search typography scale', () => {
  test('should increase filter and sorting control font sizes in LUMI theme', () => {
    expect(lumiAifEtsinTheme.ui.search.filterCategory.fontSize).toBe('calc(1em + 1px)')
    expect(etsinTheme.ui.search.filterCategory.fontSize).toBe('1em')
  })

  test('should keep search result description text at default size', () => {
    expect(lumiAifEtsinTheme.ui.search.resultListItemTitle.fontSize).toBe('calc(1.4em + 1px)')
    expect(etsinTheme.ui.search.resultListItemTitle.fontSize).toBe('1.4em')
  })
})
