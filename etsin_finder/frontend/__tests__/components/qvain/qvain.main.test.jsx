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
import urls from '../../../js/components/qvain/utils/urls'

jest.mock('axios')
axios.get.mockReturnValue(
  Promise.resolve({
    data: {},
  })
)

jest.mock('../../../js/components/qvain/views/editor/submitButtons', () => {
  return {
    default: () => () => <>null</>,
  }
})

jest.mock('../../../js/components/qvain/general/errors/fieldErrorBoundary', () => {
  return {
    default: () => () => <>null</>,
    withFieldErrorBoundary: () => () => <>null</>,
  }
})

jest.mock('../../../js/stores/stores', () => {
  return {
    withStores: () => () => <>null</>,
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
      metaxApiV2: true,
      getQvainUrl: jest.fn(),
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
          datasetLoading: false,
          datasetError: false,
          submitted: false,
          response: null,
          handleSubmitError: harness.instance.handleSubmitError,
          handleSubmitResponse: harness.instance.handleSubmitResponse,
          clearSubmitResponse: harness.instance.clearSubmitResponse,
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
          handleSubmitError: harness.instance.handleSubmitError,
          handleSubmitResponse: harness.instance.handleSubmitResponse,
        },
        UnsavedChangesPrompt: {
          when: mockStores.Qvain.changed,
          attributes: { message: 'qvain.unsavedChanges' },
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })

  describe('StickyHeader', () => {
    beforeEach(() => {
      harness.restoreWrapper('StickyHeader')
    })

    describe('when calling handleSubmitError', () => {
      const err = {
        errors: ['some error'],
      }

      beforeEach(() => {
        harness.props.handleSubmitError(err)
      })

      test('should set state: datasetLoading, submitted, response', () => {
        const expectedState = {
          datasetLoading: false,
        }

        harness.state.should.deep.include(expectedState)
      })
    })

    describe('when calling handleSubmitResponse', () => {
      const response = {
        data: {
          some: 'data',
        },
      }
      beforeEach(() => {
        harness.props.handleSubmitResponse(response)
      })

      test('should set state: datasetLoading, submitted, response', () => {
        const expectedState = {
          datasetLoading: false,
        }

        harness.state.should.deep.include(expectedState)
      })
    })

    describe('when calling clearSubmitResponse', () => {
      beforeEach(() => {
        harness.props.clearSubmitResponse()
      })

      test('should call Submit.clearResponse', () => {
        expect(mockStores.Qvain.Submit.clearResponse).to.have.beenCalledWith()
      })

      test('should call Submit.setError with null', () => {
        expect(mockStores.Qvain.Submit.setError).to.have.beenCalledWith(null)
      })

      test('should set expected state', () => {
        const expectedState = {
          datasetLoading: false,
          datasetError: false,
          datasetErrorTitle: null,
          datasetErrorDetails: null,
        }

        harness.state.should.deep.include(expectedState)
      })
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

    describe('when calling handleSubmitError', () => {
      const error = {
        errors: 'errors',
      }
      beforeEach(() => {
        harness.props.handleSubmitError(error)
      })

      test('should set state', () => {
        const expectedState = {
          datasetLoading: false,
        }

        harness.state.should.include(expectedState)
      })
    })

    describe('handleSubmitResponse', () => {
      const response = 'response'
      beforeEach(() => {
        harness.props.handleSubmitResponse(response)
      })

      test('should set state', () => {
        const expectedState = {
          datasetLoading: false,
        }

        harness.state.should.include(expectedState)
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
        beforeEach(() => {
          harness.props.handleRetry()
        })

        test('should call axios get', () => {
          expect(axios.get).to.have.beenCalledWith(urls.v2.dataset('identifier2'))
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
