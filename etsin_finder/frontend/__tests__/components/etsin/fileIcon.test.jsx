import React from 'react'
import { shallow } from 'enzyme'
import FileIcon from '../../../js/components/dataset/data/fileIcon'

describe('FileIcon', () => {
  const fileIcon = shallow(<FileIcon />)
  it('should return a icon', () => {
    expect(fileIcon.get(0).props.children[1].props.icon.iconName).toEqual('file')
  })
  it('should return video icon', () => {
    fileIcon.setProps({ type: { pref_label: { fi: 'Video' }, identifier: 'id' } })
    expect(fileIcon.get(0).props.children[1].props.children.props.icon.iconName).toEqual(
      'file-video'
    )
  })
  it('should return text icon', () => {
    fileIcon.setProps({ type: { pref_label: { en: 'Text' }, identifier: 'id' } })
    expect(fileIcon.get(0).props.children[1].props.children.props.icon.iconName).toEqual('file-alt')
  })
  it('should return dir icon', () => {
    fileIcon.setProps({ type: 'dir' })
    expect(fileIcon.get(0).props.children[1].props.icon.iconName).toEqual('folder')
  })
})
