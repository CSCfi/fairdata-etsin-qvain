import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme';
import SidebarItem from '../js/components/dataset/SidebarItem'

it('renders without crashing', () => {
  shallow(<SidebarItem />)
})

describe('DsSidebarItem', () => {
  describe('render with content', () => {
    const sidebarItem = shallow(<SidebarItem component="p" trans="dataset.project" fallback="Project" hideEmpty="true">Hello</SidebarItem>);
    it('should render the children', () => {
      expect(sidebarItem.contains('Hello')).toEqual(true)
    })
    it('should have the title', () => {
      expect(sidebarItem.childAt(0).html()).toEqual('<h4>Project</h4>')
    })
  })
  describe('render without content', () => {
    const sidebarItem = shallow(<SidebarItem component="p" trans="dataset.project" fallback="Project" hideEmpty="true">{null}</SidebarItem>);
    it('should render nothing', () => {
      expect(sidebarItem.html()).toEqual(null)
    })
  })
})
