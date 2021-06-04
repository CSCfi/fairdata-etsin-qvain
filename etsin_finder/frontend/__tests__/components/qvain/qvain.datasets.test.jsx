import 'chai/register-expect'
import Harness from '../componentTestHarness'
import React, { useEffect } from 'react'

import { useStores } from '../../../js/stores/stores'
import { Datasets } from '../../../js/components/qvain/views/datasets'
import { PageTitle } from '../../../js/components/qvain/general/card'
import { SaveButton } from '../../../js/components/qvain/general/buttons'
import DatasetTable from '../../../js/components/qvain/views/datasets/table'

jest.mock('../../../js/stores/stores', () => {
  return {
    withStores: jest.fn(() => () => <>null</>),
    useStores: jest.fn(),
  }
})

jest.mock('mobx-react', () => {
  return {
    observer: jest.fn(() => () => <>null</>),
  }
})
jest.mock('react-router-dom', () => {
  return {
    withRouter: jest.fn(() => () => <>null</>),
  }
})

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useEffect: jest.fn(),
  }
})

describe('given mockStores', () => {
  const mockStores = {
    Qvain: {
      resetQvainStore: jest.fn(),
    },
    QvainDatasets: {
      publishedDataset: 'publishedDataset',
      setPublishedDataset: jest.fn(),
    },
    Env: {
      getQvainUrl: jest.fn(path => path),
    },
    Matomo: {
      recordEvent: jest.fn(),
    },
  }

  const history = {
    push: jest.fn(),
  }

  const location = {}

  const harness = new Harness(Datasets, { history, location })

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Datasets', () => {
    beforeEach(() => {
      useEffect.mockImplementation(func => {
        func()
      })
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have called recordEvent', () => {
      expect(mockStores.Matomo.recordEvent).to.have.beenCalledWith('DATASETS')
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'PageTitle', findType: 'prop', findArgs: ['component', PageTitle] },
        { label: 'PublishSuccess', findType: 'name', findArgs: 'PublishSuccess' },
        {
          label: 'SubmitStatusSuccess',
          findType: 'prop',
          findArgs: ['content', 'qvain.submitStatus.success'],
        },
        {
          label: 'DatasetHelp',
          findType: 'prop',
          findArgs: ['content', 'qvain.datasets.help'],
        },
        {
          label: 'SaveButton',
          findType: 'prop',
          findArgs: ['component', SaveButton],
        },
        {
          label: 'DatasetTable',
          findArgs: DatasetTable,
        },
      ]

      const props = {
        PageTitle: {
          content: 'qvain.datasets.title',
        },
        SaveButton: {
          content: 'qvain.datasets.createButton',
        },
      }

      harness.shouldIncludeChildren(children, props)
    })

    describe('SaveButton', () => {
      beforeEach(() => {
        harness.restoreWrapper('SaveButton')
      })

      describe('when triggering click', () => {
        beforeEach(() => {
          harness.trigger('click')
        })

        test('should call resetQvainStore', () => {
          expect(mockStores.Qvain.resetQvainStore).to.have.beenCalledWith()
        })

        test('should call history push with /dataset returned from getQvainUrl', () => {
          expect(history.push).to.have.beenCalledWith('/dataset')
          expect(mockStores.Env.getQvainUrl).to.have.beenCalledWith('/dataset')
        })
      })
    })

    describe('PublishSuccess', () => {
      beforeEach(() => {
        harness.restoreWrapper('PublishSuccess')
      })

      describe('when triggering click', () => {
        beforeEach(() => {
          harness.trigger('close')
        })

        test('should call setPublishedDataset with null', () => {
          expect(mockStores.QvainDatasets.setPublishedDataset).to.have.beenCalledWith(null)
        })
      })
    })
  })
})
