import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import { MemoryRouter, Route, Routes } from 'react-router-dom'

import theme from '@/styles/theme'
import { StoresProvider } from '@/stores/stores'

export const contextRenderer = (component, { stores = null, urls = null } = {}) => {
  let components = <ThemeProvider theme={theme}>{component}</ThemeProvider>

  if (stores) {
    components = <StoresProvider store={stores}>{components}</StoresProvider>
  }

  if (urls) {
    components = (
      <MemoryRouter initialEntries={urls}>
        <Routes>
          <Route path={urls[0]}>{components}</Route>
        </Routes>
      </MemoryRouter>
    )
  }

  return render(components)
}

export default contextRenderer
