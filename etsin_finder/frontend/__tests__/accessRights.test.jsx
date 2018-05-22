import React from 'react'
import ReactDOM from 'react-dom' // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme'
import { undecorated as AccessRights } from '../js/components/dataset/accessRights'
import etsinTheme from '../js/styles/theme.js'

it('renders without crashing', () => {
  shallow(<AccessRights Stores={{ Locale: { currenLang: 'en' } }} />)
})

describe('AccessRights', () => {
  describe('render without props', () => {
    const accessRights = shallow(
      <AccessRights Stores={{ Locale: { currenLang: 'en' } }} theme={etsinTheme} />
    )
    it('should render the div', () => {
      expect(accessRights.name()).toContain('div')
    })
  })
  describe('render with access rights true', () => {
    const accessRights = shallow(
      <AccessRights
        theme={etsinTheme}
        access_rights={{
          access_type: {
            identifier: 'http://purl.org/att/es/reference_data/access_type/access_type_open_access',
            pref_label: { fi: 'title' },
          },
        }}
        Stores={{ Locale: { currenLang: 'en' } }}
      />
    )
  })
  describe('render with access rights anything else', () => {
    const accessRights = shallow(
      <AccessRights
        theme={etsinTheme}
        access_rights={{ license: [{ identifier: 'something', pref_label: { fi: 'title' } }] }}
        Stores={{ Locale: { currenLang: 'en' } }}
      />
    )
    it('should render icon', () => {
      expect(
        accessRights
          .children()
          .childAt(0)
          .render()[0].name === 'svg'
      ).toEqual(true)
    })
  })
})
