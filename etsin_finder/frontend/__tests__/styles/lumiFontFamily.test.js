import etsinTheme, { lumiAifEtsinTheme } from '@/styles/theme'

describe('LUMI font family', () => {
  test('should use Mr Eaves XL Mod OT in global styles for LUMI theme', () => {
    expect(lumiAifEtsinTheme.ui.body.fontFamily).toContain('Mr Eaves')
    expect(lumiAifEtsinTheme.ui.paragraph.fontSize).toBe('calc(1em + 1px)')
    expect(lumiAifEtsinTheme.ui.body.letterSpacing).toBe('1px')
    expect(etsinTheme.ui.body.letterSpacing).toBe('normal')
  })
})
