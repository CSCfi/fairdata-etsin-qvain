import React from 'react'
import { shallow } from 'enzyme'
import { runInAction } from 'mobx'

import { AskForAccess } from '@/components/etsin/Dataset/Description/askForAccess'
import AccessClass from '@/stores/view/access'
import LocaleClass from '@/stores/view/locale'
import AuthClass from '@/stores/domain/auth'
import REMSButton from '@/components/etsin/Dataset/Description/REMSButton'
import Loader from '@/components/general/loader'
import { useStores } from '../../../js/stores/stores'

const Access = new AccessClass()
const Auth = new AuthClass()
const Locale = new LocaleClass()
jest.mock('../../../js/stores/stores')

const getStores = () => {
  const stores = {
    Access,
    Auth,
    Locale,
  }
  useStores.mockReturnValue(stores)
  return stores
}

const access = {
  access_type: {
    identifier: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/permit',
  },
}

describe('AskForAccess', () => {
  it('should render null', () => {
    const stores = getStores()
    const wrapper = shallow(<AskForAccess Stores={stores} cr_id="test" />)
    expect(wrapper.type()).toEqual(null)
  })

  it('should render AskForAccess as disabled button', () => {
    // User is not logged in so button is rendered but disabled
    const stores = getStores()
    stores.Access.updateAccess(access, false, 'apply')
    const wrapper = shallow(<AskForAccess Stores={stores} cr_id="test" />)
    expect(wrapper.find('#disabled-rems-button').prop('disabled')).toEqual(true)
  })

  it('should render AskForAccess with REMSButton', () => {
    // User is logged in so it renders the REMSButton
    const stores = getStores()
    stores.Access.updateAccess(access, false, 'apply')
    runInAction(() => {
      stores.Auth.userLogged = true
    })
    const wrapper = shallow(<AskForAccess Stores={stores} cr_id="test" />)
    expect(wrapper.find(REMSButton).length).toBe(1)
  })
})

describe('REMSButton', () => {
  it('should render REMSButton as disabled', () => {
    const wrapper = shallow(<REMSButton applicationState="disabled" loading={false} />)
    expect(wrapper.find('#rems-button-error').prop('disabled')).toEqual(true)
  })
  it('should render REMSButton for apply', () => {
    const wrapper = shallow(
      <REMSButton applicationState="apply" loading={false} onClick={() => {}} />
    )
    expect(wrapper.find('#rems-button-apply').length).toBe(1)
  })
  it('should render REMSButton for draft', () => {
    const wrapper = shallow(
      <REMSButton applicationState="draft" loading={false} onClick={() => {}} />
    )
    expect(wrapper.find('#rems-button-draft').length).toBe(1)
  })
  it('should render REMSButton for submitted', () => {
    const wrapper = shallow(
      <REMSButton applicationState="submitted" loading={false} onClick={() => {}} />
    )
    expect(wrapper.find('#rems-button-submitted').length).toBe(1)
  })
  it('should render REMSButton for approved', () => {
    const wrapper = shallow(
      <REMSButton applicationState="approved" loading={false} onClick={() => {}} />
    )
    expect(wrapper.find('#rems-button-approved').length).toBe(1)
  })
  it('should render REMSButton for rejected', () => {
    const wrapper = shallow(
      <REMSButton applicationState="rejected" loading={false} onClick={() => {}} />
    )
    expect(wrapper.find('#rems-button-rejected').length).toBe(1)
  })
  it('should render REMSButton for loading', () => {
    const wrapper = shallow(
      <REMSButton applicationState="apply" loading={true} onClick={() => {}} />
    )
    expect(wrapper.find(Loader).length).toBe(1)
  })
})
