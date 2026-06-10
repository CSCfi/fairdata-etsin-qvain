import QvainDatasetsStore from '../../../js/stores/view/qvain/qvain.datasets'

describe('Datasets Tabs', () => {
  let tabs
  beforeEach(() => {
    tabs = new QvainDatasetsStore({ metaxV3Url: vi.fn() }).tabs
    tabs.addOption('own', 'qvain.datasets.tabs.own')
    tabs.addOption('admin', 'qvain.datasets.tabs.admin')
  })

  describe('when calling constructor', () => {
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
