import React from 'react'
import Harness from '../componentTestHarness'
import 'chai/register-expect'
import axios from 'axios'

import { Qvain, ErrorTitle } from '../../../js/components/qvain/views/main'
import Header from '../../../js/components/qvain/views/editor/header'
import StickyHeader from '../../../js/components/qvain/views/editor/stickyHeader'
import ErrorBoundary from '../../../js/components/general/errorBoundary'
import Dataset from '../../../js/components/qvain/views/editor/dataset'
import LooseActorDialog from '../../../js/components/qvain/views/editor/looseActorDialog'
import LooseProvenanceDialog from '../../../js/components/qvain/views/editor/looseProvenanceDialog'
import { Prompt } from 'react-router'
import urls from '../../../js/utils/urls'

jest.mock('axios')
axios.get.mockReturnValue(
  Promise.resolve({
    data: {},
  })
)

jest.mock('../../../js/components/qvain/general/errors/fieldErrorBoundary', () => {
  return {
    default: () => () => <>null</>,
    withFieldErrorBoundary: () => () => <>null</>,
  }
})

jest.mock('../../../js/stores/stores', () => {
  return {
    withStores: () => () => <>null</>,
    useStores: jest.fn(),
  }
})

describe('given required props', () => {
  const mockStores = {
    Qvain: {
      resetQvainStore: jest.fn(),
      editDataset: jest.fn(),
      original: {
        identifier: 'identifier',
      },
      changed: false,
      Submit: {
        clearResponse: jest.fn(),
        setError: jest.fn(),
        error: '',
        isLoading: false,
      },
    },
    Matomo: {
      recordEvent: jest.fn(),
    },
    Env: {
      getQvainUrl: jest.fn(),
      Flags: { flagEnabled: () => false },
    },
  }

  const props = {
    Stores: mockStores,
    match: {
      params: {
        identifier: 'identifier',
      },
    },
    location: {
      pathname: 'pathname',
    },
    history: {},
  }

  const harness = new Harness(Qvain, props)

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Qvain Main', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected props', () => {
      const children = [
        { label: 'Header', findArgs: Header },
        { label: 'StickyHeader', findArgs: StickyHeader },
        { label: 'DatasetErrorBoundary', findArgs: ErrorBoundary },
        { label: 'Dataset', findArgs: Dataset },
        { label: 'LooseActorDialog', findArgs: LooseActorDialog },
        { label: 'LooseProvenanceDialog', findArgs: LooseProvenanceDialog },
        { label: 'UnsavedChangesPrompt', findType: 'prop', findArgs: ['component', Prompt] },
      ]

      const props = {
        Header: {
          datasetLoading: false,
          datasetError: false,
        },
        StickyHeader: {
          datasetError: false,
          hideSubmitButtons: false,
        },
        DatasetErrorBoundary: {
          title: ErrorTitle(),
          callback: harness.instance.enableRenderFailed,
        },
        Dataset: {
          datasetError: false,
          haveDataset: true,
          datasetErrorDetails: null,
          datasetErrorTitle: null,
          handleRetry: harness.instance.handleRetry,
          setFocusOnSubmitButton: harness.instance.setFocusOnSubmitButton,
        },
        UnsavedChangesPrompt: {
          when: mockStores.Qvain.changed,
          attributes: { message: 'qvain.unsavedChanges' },
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })

  describe('Dataset', () => {
    beforeEach(() => {
      harness.restoreWrapper('Dataset')
    })

    describe('when calling handleRetry', () => {
      beforeEach(() => {
        harness.props.handleRetry()
      })

      test('should set state', () => {
        const expectedState = {
          datasetLoading: false,
          haveDataset: true,
        }

        harness.state.should.include(expectedState)
      })

      test('should call Matomo.recordEvent', () => {
        expect(mockStores.Matomo.recordEvent).to.have.beenCalledWith('DATASET / identifier')
      })
    })
  })

  describe('given no identifier', () => {
    beforeEach(() => {
      props.match.params.identifier = undefined
      harness.shallow(props)
    })

    describe('Dataset', () => {
      beforeEach(() => {
        harness.find(Dataset)
      })

      describe('when calling handleRetry', () => {
        beforeEach(() => {
          harness.props.handleRetry()
        })

        test('should call recordEvent with DATASET', () => {
          expect(props.Stores.Matomo.recordEvent).to.have.beenCalledWith('DATASET')
        })
      })
    })
  })

  describe('given different identifier than original.identifier', () => {
    beforeEach(() => {
      props.match.params.identifier = 'identifier2'
      harness.shallow(props)
    })

    describe('Dataset', () => {
      beforeEach(() => {
        harness.find(Dataset)
      })

      describe('when calling handleRetry', () => {
        beforeEach(async () => {
          await harness.props.handleRetry()
        })

        test('should call axios get', () => {
          expect(axios.get).to.have.beenCalledWith(urls.qvain.dataset('identifier2'))
        })

        test('should call resetQvainStore', () => {
          expect(props.Stores.Qvain.resetQvainStore).to.have.beenCalledWith()
        })

        test('should set state', () => {
          const expectedState = {
            datasetLoading: false,
            datasetError: false,
            haveDataset: true,
          }

          harness.state.should.include(expectedState)
        })

        test('should call editDataset', () => {
          expect(props.Stores.Qvain.editDataset).to.have.beenCalledWith({})
        })
      })
    })
  })
})
