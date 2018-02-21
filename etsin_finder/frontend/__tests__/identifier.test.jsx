import React from 'react'
import ReactDOM from 'react-dom' // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme'
import Identifier from '../js/components/dataset/data/identifier'

it('renders without crashing', () => {
  shallow(<Identifier idn="" />)
})

describe('Identifier', () => {
  describe('render with empty idn', () => {
    const identifier = shallow(
      <Identifier idn="" classes="myclass myclass2">
        children
      </Identifier>
    )
    it('should render the children', () => {
      expect(identifier.childAt(0).text()).toEqual('children')
    })
    it('should not contain link', () => {
      expect(identifier.name()).toEqual('styled.span')
    })
  })
})
