import React from 'react'
import { mount } from 'enzyme'

// fills withFieldErrorBoundaryTranslationList as a side effect
import '@/components/qvain/views/main'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'

import {
  FieldErrorBoundary,
  withFieldErrorBoundaryTranslationList,
} from '@/components/qvain/general/errors/fieldErrorBoundary'

describe('FieldErrorBoundary', () => {
  const DumbComponent = () => {
    return 'hello world'
  }

  let wrapper
  let stores
  const errorDetails = 'tymä virhe'

  beforeEach(() => {
    stores = buildStores()
    stores.Locale.setMissingTranslationHandler(key => key)
    wrapper = mount(
      <StoresProvider store={stores}>
        <FieldErrorBoundary field="test.dumbField">
          <DumbComponent />
        </FieldErrorBoundary>
      </StoresProvider>
    )
    wrapper.find(DumbComponent).simulateError(errorDetails)
  })

  it('should show field title', () => {
    wrapper.text().should.contain('test.dumbField')
  })

  it('should not show details by default', () => {
    wrapper.text().should.not.contain(errorDetails)
  })

  it('should show details when "show details" is clicked', () => {
    const detailsButton = wrapper.find('button')
    detailsButton.simulate('click')
    wrapper.text().should.contain('test.dumbField')
  })
})

describe('withFieldErrorBoundary', () => {
  it('should use correct translations', () => {
    const stores = buildStores()
    let errors = []
    stores.Locale.setMissingTranslationHandler(key => {
      errors.push(key)
      return `translation ${key} does not exist`
    })
    withFieldErrorBoundaryTranslationList.forEach(key => {
      stores.Locale.translate(key).should.be.a('string')
    })
    errors.should.be.empty
  })
})
