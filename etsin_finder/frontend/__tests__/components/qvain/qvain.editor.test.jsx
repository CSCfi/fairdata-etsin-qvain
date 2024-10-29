import React from 'react'
import Harness from '../componentTestHarness'
import { expect } from 'chai'
import Translate from 'react-translate-component'

import { Dataset } from '@/components/qvain/views/DatasetEditorV2'
import Header from '@/components/qvain/views/headers/header'
import SubmitButtons from '@/components/qvain/views/headers/submitButtons'

import {
  ErrorButtons,
  ErrorContainer,
  ErrorContent,
  ErrorLabel,
} from '@/components/qvain/general/errors'
import Button from '@/components/general/button'
import {
  DisableImplicitSubmit,
  SkipToSubmitDataset,
} from '@/components/qvain/views/DatasetEditorV2/editor.styled'
import Description from '@/components/qvain/sections/Description'
import Actors from '@/components/qvain/sections/Actors'
import DataOrigin from '@/components/qvain/sections/DataOrigin/'
import Geographics from '@/components/qvain/sections/Geographics'
import History from '@/components/qvain/sections/History'
import ProjectV3 from '@/components/qvain/sections/ProjectV3'
import { PageTitle } from '@/components/qvain/general/card'

import { useStores } from '@/stores/stores'

jest.mock('@/stores/stores', () => {
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

    test('should have children with expected props', () => {
      const children = [
        { label: 'DisableImplicitSubmit', findArgs: DisableImplicitSubmit },
        { label: 'DataOrigin', findArgs: DataOrigin },
        { label: 'Description', findArgs: Description },
        { label: 'Actors', findArgs: Actors },
        { label: 'Geographics', findArgs: Geographics },
        { label: 'History', findArgs: History },
        //        { label: 'Project', findArgs: Project },
        { label: 'ProjectV3', findArgs: ProjectV3 },
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
