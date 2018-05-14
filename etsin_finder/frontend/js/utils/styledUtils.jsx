import theme from '../theme'

// check if there is a color matching the string in the theme
const checkColor = color => {
  if (theme.color[color]) {
    return theme.color[color]
  }
  return color
}

export default checkColor
