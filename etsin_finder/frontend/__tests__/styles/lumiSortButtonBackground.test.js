import etsinTheme, { lumiAifEtsinTheme } from '@/styles/theme'

describe('LUMI sort button background', () => {
  test('LUMI theme uses white sort control surface; default Etsin is transparent', () => {
    expect(lumiAifEtsinTheme.ui.search.sortControl.backgroundColor).toBe('white')
    expect(etsinTheme.ui.search.sortControl.backgroundColor).toBe('transparent')
  })
})
