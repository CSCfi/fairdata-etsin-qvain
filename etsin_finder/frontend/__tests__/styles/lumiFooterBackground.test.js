import etsinTheme, { lumiAifEtsinTheme } from '@/styles/theme'

describe('LUMI footer background', () => {
  test('LUMI theme uses white footer surface token; default Etsin is transparent', () => {
    expect(lumiAifEtsinTheme.ui.footer.backgroundColor).toBe('white')
    expect(etsinTheme.ui.footer.backgroundColor).toBe('transparent')
  })
})
