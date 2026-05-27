import etsinTheme, { lumiAifEtsinTheme } from '@/styles/theme'

describe('LUMI dataset detail card surface', () => {
  test('should use white content card background, bgSecondary borders, and dark dataset title text', () => {
    expect(lumiAifEtsinTheme.ui.dataset.content.backgroundColor).toBe('white')
    expect(lumiAifEtsinTheme.ui.dataset.title.headingColor).toBe('#231f20')
    expect(lumiAifEtsinTheme.ui.dataset.sidebarArea.backgroundColor).toBe('#e2e6f0')
    expect(etsinTheme.ui.dataset.sidebarArea.backgroundColor).toBe('#E5EFF1')
  })
})
