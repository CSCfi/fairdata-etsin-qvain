import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import { buildStores } from '@/stores'
import ValidationError from '../../../js/components/qvain/general/errors/validationError'
import { StoresProvider } from '../../../js/stores/stores'
import etsinTheme from '@/styles/theme'

const stores = buildStores()

// Mock translation with 'some.translation' -> 't:some.translation'
stores.Locale.translate = v => `t:${v}`

describe('ValidationError', () => {
  const renderError = children => {
    render(
      <ThemeProvider theme={etsinTheme}>
        <StoresProvider store={stores}>
          <ValidationError>{children}</ValidationError>
        </StoresProvider>
      </ThemeProvider>
    )
  }

  it('should translate error', () => {
    renderError('qvain.field.error')
    expect(document.body.textContent).toBe('t:qvain.field.error')
  })

  it('should translate first error of array', () => {
    renderError(['qvain.error1', 'qvain.error2'])
    expect(document.body.textContent).toBe('t:qvain.error1')
  })

  it('should not re-translate error message', () => {
    renderError('This is an error message')
    expect(document.body.textContent).toBe('This is an error message')
  })

  it('should not re-translate error message in array', () => {
    renderError(['This is an error message'])
    expect(document.body.textContent).toBe('This is an error message')
  })

  it('should handle empty array', () => {
    renderError([])
    expect(document.body.textContent).toBe('')
  })
})
