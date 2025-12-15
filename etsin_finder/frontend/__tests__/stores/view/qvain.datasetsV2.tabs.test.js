import { makeObservable } from 'mobx'

import QvainDatasetsStore from '../../../js/stores/view/qvain/qvain.datasets'

vi.mock('mobx')

describe('Datasets Tabs', () => {
  let tabs
  beforeEach(() => {
    tabs = new QvainDatasetsStore({ metaxV3Url: vi.fn() }).tabs
    tabs.addOption('own', 'qvain.datasets.tabs.own')
    tabs.addOption('admin', 'qvain.datasets.tabs.admin')
  })

  describe('when calling constructor', () => {
    test('should call makeObservable', () => {
      expect(makeObservable).toHaveBeenCalledWith(tabs)
    })

    it('should have default values', () => {
      tabs.setActive('own')
      tabs.should.include({
        active: 'own',
      })
    })
  })

  it('should set active tab', () => {
    tabs.setActive('admin')
    tabs.active.should.be.string('admin')
  })
})
