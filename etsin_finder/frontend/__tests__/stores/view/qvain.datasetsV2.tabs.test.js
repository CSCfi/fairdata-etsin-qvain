import { makeObservable } from 'mobx'

import QvainDatasetsStore from '../../../js/stores/view/qvain/qvain.datasets'

vi.mock('mobx')

describe('Datasets Tabs', () => {
  let tabs
  beforeEach(() => {
    tabs = new QvainDatasetsStore({}).tabs
  })

  describe('when calling constructor', () => {
    test('should call makeObservable', () => {
      expect(makeObservable).toHaveBeenCalledWith(tabs)
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
