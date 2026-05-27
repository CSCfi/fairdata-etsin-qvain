import etsinTheme, { lumiAifEtsinTheme } from '@/styles/theme'

describe('LUMI identifier row optical alignment', () => {
  test('should apply optical vertical alignment fixes for identifier text and copy button', () => {
    expect(lumiAifEtsinTheme.ui.dataset.sidebarIdentifier.copyButtonTransform).toBe(
      'translateY(1px)'
    )
    expect(etsinTheme.ui.dataset.sidebarIdentifier.copyButtonTransform).toBe('none')
  })
})
