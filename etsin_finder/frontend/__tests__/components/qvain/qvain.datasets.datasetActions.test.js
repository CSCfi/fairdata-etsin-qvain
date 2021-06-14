import 'chai/register-should'
import { configure } from 'mobx'

import { buildStores } from '../../../js/stores'
import { DATA_CATALOG_IDENTIFIER } from '../../../js/utils/constants'
import {
  getEnterEditAction,
  getGoToEtsinAction,
  getCreateNewVersionAction,
  getUseAsTemplateAction,
  getRemoveAction,
  getDatasetActions,
  groupActions,
} from '../../../js/components/qvain/views/datasets/datasetActions'

import { expect } from 'chai'
jest.mock('axios')

let stores

beforeEach(() => {
  configure({ safeDescriptors: false })
  stores = buildStores()
  configure({ safeDescriptors: true })
  stores.Matomo.recordEvent = jest.fn()
  stores.Env.history.push = jest.fn()
  stores.Qvain.editDataset = jest.fn()
  stores.Qvain.resetWithTemplate = jest.fn()
  stores.QvainDatasets.createNewVersion = jest.fn()
  stores.QvainDatasets.createNewVersion.mockReturnValue(Promise.resolve('new_identifier'))
  stores.QvainDatasets.removeModal = { open: jest.fn() }
  window.open = jest.fn()
})

const idaDataset = {
  data_catalog: { identifier: DATA_CATALOG_IDENTIFIER.IDA },
  state: 'published',
  identifier: 'published-id',
}

const draftDataset = {
  state: 'draft',
  identifier: 'draft-id',
}

const datasetWithChanges = {
  ...idaDataset,
  next_draft: { identifier: 'changes-id' },
}

describe('getEnterEditAction', () => {
  describe.each([
    ['IDA', idaDataset, 'published-id', true],
    ['draft', draftDataset, 'draft-id', true],
    ['changed', datasetWithChanges, 'changes-id', false],
  ])('given %s dataset', (description, dataset, expectedIdentifier, expectCallEditDataset) => {
    beforeEach(() => {
      getEnterEditAction(stores, dataset).handler()
    })

    it('should navigate to editor url', () => {
      expect(stores.Env.history.push).to.have.beenCalledWith(`/qvain/dataset/${expectedIdentifier}`)
    })

    if (expectCallEditDataset) {
      it('should call editDataset', () => {
        expect(stores.Qvain.editDataset).to.have.beenCalledWith(dataset)
      })
    } else {
      it('should not call editDataset', () => {
        expect(stores.Qvain.editDataset).to.not.have.beenCalled()
      })
    }

    it('should call Matomo.recordEvent', () => {
      expect(stores.Matomo.recordEvent).to.have.beenCalledWith(`EDIT / ${expectedIdentifier}`)
    })
  })
})

describe('getGoToEtsinAction', () => {
  describe.each([
    ['IDA', idaDataset, 'published-id', ''],
    ['draft', draftDataset, 'draft-id', '?preview=1'],
    ['changed', datasetWithChanges, 'changes-id', '?preview=1'],
  ])('given %s dataset', (description, dataset, expectedIdentifier, expectedQuery) => {
    beforeEach(() => {
      getGoToEtsinAction(stores, dataset).handler()
    })

    it('should open etsin in a new tab', () => {
      expect(window.open).to.have.beenCalledWith(
        `/dataset/${expectedIdentifier}${expectedQuery}`,
        '_blank'
      )
    })

    it('should call Matomo.recordEvent', () => {
      expect(stores.Matomo.recordEvent).to.have.beenCalledWith(`PREVIEW / ${expectedIdentifier}`)
    })
  })
})

describe('getCreateNewVersionAction', () => {
  describe.each([['IDA', idaDataset, 'published-id']])(
    'given %s dataset',
    (description, dataset, expectedIdentifier) => {
      beforeEach(async () => {
        await getCreateNewVersionAction(stores, dataset).handler()
      })

      it('should create a new version', () => {
        expect(stores.QvainDatasets.createNewVersion).to.have.beenCalledWith(dataset)
      })

      it('should call Matomo.recordEvent', () => {
        expect(stores.Matomo.recordEvent).to.have.beenCalledWith(
          `NEW_VERSION / ${expectedIdentifier}`
        )
      })

      it('should call navigate to editor url', () => {
        expect(stores.Env.history.push).to.have.beenCalledWith(`/qvain/dataset/new_identifier`)
      })
    }
  )
})

