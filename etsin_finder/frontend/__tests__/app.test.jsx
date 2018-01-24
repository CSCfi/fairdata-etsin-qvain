import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import { shallow, mount } from 'enzyme';
import App from '../js/app'

describe('mount app', () => {
  it('renders without crashing', () => {
    mount(<App />)
  })
  describe('has store', () => {
    const MyApp = shallow(<App />);
    it('should have class App', () => {
      expect(MyApp.find('.app').exists()).toEqual(true)
    })
    describe('Check children', () => {
      it('should have two children', () => {
        expect(MyApp.children().length).toEqual(2)
      })
      it('should have store', () => {
        expect(typeof MyApp.children().last().props().Stores).toEqual('object')
      })
      it('stores should have locale', () => {
        expect(typeof MyApp.children().last().props().Stores.Locale).toEqual('object')
      })
    })
  })
})
