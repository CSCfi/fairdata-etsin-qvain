import { lumiAifEtsinTheme } from '@/styles/theme'

const hexToRgb = hex => {
  const namedColors = {
    white: 'ffffff',
    black: '000000',
  }
  const normalizedColor = namedColors[hex.toLowerCase()] || hex.replace('#', '')
  const normalized = normalizedColor.replace('#', '')
  const bigint = Number.parseInt(normalized, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

const relativeLuminance = hex => {
  const { r, g, b } = hexToRgb(hex)
  const channel = value => {
    const normalized = value / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

const contrastRatio = (foreground, background) => {
  const fgL = relativeLuminance(foreground)
  const bgL = relativeLuminance(background)
  const lighter = Math.max(fgL, bgL)
  const darker = Math.min(fgL, bgL)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('LUMI theme WCAG AA contrast', () => {
  test('dataset title text over white content panel should meet 4.5:1', () => {
    expect(contrastRatio(lumiAifEtsinTheme.color.dark, lumiAifEtsinTheme.color.white)).toBeGreaterThanOrEqual(4.5)
  })

  test('pill text over lightgray should meet 4.5:1', () => {
    expect(contrastRatio('#000000', lumiAifEtsinTheme.color.lightgray)).toBeGreaterThanOrEqual(4.5)
  })

  test('success accent over white should meet 4.5:1', () => {
    expect(contrastRatio(lumiAifEtsinTheme.color.success, lumiAifEtsinTheme.color.white)).toBeGreaterThanOrEqual(
      4.5
    )
  })

  test('results amount text over white panel should meet 4.5:1', () => {
    expect(contrastRatio(lumiAifEtsinTheme.color.dark, lumiAifEtsinTheme.color.white)).toBeGreaterThanOrEqual(4.5)
  })
})
