import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { undecorated as AccessRights } from '../js/components/accessRights'


it('renders without crashing', () => {
  shallow(<AccessRights Stores={{Locale: { currenLang: 'en' }}}/>)
})

describe('AccessRights', () => {
  describe('render without props', () => {
    const accessRights = shallow(<AccessRights Stores={{Locale: { currenLang: 'en' }}}/>);
    it('should render the button', () => {
      expect(accessRights.type()).toEqual('button')
    })
    it('should be disabled', () => {
      expect(accessRights.prop('disabled')).toEqual(true)
    })
  })
  describe('render with access rights true', () => {
    const accessRights = shallow(<AccessRights access_rights={ { type: [{identifier: 'http://purl.org/att/es/reference_data/access_type/access_type_open_access', label: {'fi': 'title'}}] } } Stores={{Locale: { currenLang: 'en' }}} />);
    it('should render unclocked icon', () => {
      expect(accessRights.contains(<i className="fa fa-unlock" aria-hidden="true"></i>)).toEqual(true)
    })
  })
  describe('render with access rights anything else', () => {
    const accessRights = shallow(<AccessRights access_rights={ { license: [{identifier: 'something', label: {'fi': 'title'}}] } } Stores={{Locale: { currenLang: 'en' }}} />);
    it('should render locked icon', () => {
      expect(accessRights.contains(<i className="fa fa-lock" aria-hidden="true"></i>)).toEqual(true)
    })
  })
})
