import React from 'react'
import ReactDOM from 'react-dom' // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme'
import { undecorated as AccessRights } from '../js/components/dataset/data/accessRights'
import theme from '../js/theme.js'

it('renders without crashing', () => {
  shallow(<AccessRights Stores={{ Locale: { currenLang: 'en' } }} />)
})

describe('AccessRights', () => {
  describe('render without props', () => {
    const accessRights = shallow(
      <AccessRights Stores={{ Locale: { currenLang: 'en' } }} theme={theme} />
    )
    it('should render the div', () => {
      expect(accessRights.html()).toEqual('div')
    })
    it('should be disabled', () => {
      expect(accessRights.prop('disabled')).toEqual(true)
    })
  })
  describe('render with access rights true', () => {
    const accessRights = shallow(
      <AccessRights
        theme={theme}
        access_rights={{
          type: [
            {
              identifier:
                'http://purl.org/att/es/reference_data/access_type/access_type_open_access',
              pref_label: { fi: 'title' },
            },
          ],
        }}
        Stores={{ Locale: { currenLang: 'en' } }}
      />
    )
    it('should render unclocked icon', () => {
      expect(accessRights.contains(<i className="fa fa-unlock" aria-hidden="true" />)).toEqual(true)
    })
  })
  describe('render with access rights anything else', () => {
    const accessRights = shallow(
      <AccessRights
        theme={theme}
        access_rights={{ license: [{ identifier: 'something', pref_label: { fi: 'title' } }] }}
        Stores={{ Locale: { currenLang: 'en' } }}
      />
    )
    it('should render locked icon', () => {
      expect(accessRights.contains(<i className="fa fa-lock" aria-hidden="true" />)).toEqual(true)
    })
  })
})
