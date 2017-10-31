import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import DsSidebarItem from '../js/components/dsSidebarItem'

it('renders without crashing', () => {
  shallow(<DsSidebarItem />)
})

describe('DsSidebarItem', () => {
  describe('render with content', () => {
    const sidebarItem = shallow(<DsSidebarItem component="p" trans="dataset.project" fallback="Project" hideEmpty="true">Hello</DsSidebarItem>);
    it('should render the children', () => {
      expect(sidebarItem.contains('Hello')).toEqual(true)
    })
    it('should have the title', () => {
      expect(sidebarItem.childAt(0).html()).toEqual('<h4>Project</h4>')
    })
  })
  describe('render without content', () => {
    const sidebarItem = shallow(<DsSidebarItem component="p" trans="dataset.project" fallback="Project" hideEmpty="true">{null}</DsSidebarItem>);
    it('should render nothing', () => {
      expect(sidebarItem.html()).toEqual(null)
    })
  })
})
