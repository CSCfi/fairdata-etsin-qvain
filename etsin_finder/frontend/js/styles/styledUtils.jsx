{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import theme from './theme'

// check if there is a color matching the string in the theme
const checkColor = color => {
  if (theme.color[color]) {
    return theme.color[color]
  }
  return color
}

export default checkColor
