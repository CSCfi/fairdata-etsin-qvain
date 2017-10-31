import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import DateFormat from '../js/components/dateFormat'

it('renders without crashing', () => {
  shallow(<DateFormat />)
})
