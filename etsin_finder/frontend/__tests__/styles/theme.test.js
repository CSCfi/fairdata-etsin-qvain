import etsinTheme, { getThemeByApp, lumiAifEtsinTheme } from '@/styles/theme'

describe('theme selection by app', () => {
  test('when app is lumi-aif.etsin, should return the LUMI-AIF theme', () => {
    const selectedTheme = getThemeByApp('lumi-aif.etsin')

    expect(selectedTheme).toBe(lumiAifEtsinTheme)
    expect(selectedTheme.color.primary).toBe('#2c6789')
    expect(selectedTheme.color.primaryDark).toBe('#231f20')
    expect(selectedTheme.color.bgPrimary).toBe('#231f20')
    expect(selectedTheme.color.secondary).toBe('#7477b8')
    expect(selectedTheme.color.bgSecondary).toBe('#e2e6f0')
    expect(selectedTheme.color.bgLight).toBe('#7477b8')
    expect(selectedTheme.color.bgGreen).toBe('#7477b8')
    expect(selectedTheme.color.primaryLight).toBe('#7477b8')
    expect(selectedTheme.color.lightgray).toBe('#ffffff')
    expect(selectedTheme.color.superlightgray).toBe('#ffffff')
    expect(selectedTheme.color.success).toBe('#2c6789')
    expect(selectedTheme.color.dark).toBe('#231f20')
    expect(selectedTheme.color.darker).toBe('#231f20')
    expect(selectedTheme.color.itemBackgroundLight).toBe('#ffffff')
  })

  test('when app is etsin, should return the default Etsin theme', () => {
    const selectedTheme = getThemeByApp('etsin')

    expect(selectedTheme).toBe(etsinTheme)
    expect(selectedTheme.color.primary).toBe('#007FAD')
  })

  test('when app is not provided, should return the default Etsin theme', () => {
    const selectedTheme = getThemeByApp(undefined)

    expect(selectedTheme).toBe(etsinTheme)
  })
})
