import React from 'react'
import { shallow } from 'enzyme'
import axios from 'axios'

import '../../../locale/translations'
import { AccessType } from '../../../js/components/qvain/fields/licenses/accessType'
import { ACCESS_TYPE_URL } from '../../../js/utils/constants'
import Auth from '../../../js/stores/domain/auth'
import Env from '../../../js/stores/domain/env'
import QvainStoreClass from '../../../js/stores/view/qvain'
import LocaleStore from '../../../js/stores/view/locale'
import accessTypeResponse from '../../__testdata__/accessTypes.data'

jest.mock('axios')

const QvainStore = new QvainStoreClass(Env)

const getStores = () => {
  Env.Flags.setFlag('METAX_API_V2', true)
  return {
    Auth,
    Env,
    Qvain: QvainStore,
    Locale: LocaleStore,
  }
}

describe('Qvain Access Type', () => {
  beforeEach(() => {
    axios.get.mockReturnValueOnce(Promise.resolve({ data: accessTypeResponse }))
  })

  it('shows all access type options', async () => {
    Auth.setUser({ ...Auth.user, isUsingRems: true })
    const component = shallow(<AccessType Stores={getStores()} />)
    await Promise.resolve()
    const options = component.instance().state.options
    expect(options.length).toBe(5)
    expect(options.filter(opt => opt.url === ACCESS_TYPE_URL.PERMIT).length).toBe(1)
  })

  it('restricts which access types are shown', async () => {
    Auth.setUser({ ...Auth.user, isUsingRems: false })
    const component = shallow(<AccessType Stores={getStores()} />)
    await Promise.resolve()
    const options = component.instance().state.options
    expect(options.length).toBe(4)
    expect(options.filter(opt => opt.url === ACCESS_TYPE_URL.PERMIT).length).toBe(0)
  })

  it('always allows the current access type', async () => {
    Auth.setUser({ ...Auth.user, isUsingRems: false })
    QvainStore.AccessType.set({ url: ACCESS_TYPE_URL.PERMIT })
    const component = shallow(<AccessType Stores={getStores()} />)
    await Promise.resolve()
    const options = component.instance().state.options
    expect(options.length).toBe(5)
    expect(options.filter(opt => opt.url === ACCESS_TYPE_URL.PERMIT).length).toBe(1)
  })
})
