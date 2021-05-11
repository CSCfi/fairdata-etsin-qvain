import React from 'react'
import Harness from '../componentTestHarness'
import 'chai/register-expect'

import { Dataset } from '../../../js/components/qvain/views/editor/dataset'
import Header from '../../../js/components/qvain/views/editor/header'

import {
  ErrorButtons,
  ErrorContainer,
  ErrorContent,
  ErrorLabel,
} from '../../../js/components/qvain/general/errors'
import Button from '../../../js/components/general/button'
import {
  DisableImplicitSubmit,
  SkipToSubmitDataset,
} from '../../../js/components/qvain/views/editor/editor.styled'
import Description from '../../../js/components/qvain/fields/description'
import Actors from '../../../js/components/qvain/fields/actors'
import RightsAndLicenses from '../../../js/components/qvain/fields/licenses'
import TemporalAndSpatial from '../../../js/components/qvain/fields/temporalAndSpatial'
import History from '../../../js/components/qvain/fields/history'
import Project from '../../../js/components/qvain/fields/project'
import Files from '../../../js/components/qvain/fields/files'
import SubmitButtons from '../../../js/components/qvain/views/editor/submitButtons'
import { useStores } from '../../../js/stores/stores'
import Translate from 'react-translate-component'
import { PageTitle } from '../../../js/components/qvain/general/card'

jest.mock('../../../js/stores/stores', () => {
  return {
    withStores: jest.fn(() => () => <>null</>),
    useStores: jest.fn(),
  }
})

jest.mock('react-router-dom', () => {
  return {
    withRouter: jest.fn(() => () => <>null</>),
    Link: () => <>linkki</>,
  }
})

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useEffect: jest.fn(),
  }
})

describe('given props with datasetError', () => {
  const props = {
    datasetError: true,
    haveDataset: false,
    datasetErrorTitle: 'error title',
    datasetErrorDetails: 'error details',
    handleRetry: jest.fn(),
    handleSubmitError: jest.fn(),
    handleSubmitResponse: jest.fn(),
    setFocusOnSubmitButton: jest.fn(),
  }

  const harness = new Harness(Dataset, props)

  describe('Dataset', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected props', () => {
      const children = [
        {
          label: 'ErrorContainer',
          findArgs: ErrorContainer,
        },
        {
          label: 'ErrorLabel',
          findArgs: ErrorLabel,
          text: props.datasetErrorTitle,
        },
        {
          label: 'ErrorContent',
          findArgs: ErrorContent,
          text: props.datasetErrorDetails,
        },
        {
          label: 'ErrorButtons',
          findArgs: ErrorButtons,
        },
        {
          label: 'ErrorButton',
          findArgs: Button,
          text: 'Retry',
        },
      ]

      const expectedProps = {
        ErrorButton: {
          onClick: props.handleRetry,
        },
      }

      harness.shouldIncludeChildren(children, expectedProps)
    })
  })
})

describe('given haveDataset false', () => {
  const props = {
    datasetError: false,
    haveDataset: false,
    handleRetry: jest.fn(),
    handleSubmitError: jest.fn(),
    handleSubmitResponse: jest.fn(),
    setFocusOnSubmitButton: jest.fn(),
  }

  const harness = new Harness(Dataset, props)

  describe('Dataset', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should not exist', () => {
      expect(harness.wrapper.html()).to.be.null
    })
  })
})

describe('given haveDataset true', () => {
  const props = {
    datasetError: false,
    haveDataset: true,
    handleRetry: jest.fn(),
    handleSubmitError: jest.fn(),
    handleSubmitResponse: jest.fn(),
    setFocusOnSubmitButton: jest.fn(),
  }

  const harness = new Harness(Dataset, props)

  describe('Dataset', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should hvae children with expected props', () => {
      const children = [
        { label: 'DisableImplicitSubmit', findArgs: DisableImplicitSubmit },
        { label: 'Description', findArgs: Description },
        { label: 'Actors', findArgs: Actors },
        { label: 'RightsAndLicenses', findArgs: RightsAndLicenses },
        { label: 'TemporalAndSpatial', findArgs: TemporalAndSpatial },
        { label: 'History', findArgs: History },
        { label: 'Project', findArgs: Project },
        { label: 'Files', findArgs: Files },
        { label: 'Consent', findType: 'prop', findArgs: ['content', 'qvain.consent'] },
        { label: 'BottomSubmitButtons', findArgs: SubmitButtons },
        { label: 'SkipToSubmitDataset', findArgs: SkipToSubmitDataset },
        { label: 'SkipToSubmitDatasetContent', findType: 'prop', findArgs: ['content', 'stsd'] },
      ]

      const expectedProps = {
        Consent: {
          unsafe: true,
          component: 'p',
        },
        SubmitButtons: {
          handleSubmitError: props.handleSubmitError,
          handleSubmitResponse: props.handleSubmitResponse,
          idSuffix: '-bottom',
        },
        SkipToSubmitDataset: {
          onClick: props.setFocusOnSubmitButton,
        },
      }

      harness.shouldIncludeChildren(children, expectedProps)
    })
  })
})

describe('given datasetLoading true', () => {
  const mockStores = {
    Qvain: {
      original: {},
    },
  }

  const props = {
    datasetLoading: true,
    datasetError: false,
  }

  const harness = new Harness(Header, props)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('Header', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have child with expectedProps', () => {
      const child = {
        findArgs: Translate,
        props: {
          component: PageTitle,
          content: 'qvain.titleLoading',
        },
      }

      harness.shouldIncludeChild(child)
    })
  })
})

describe('given datasetLoading false and original', () => {
  const mockStores = {
    Qvain: {
      original: {},
    },
  }

  const props = {
    datasetLoading: false,
    datasetError: false,
  }

  const harness = new Harness(Header, props)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('Header', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have child with expectedProps', () => {
      const child = {
        findArgs: Translate,
        props: {
          component: PageTitle,
          content: 'qvain.titleEdit',
        },
      }

      harness.shouldIncludeChild(child)
    })
  })
})

describe('given datasetLoading false and no original', () => {
  const mockStores = {
    Qvain: {},
  }

  const props = {
    datasetLoading: false,
    datasetError: false,
  }

  const harness = new Harness(Header, props)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('Header', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have child with expectedProps', () => {
      const child = {
        findArgs: Translate,
        props: {
          component: PageTitle,
          content: 'qvain.titleCreate',
        },
      }

      harness.shouldIncludeChild(child)
    })
  })
})

describe('given datasetError true', () => {
  const mockStores = {
    Qvain: {},
  }

  const props = {
    datasetLoading: false,
    datasetError: true,
  }

  const harness = new Harness(Header, props)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('Header', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have child with expectedProps', () => {
      const child = {
        findArgs: Translate,
        props: {
          component: PageTitle,
          content: 'qvain.titleLoadingFailed',
        },
      }

      harness.shouldIncludeChild(child)
    })
  })
})