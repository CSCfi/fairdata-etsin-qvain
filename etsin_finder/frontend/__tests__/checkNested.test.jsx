import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';

import checkNested from '../js/components/checkNested'

describe('CheckNested function', () => {
  const researchDataset = {publisher: {name: "Bob"}}
  it('should return false for no object', () => {
    const checked = checkNested()
    expect(checked).toEqual(false)
  })
  it('should return false for undefined object', () => {
    const checked = checkNested(researchDataset, 'bob')
    expect(checked).toEqual(false)
  })
  it('should return true for defined object', () => {
    const checked = checkNested(researchDataset, 'publisher', 'name')
    expect(checked).toEqual(true)
  })
})