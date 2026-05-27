import etsinTheme, { lumiAifEtsinTheme } from '@/styles/theme'

describe('LUMI dataset pill text color and background', () => {
  test('should keep pill text dark in LUMI theme for AA contrast and use Etsin lightgray background', () => {
    expect(lumiAifEtsinTheme.ui.dataset.accessRights.buttonColor).toBe('black')
    expect(lumiAifEtsinTheme.ui.dataset.title.labelColor).toBe('black')
    expect(lumiAifEtsinTheme.ui.search.resultsListAccessRights.linkColor).toBe('black')
    expect(etsinTheme.ui.search.resultsListAccessRights.linkColor).toBe('inherit')
  })
})
