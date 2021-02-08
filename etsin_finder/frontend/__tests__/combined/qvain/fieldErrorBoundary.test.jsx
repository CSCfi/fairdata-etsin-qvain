import React from 'react'
import translate from 'counterpart'
import 'chai/register-should'
import { mount } from 'enzyme'

// fills withFieldErrorBoundaryTranslationList as a side effect
import '../../../js/components/qvain/views/main'

import '../../../locale/translations'

translate.registerTranslations('en', { test: { dumbField: 'Dummy Field' } })

import {
  FieldErrorBoundary,
  withFieldErrorBoundaryTranslationList,
} from '../../../js/components/qvain/general/errors/fieldErrorBoundary'

describe('FieldErrorBoundary', () => {
  const DumbComponent = () => {
    return 'hello world'
  }

  let wrapper
  const errorDetails = 'tymä virhe'

  beforeEach(() => {
    wrapper = mount(
      <FieldErrorBoundary field="test.dumbField">
        <DumbComponent />
      </FieldErrorBoundary>
    )
    wrapper.find(DumbComponent).simulateError(errorDetails)
  })

  it('should show field title', () => {
    wrapper.text().should.contain(translate('test.dumbField'))
  })

  it('should not show details by default', () => {
    wrapper.text().should.not.contain(errorDetails)
  })

  it('should show details when "show details" is clicked', () => {
    const detailsButton = wrapper.find('button')
    detailsButton.simulate('click')
    wrapper.text().should.contain(translate('test.dumbField'))
  })
})

describe('withFieldErrorBoundary', () => {
  let errors = []
  translate.setMissingEntryGenerator(key => {
    errors.push(key)
    return `translation ${key} does not exist`
  })

  it('should use correct translations', () => {
    withFieldErrorBoundaryTranslationList.forEach(key => {
      translate(key).should.be.a('string')
    })
    errors.should.be.empty
  })
})
