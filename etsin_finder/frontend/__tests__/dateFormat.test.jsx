import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme';
import DateFormat from '../js/components/dataset/data/dateFormat'
import Locale from '../js/stores/view/language'

it('renders without crashing', () => {
  shallow(<DateFormat />)
})
describe('check date', () => {
  it('should contain english date', () => {
    Locale.setLang('en')
    const dateformat = shallow(<DateFormat date={1516007145830} />)
    expect(dateformat.find('span').text()).toContain('January 15, 2018')
  })
  it('should contain the translated (finnish) date', () => {
    Locale.toggleLang()
    const dateformat = shallow(<DateFormat date={1516007145830} />)
    expect(dateformat.find('span').text()).toContain('1/15/2018')
  })
})
