import React from 'react';
import { shallow, mount } from 'enzyme'

import Qvain from '../js/components/qvain'
import Participants, {
  ParticipantSelection,
  AddedParticipant,
  EntityType,
  Role
} from '../js/components/qvain/participants'
import {Qvain as QvainStore} from '../js/stores/view/qvain'

describe('Qvain', () => {
  it('should render correctly', () => {
    const component = shallow(<Qvain />)

    expect(component).toMatchSnapshot()
  })
})

const setup = (renderFunc) => renderFunc(<Participants Stores={{Qvain: QvainStore}} />)

describe('Qvain.Participants', () => {
  it('should render correctly', () => {
    const component = setup(shallow)

    expect(component).toMatchSnapshot()
  })

  it('should render person participant form by default', () => {
    const component = mount(<Participants Stores={{Qvain: new QvainStore()}} />)
    // test if active selection field displays 'Person'
    expect(component.find(ParticipantSelection).html().includes(EntityType.PERSON)).toBe(true)
    // test if name field is rendered
    expect(component.find('#nameField').length).not.toBe(0)
  })

  // By default person should be selected. Upon clicking the Organization radio button
  // the checkboxes should be reset and active selection field should display
  // 'Organization'
  it('should change selected participant entity', () => {
    const component = mount(<Participants Stores={{Qvain: new QvainStore()}} />)
    expect(component.find(ParticipantSelection).html().includes(EntityType.PERSON)).toBe(true)
    component.find('#personCreator').first().simulate('change', { target: { checked: true, value: Role.CREATOR } })
    const isPersonCreator = component.find(ParticipantSelection).html().includes(Role.CREATOR)
    expect(isPersonCreator).toBe(true)
    component.find('#entityOrg').first().simulate('change')
    expect(component.find(ParticipantSelection).html().includes(EntityType.ORGANIZATION)).toBe(true)
    expect(component.find(ParticipantSelection).html().includes(Role.CREATOR)).toBe(false)
  })

  // Added participants should be listed if there are any
  it('should list all added participants', () => {
    const store = new QvainStore()
    const component = mount(<Participants Stores={{Qvain: store}} />)
    expect(component.find(AddedParticipant).length).toBe(0)
    store.addParticipant({
      entityType: EntityType.ORGANIZATION,
      roles: [Role.PUBLISHER],
      name: 'University of Helsinki',
      email: 'test@test.fi',
      identifier: 'uoh'
    })
    component.update()
    expect(component.find(AddedParticipant).length).toBe(1)
  })
})
