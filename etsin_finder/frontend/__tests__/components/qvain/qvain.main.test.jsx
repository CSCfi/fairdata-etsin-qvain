import React from 'react'
import Harness from '../componentTestHarness'
import { expect } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { Qvain, ErrorTitle } from '@/components/qvain/views/main'
import Header from '@/components/qvain/views/headers/header'
import StickyHeader from '@/components/qvain/views/headers/stickyHeader'
import ErrorBoundary from '@/components/general/errorBoundary'
import DatasetEditorV2 from '@/components/qvain/views/DatasetEditorV2'
import LooseActorDialog from '@/components/qvain/views/main/looseActorDialog'
import LooseProvenanceDialog from '@/components/qvain/views/main/looseProvenanceDialog'
import { Prompt } from 'react-router'
import urls from '@/utils/urls'
import { useStores } from '@/stores/stores'

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet().reply(200, {})

jest.mock('@/components/qvain/general/errors/fieldErrorBoundary', () => {
  return {
    default: () => () => <>null</>,
    withFieldErrorBoundary: () => () => <>null</>,
  }
})

jest.mock('@/stores/stores', () => {
  return {
    withStores: () => () => <>null</>,
    useStores: jest.fn(),
  }
})

jest.mock('@/../static/images/data-ida.svg', () => {
  return ''
})

jest.mock('@/../static/images/data-remote.svg', () => {
  return ''
})

jest.mock('@/../static/images/data-pas.svg', () => {
  return ''
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
      history: { location: {} },
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
      search: '',
    },
    history: {},
  }

  const harness = new Harness(Qvain, props)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  afterEach(() => {
    mockAdapter.resetHistory()
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
        { label: 'Dataset', findArgs: DatasetEditorV2},
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
      harness.shallow()
      harness.find(DatasetEditorV2)
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
        harness.find(DatasetEditorV2)
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
        harness.find(DatasetEditorV2)
      })

      describe('when calling handleRetry', () => {
        beforeEach(async () => {
          await harness.props.handleRetry()
        })

        test('should call axios get', () => {
          expect(mockAdapter.history.get[0].url).to.equal(urls.qvain.dataset('identifier2'))
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
