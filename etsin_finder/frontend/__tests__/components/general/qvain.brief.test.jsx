import React from 'react'
import { shallow } from 'enzyme'
import 'chai/register-expect'

import Brief from '../../../js/components/qvain/general/section/brief'
import { element } from 'prop-types'

describe('Brief', () => {})
let brief

const props = {
  title: 'title',
  description: 'description',
}

describe('given required props', () => {
  beforeEach(() => {
    brief = shallow(<Brief {...props} />)
  })

  test('should have Translate with content:title', () => {
    const title = brief.findWhere(elem => elem.props().content === props.title)
    title.exists().should.be.true
  })
  test('should have Translate with content:description', () => {
    const description = brief.findWhere(elem => elem.props().content === props.description)
    description.exists().should.be.true
  })
})