describe('getUseAsTemplateAction', () => {
  describe.each([
    ['IDA', idaDataset, 'published-id'],
    ['draft', draftDataset, 'draft-id'],
    ['changed', datasetWithChanges, 'published-id'],
  ])('given %s dataset', (description, dataset, expectedIdentifier) => {
    beforeEach(() => {
      getUseAsTemplateAction(stores, dataset).handler()
    })

    if (dataset.next_draft) {
      it('should use dataset.next_draft as template', () => {
        expect(stores.Qvain.resetWithTemplate).to.have.beenCalledWith(dataset.next_draft)
      })
    } else {
      it('should use dataset as template', () => {
        expect(stores.Qvain.resetWithTemplate).to.have.beenCalledWith(dataset)
      })
    }

    it('should call Matomo.recordEvent', () => {
      expect(stores.Matomo.recordEvent).to.have.beenCalledWith(`TEMPLATE / ${expectedIdentifier}`)
    })
  })
})

describe('getRemoveAction', () => {
  describe.each([
    ['IDA', idaDataset, false],
    ['draft', draftDataset, false],
    ['changed', datasetWithChanges, true],
  ])('given %s dataset', (description, dataset, testOnlyChanges) => {
    describe('given onlyChanges: false', () => {
      const onlyChanges = false
      beforeEach(() => {
        getRemoveAction(stores, dataset, onlyChanges).handler()
      })

      it('should open modal', () => {
        jestExpect(stores.QvainDatasets.removeModal.open).toHaveBeenCalledWith({
          dataset,
          onlyChanges,
          postRemoveCallback: jestExpect.any(Function),
        })
      })
    })

    if (testOnlyChanges) {
      describe('given onlyChanges: false', () => {
        const onlyChanges = false
        beforeEach(() => {
          getRemoveAction(stores, dataset, onlyChanges).handler()
        })

        it('should open modal', () => {
          jestExpect(stores.QvainDatasets.removeModal.open).toHaveBeenCalledWith({
            dataset,
            onlyChanges,
            postRemoveCallback: jestExpect.any(Function),
          })
        })
      })
    }
  })
})

describe('getDatasetActions', () => {
  test('given ida dataset, should allow creating a new version', () => {
    const actions = getDatasetActions(stores, idaDataset).map(({ text }) => text)
    actions.should.eql([
      'qvain.datasets.editButton',
      'qvain.datasets.goToEtsin',
      'qvain.datasets.useAsTemplate',
      'qvain.datasets.createNewVersion',
      'qvain.datasets.deleteButton',
    ])
  })

  test('given draft dataset, should allow preview', () => {
    const actions = getDatasetActions(stores, draftDataset).map(({ text }) => text)
    actions.should.eql([
      'qvain.datasets.editButton',
      'qvain.datasets.goToEtsinDraft',
      'qvain.datasets.useAsTemplate',
      'qvain.datasets.deleteButton',
    ])
  })

  test('given dataset with changes, should allow reverting changes', () => {
    const actions = getDatasetActions(stores, datasetWithChanges).map(({ text }) => text)
    actions.should.eql([
      'qvain.datasets.editDraftButton',
      'qvain.datasets.goToEtsinDraft',
      'qvain.datasets.useAsTemplate',
      'qvain.datasets.revertButton',
      'qvain.datasets.deleteButton',
    ])
  })
})

describe('groupActions', () => {
  test.each([
    [0, 0, 0, 0],
    [3, 3, 3, 0],
    [5, 3, 2, 3],
    [1, 1, 1, 0],
    [5, 1, 0, 5],
    [2, 3, 2, 0],
  ])(
    'given actions.length=%d, maxButtons=%d, should return %d button actions and %d dropdown actions',
    (actionsLength, maxButtons, expectedButtonCount, expectedDropdownCount) => {
      const actions = Array(actionsLength)
      const { buttonActions, dropdownActions } = groupActions(actions, maxButtons)
      buttonActions.length.should.eql(expectedButtonCount)
      dropdownActions.length.should.eql(expectedDropdownCount)
    }
  )
})
