import React from 'react'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// fills withFieldErrorBoundaryTranslationList as a side effect
import '@/components/qvain/views/main'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'

import {
  FieldErrorBoundary,
  withFieldErrorBoundaryTranslationList,
} from '@/components/qvain/general/errors/fieldErrorBoundary'

jest.spyOn(console, 'error').mockImplementation(() => {})

describe('FieldErrorBoundary', () => {
  const errorDetails = 'tymä virhe'
  const DumbComponent = () => {
    throw new Error(errorDetails)
  }

  let stores

  const renderError = () => {
    stores = buildStores()
    stores.Locale.setMissingTranslationHandler(key => key)
    render(
      <StoresProvider store={stores}>
        <FieldErrorBoundary field="test.dumbField">
          <DumbComponent />
        </FieldErrorBoundary>
      </StoresProvider>
    )
  }

  it('should show field title', () => {
    renderError()
    expect(
      screen.getByRole('heading', { name: 'There was an error rendering test.dumbField' })
    ).toBeInTheDocument()
    expect(screen.queryByText(errorDetails)).not.toBeInTheDocument() // details hidden by default
  })

  it('should show details when "show details" is clicked', async () => {
    renderError()
    const detailsButton = screen.getByRole('button', { name: 'Show details' })
    await userEvent.click(detailsButton)
    expect(screen.getByText(`Error: ${errorDetails}`, { exact: false })).toBeInTheDocument()
  })
})

describe('withFieldErrorBoundary', () => {
  it('should use correct translations', () => {
    const stores = buildStores()
    const errors = []
    stores.Locale.setMissingTranslationHandler(key => {
      errors.push(key)
      return `translation ${key} does not exist`
    })
    withFieldErrorBoundaryTranslationList.forEach(key => {
      stores.Locale.translate(key).should.be.a('string')
    })
    expect(errors).toEqual([])
  })
})
