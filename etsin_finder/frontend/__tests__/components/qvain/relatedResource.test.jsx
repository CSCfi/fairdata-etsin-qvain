import React from 'react'
import { shallow } from 'enzyme'
import { RelatedResource } from '../../../js/components/qvain/fields/history/relatedResource'

describe('RelatedResource', () => {
  let wrapper
  let Field
  beforeEach(() => {
    wrapper = shallow(<RelatedResource />)
    Field = wrapper.find('Field')
  })
  test('it renders', () => {
    expect(wrapper).toMatchSnapshot()
  })
  test('it renders Field', () => {
    expect(Field.debug()).toBeTruthy()
  })
})
