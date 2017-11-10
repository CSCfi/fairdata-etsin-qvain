import React from 'react';
import ReactDOM from 'react-dom';
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
      it('should have store', () => {
        expect(typeof MyApp.children().props().Stores).toEqual('object')
      })
      it('stores should have history', () => {
        expect(typeof MyApp.children().props().Stores.History).toEqual('object')
      })
      it('stores should have locale', () => {
        expect(typeof MyApp.children().props().Stores.Locale).toEqual('object')
      })
    })
  })
})