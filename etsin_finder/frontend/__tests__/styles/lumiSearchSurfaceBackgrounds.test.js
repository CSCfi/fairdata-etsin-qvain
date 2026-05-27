import etsinTheme, { lumiAifEtsinTheme } from '@/styles/theme'

describe('LUMI search surface backgrounds', () => {
  test('should use white backgrounds for result cards and left filter sections', () => {
    expect(lumiAifEtsinTheme.ui.contentBox.backgroundColor).toBe('white')
    expect(lumiAifEtsinTheme.ui.search.filterContainerBg).toBe('white')
    expect(lumiAifEtsinTheme.ui.search.filterCategory.backgroundColor).toBe('#ffffff')
    expect(etsinTheme.ui.search.filterCategory.backgroundColor).toMatch(/rgb\(231/)
  })
})
