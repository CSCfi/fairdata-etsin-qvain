import React from 'react'
import { shallow } from 'enzyme'
import { ModalInfo } from '../js/components/dataset/downloads/infoModal'

it('renders without crashing', () => {
  shallow(<ModalInfo name="" id="" title="" size="" category="" type="" />)
})

describe('Visible fields', () => {
  describe('should display name', () => {
    const Modal = shallow(
      <ModalInfo
        name="Cool"
        id="Identifier"
        title="Amazing"
        size="10 Bytes"
        category="Kat"
        type="file"
      />
    )
    it('should render the children', () => {
      expect(Modal.contains('Cool')).toEqual(true)
    })
    it('should have the name', () => {
      expect(Modal.find('tbody').html()).toContain('Cool')
    })
    it('should contain id', () => {
      expect(Modal.find('tbody').html()).toContain('Identifier')
    })
    it('should contain id', () => {
      expect(Modal.find('tbody').html()).toContain('Identifier')
    })
    it('should contain title', () => {
      expect(Modal.find('tbody').html()).toContain('Amazing')
    })
    it('should contain size', () => {
      expect(Modal.find('tbody').html()).toContain('10 Bytes')
    })
    it('should contain category', () => {
      expect(Modal.find('tbody').html()).toContain('Kat')
    })
    it('should contain icon for type', () => {
      expect(Modal.childAt(0).html()).toContain('data-icon="file"')
    })
  })
})
