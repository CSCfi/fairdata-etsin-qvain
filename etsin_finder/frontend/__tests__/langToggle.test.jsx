import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme';
import LangToggle from '../js/components/general/navigation/langToggle'
import Locale from '../js/stores/view/language'

it('renders without crashing', () => {
  shallow(<LangToggle />)
})
describe('language switching', () => {
  it('should display other language', () => {
    Locale.setLang('fi')
    const langtoggle = shallow(<LangToggle />)
    expect(langtoggle.text()).toContain('en')
  })
  it('should switch to other language', () => {
    const langtoggle = shallow(<LangToggle />)
    const inst = langtoggle.instance()
    inst.changeLang()
    expect(inst.state.language).toContain('en')
  })
})
