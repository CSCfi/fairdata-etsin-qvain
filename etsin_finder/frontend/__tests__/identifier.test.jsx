import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme';
import Identifier from '../js/components/dataset/data/identifier'


it('renders without crashing', () => {
  shallow(<Identifier idn="" />)
})

describe('Identifier', () => {
  describe('render with empty idn', () => {
    const identifier = shallow(<Identifier idn="" classes="myclass myclass2">children</Identifier>);
    it('should render the children', () => {
      expect(identifier.text()).toEqual('children')
    })
    it('should not contain link', () => {
      expect(identifier.name()).toEqual('span')
    })
    it('should contain my custom classes', () => {
      expect(identifier.hasClass('myclass') && identifier.hasClass('myclass2')).toEqual(true)
    })
  })
  describe('render with doi idn', () => {
    const identifier = shallow(<Identifier idn="https://doi.org/123123" classes="myclass myclass2">children</Identifier>)
    it('should render a link', () => {
      expect(identifier.name()).toEqual('a')
    })
    it('should contain my url', () => {
      expect(identifier.props().href).toEqual('https://doi.org/123123')
    })
  })
  describe('render with http idn', () => {
    const identifier = shallow(<Identifier idn="http://something.fi/1234" classes="myclass myclass2">children</Identifier>)
    it('should render a link', () => {
      expect(identifier.name()).toEqual('a')
    })
    it('should contain my url', () => {
      expect(identifier.props().href).toEqual('http://something.fi/1234')
    })
  })
  describe('render with random text', () => {
    const identifier = shallow(<Identifier idn="page.fi" classes="myclass myclass2">children</Identifier>)
    it('should not contain my url', () => {
      expect(identifier.name()).toEqual('span')
    })
  })
})
