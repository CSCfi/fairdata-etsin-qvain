import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import theme from '@/styles/theme'
import '@/../locale/translations'

export const ComponentHarness = (Component, props) => {
  return render(
    <ThemeProvider theme={theme}>
      <Component {...props}></Component>
    </ThemeProvider>
  )
}

export default ComponentHarness
