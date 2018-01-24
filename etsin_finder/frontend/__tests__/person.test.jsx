import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme';
import Person from '../js/components/dataset/person'

it('renders without crashing', () => {
  shallow(<Person />)
})
describe('Person without props', () => {
  const person = shallow(<Person />)
  it('should be empty', () => {
    expect(person.text()).toEqual('')
  })
})

describe('person with creator object', () => {
  const myCreator = [{ type: 'Organization', email: 'marjo.vesalainen@helsinki.fi', name: { en: 'University of Helsinki' } }]
  const person = shallow(<Person creator={myCreator} />)
  it('should have class creator', () => {
    expect(person.hasClass('creator')).toEqual(true)
  })
  it('should display creator', () => {
    expect(person.text()).toContain('University of Helsinki')
  })
  it('should contain translation in singular', () => {
    expect(person.children().first().props().content).toContain('dataset.creator.snglr')
  })
})

describe('person with multiple creators', () => {
  const myCreator = [
    { type: 'Organization', email: 'marjo.vesalainen@helsinki.fi', name: { en: 'University of Helsinki' } },
    { type: 'Organization', email: 'marjo.vesalainen@helsinki.fi', name: { en: 'Second creator' } },
  ]
  const person = shallow(<Person creator={myCreator} />)
  it('should contain translation in plural', () => {
    expect(person.children().first().props().content).toContain('dataset.creator.plrl')
  })
  it('should contain both creators, separated by ,', () => {
    expect(person.text()).toContain('University of Helsinki, Second creator')
  })
})

describe('person with contributor object', () => {
  const myContributor = [{ type: 'Organization', email: 'marjo.vesalainen@helsinki.fi', name: { en: 'University of Helsinki' } }]
  const person = shallow(<Person contributor={myContributor} />)
  it('should have class contributor', () => {
    expect(person.hasClass('contributor')).toEqual(true)
  })
  it('should display contributor', () => {
    expect(person.text()).toContain('University of Helsinki')
  })
  it('should contain translation in singular', () => {
    expect(person.children().first().props().content).toContain('dataset.contributor.snglr')
  })
})