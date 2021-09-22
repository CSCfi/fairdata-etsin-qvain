import 'chai/register-expect'
import { makeObservable } from 'mobx'

import Tabs from '../../../js/stores/view/qvain/qvain.datasetsV2.tabs'

jest.mock('mobx')

describe('Datasets Tabs', () => {
  let tabs
  beforeEach(() => {
    tabs = new Tabs()
  })

  describe('when calling constructor', () => {
    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledWith(tabs)
    })

    it('should have default values', () => {
      tabs.should.include({
        active: 'all',
      })
    })
  })

  it('should set active tab', () => {
    tabs.setActive('another')
    tabs.active.should.be.string('another')
  })
})
