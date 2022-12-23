import React from 'react'
import { shallow } from 'enzyme'

import QvainHeader from '../../../js/components/qvain/general/header'
import { useStores } from '../../../js/stores/stores'
import Navi from '../../../js/components/general/navigation'
import Settings from '../../../js/components/general/navigation/settings'
import { FAIRDATA_WEBSITE_URL } from '../../../js/utils/constants'

jest.mock('../../../js/stores/stores', () => ({
  useStores: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  NavLink: () => null,
}))

jest.mock('../../../js/components/general/navigation/loginButton', () => () => null)

const createLabel = 'qvain.nav.createDataset'
const editLabel = 'qvain.nav.editDataset'

describe('QvainHeader', () => {
  let wrapper
  const Stores = { Qvain: { original: undefined }, Locale: { lang: 'en' } }

  beforeEach(() => {
    useStores.mockReturnValue(Stores)
    wrapper = shallow(<QvainHeader Stores={Stores} />)
  })

  test('it exists', () => {
    expect(wrapper.exists()).toBe(true)
  })

  test('Navi.props.routes[1].label should be createLabel', () => {
    const navi = wrapper.find(Navi)
    expect(navi.exists()).toBe(true)
    navi.prop('routes')[1].label.should.be.string(createLabel)
  })

  test('Settings.props.helpUrl should be enUrl', () => {
    const settings = wrapper.find(Settings)
    expect(settings.exists()).toBe(true)
    settings.prop('helpUrl').should.be.string(FAIRDATA_WEBSITE_URL.QVAIN.EN)
  })

  describe('given Qvain.original exists', () => {
    beforeEach(() => {
      Stores.Qvain = { original: 'exists' }
      wrapper = shallow(<QvainHeader Stores={Stores} />)
    })

    test('Navi.props.routes[1].label should editLabel', () => {
      const navi = wrapper.find(Navi)
      expect(navi.exists()).toBe(true)
      navi.prop('routes')[1].label.should.be.string(editLabel)
    })
  })

  describe('given Qvain.Locale.lang set to fi', () => {
    beforeEach(() => {
      Stores.Locale = { lang: 'fi' }
      wrapper = shallow(<QvainHeader Stores={Stores} />)
    })

    test('Settings.props.helpUrl should be fiUrl', () => {
      const settings = wrapper.find(Settings)
      expect(settings.exists()).toBe(true)
      settings.prop('helpUrl').should.be.string(FAIRDATA_WEBSITE_URL.QVAIN.FI)
    })
  })
})
