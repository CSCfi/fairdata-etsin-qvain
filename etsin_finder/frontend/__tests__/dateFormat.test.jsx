import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import { shallow, mount } from 'enzyme';
import DateFormat from '../js/components/dataset/data/dateFormat'

it('renders without crashing', () => {
  shallow(<DateFormat />)
})
describe('check date', () => {
  it('should contain date', () => {
    const dateformat = mount(<DateFormat />)
    console.log(dateformat)
    expect(dateformat).toContain('hello')
  })
})
