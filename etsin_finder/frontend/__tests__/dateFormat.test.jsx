import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme';
import DateFormat from '../js/components/dataset/data/dateFormat'

it('renders without crashing', () => {
  shallow(<DateFormat />)
})
describe('check date', () => {
  it('should contain date', () => {
    const dateformat = shallow(<DateFormat date={1000000} />)
    expect(dateformat.find('span').text()).toContain('1970')
  })
})
