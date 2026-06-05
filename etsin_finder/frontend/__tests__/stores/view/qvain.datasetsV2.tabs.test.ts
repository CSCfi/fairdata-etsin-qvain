import type Tabs from '@/stores/view/tabs'
import QvainDatasetsStore from '../../../js/stores/view/qvain/qvain.datasets'

describe('Datasets Tabs', () => {
  let tabs: Tabs
  beforeEach(() => {
    tabs = new QvainDatasetsStore().tabs
    tabs.addOption('own', 'qvain.datasets.tabs.own')
    tabs.addOption('admin', 'qvain.datasets.tabs.admin')
  })

  describe('when calling constructor', () => {
    it('should have default values', () => {
      tabs.setActive('own')
      expect(tabs).toEqual(
        expect.objectContaining({
          active: 'own',
        })
      )
    })
  })

  it('should set active tab', () => {
    tabs.setActive('admin')
    expect(tabs.active).toBe('admin')
  })
})
