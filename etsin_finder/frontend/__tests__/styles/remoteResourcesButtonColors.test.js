import etsinTheme, { lumiAifEtsinTheme } from '@/styles/theme'

describe('Remote resources button colors', () => {
  test('should keep original fixed info/external button colors and use LUMI secondary token for download', () => {
    expect(etsinTheme.ui.dataset.remoteResourceLink.color).toBe('#0E8632')
    expect(lumiAifEtsinTheme.ui.dataset.remoteResourceLink.color).toBe('#7477b8')
  })
})
