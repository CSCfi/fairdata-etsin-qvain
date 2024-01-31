import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { Route } from 'react-router-dom/cjs/react-router-dom.min'

import theme from '@/styles/theme'
import '@/../locale/translations'
import { StoresProvider } from '@/stores/stores'

export const contextRenderer = ({ Component, props = {}, stores = null, urls = null }) => {
  let Rendable = () => (
    <ThemeProvider theme={theme}>
      <Component {...props} />
    </ThemeProvider>
  )
  if (stores) {
    Rendable = () => (
      <StoresProvider store={stores}>
        <Rendable />
      </StoresProvider>
    )
  }

  if (urls) {
    Rendable = () => (
      <MemoryRouter initialEntries={urls}>
        <Route path={urls[0]} Rendable={Rendable} />
      </MemoryRouter>
    )
  }

  return render(<Rendable />)
}

export default contextRenderer
