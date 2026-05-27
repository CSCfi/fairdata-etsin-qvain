import etsinTheme, { lumiAifEtsinTheme } from '@/styles/theme'

describe('Remote resources button icon/text alignment', () => {
  test('should keep icon buttons aligned and single-line after LUMI typography changes', () => {
    expect(etsinTheme.ui.dataset.iconButton.transform).toBe('none')
    expect(lumiAifEtsinTheme.ui.dataset.iconButton.transform).toBe('translateY(1px)')
  })
})
