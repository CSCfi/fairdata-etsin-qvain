import React from 'react'
import { shallow } from 'enzyme'
import Translate from '@/utils/Translate'

import ValidationError, {
  ValidationErrorText,
} from '../../../js/components/qvain/general/errors/validationError'

describe('ValidationError', () => {
  it('should translate error', () => {
    const wrapper = shallow(<ValidationError>qvain.field.error</ValidationError>)
    wrapper.find(Translate).prop('content').should.eq('qvain.field.error')
  })

  it('should translate first error of array', () => {
    const wrapper = shallow(<ValidationError>{['qvain.error1', 'qvain.error2']}</ValidationError>)
    wrapper.find(Translate).prop('content').should.eql('qvain.error1')
  })

  it('should not re-translate error message', () => {
    const wrapper = shallow(<ValidationError>This is an error message</ValidationError>)
    wrapper.find(ValidationErrorText).prop('children').should.eq('This is an error message')
  })

  it('should not re-translate error message in array', () => {
    const wrapper = shallow(<ValidationError>{['This is an error message']}</ValidationError>)
    wrapper.find(ValidationErrorText).prop('children').should.eql(['This is an error message'])
  })

  it('should handle empty array', () => {
    const wrapper = shallow(<ValidationError>{[]}</ValidationError>)
    expect(wrapper.isEmptyRender()).toEqual(true)
  })
})
