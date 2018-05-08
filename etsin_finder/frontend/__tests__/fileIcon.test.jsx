import React from 'react'
import { shallow } from 'enzyme'
import FileIcon from '../js/components/dataset/data/fileIcon'

describe('FileIcon', () => {
  const fileIcon = shallow(<FileIcon />)
  it('should return a icon', () => {
    expect(fileIcon.get(0).props.icon.iconName).toEqual('file')
  })
  it('should return video icon', () => {
    fileIcon.setProps({ type: 'Video' })
    expect(fileIcon.childAt(0).get(0).props.icon.iconName).toEqual('file-video')
  })
  it('should return text icon', () => {
    fileIcon.setProps({ type: 'Text' })
    expect(fileIcon.childAt(0).get(0).props.icon.iconName).toEqual('file-alt')
  })
  it('should return dir icon', () => {
    fileIcon.setProps({ type: 'dir' })
    expect(fileIcon.get(0).props.icon.iconName).toEqual('folder')
  })
})
