/*
 * @jest-environment ./__tests__/timezonedNodeEnvironment.js
 */

/*
 **  Files submit cases frontend tests
 **
 **  Files has 144 theoretical test conditions. Almost half of these cases are inactive or not possible at all.
 **  These tests will test all the cases that can be tested.
 **  Tests lean heavily on the documentation found in the link below.
 **  The cases are named after the theoretical number column.
 **  There's also bunch of typical tests that were made during the development of qvain.submit
 **  class. You can find them from the start of the tests.
 **
 **  Tests ends up in possible error or successful function run. Tests don't test out the actual response, it trusts that backend is tested properly.
 **  They only test that payload is sent to a correct address.
 **
 **  for more info: https://wiki.eduuni.fi/pages/viewpage.action?pageId=162084194
 */

import axios from 'axios'
import moment from 'moment'
import SubmitClass from '../../../js/stores/view/qvain/qvain.submit'
import handleSubmitToBackend from '../../../js/components/qvain/utils/handleSubmit'
import {
  CUMULATIVE_STATE,
  DATA_CATALOG_IDENTIFIER,
  ACCESS_TYPE_URL,
} from '../../../js/utils/constants'
import urls from '../../../js/utils/urls'
import { configure } from 'mobx'

// first half of the tests mocks qvainFormSchema but the rest of the tests uses actual module
import {
  qvainFormSchema,
  qvainFormDraftSchema,
} from '../../../js/stores/view/qvain/qvain.submit.schemas'

const { qvainFormSchema: realQvainFormSchema, qvainFormDraftSchema: realQvainFormDraftSchema } =
  jest.requireActual('../../../js/stores/view/qvain/qvain.submit.schemas')

jest.mock('axios')

jest.mock('../../../js/components/qvain/utils/handleSubmit', () => {
  return jest.fn()
})

jest.mock('../../../js/stores/view/qvain/qvain.submit.schemas', () => {
  return {
    qvainFormSchema: {
      validate: jest.fn(),
    },
    qvainFormDraftSchema: {
      validate: jest.fn(),
    },
  }
})

jest.mock('lodash.debounce', () => {
  return func => () => func()
})

const errors = {
  missingFileOrigin: 'qvain.validationMessages.files.dataCatalog.required',
  wrongFileOrigin: 'DOI can be used only with IDA datasets.',
}

const testOrganization = {
  '@type': 'Organization',
  name: {
    en: 'University of Helsinki',
    fi: 'Helsingin yliopisto',
    sv: 'Helsingfors universitet',
    und: 'Helsingin yliopisto',
  },
  identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/01901',
}

const generateDefaultDatasetForPublish = settings => ({
  title: { fi: 'otsikko', en: 'title' },
  description: { fi: 'kuvailu', en: 'description' },
  issued: moment().format('YYYY-MM-DD'), // needs to be mocked if using snapshots
  keyword: ['key', 'words'],
  creator: [testOrganization],
  publisher: testOrganization,
  license: [
    {
      name: {
        en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
        fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
        und: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
      },
      identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
    },
  ],
  access_rights: {
    access_type: { identifier: ACCESS_TYPE_URL.OPEN },
  },
  cumulative_state: CUMULATIVE_STATE.NO,
  use_doi: false,
  data_catalog: DATA_CATALOG_IDENTIFIER.IDA,
  ...settings,
})

const generateDefaultDatasetForDraft = settings => ({
  title: { fi: 'otsikko', en: 'title' },
  description: { fi: '', en: '' },
  cumulative_state: CUMULATIVE_STATE.NO,
  access_type: { url: ACCESS_TYPE_URL.OPEN },
  ...settings,
})

const createMockQvain = settings => ({
  Files: {
    actionsToMetax: jest.fn(() => ({ files: [], directories: [] })),
    metadataToMetax: jest.fn(() => ({ files: [], directories: [] })),
  },
  Actors: { checkProvenanceActors: jest.fn(() => true) },
  OtherIdentifiers: { cleanupBeforeBackend: jest.fn(() => true) },
  editDataset: jest.fn(),
  setChanged: jest.fn(),
  setOriginal: jest.fn(),
  canRemoveFiles: true,
  canSelectFiles: true,
  ...settings,
})

const generalPostResponse = {
  data: {
    identifier: 'some identifier',
  },
}

const generalGetResponse = {
  data: {
    identifier: 'some other identifier',
  },
}

describe('Submit.exec()', () => {
  let Submit, mockQvain, submitFunction

  const exec = async (init = () => {}, schema) => {
    init()
    await Submit.exec(submitFunction, schema)
  }

  beforeEach(() => {
    handleSubmitToBackend.mockReturnValue(generateDefaultDatasetForPublish())
    submitFunction = jest.fn(() => generalPostResponse.data)
    mockQvain = createMockQvain({
      original: {
        identifier: 'some identifier',
      },
    })
    configure({ safeDescriptors: false })
    Submit = new SubmitClass(mockQvain)
  })

  afterEach(() => {
    configure({ safeDescriptors: true })
    jest.resetAllMocks()
  })

  test('exec, should call submit function', async () => {
    await exec()
    expect(submitFunction).toHaveBeenCalled()
    expect(Submit.isLoading).toBe(false)
  })

  test('while exec is running, other exec calls should be ignored', async () => {
    const first = exec()
    expect(Submit.isLoading).toBe(true)
    await Promise.all([first, exec(), exec()])
    expect(submitFunction).toHaveBeenCalledTimes(1)
    expect(Submit.isLoading).toBe(false)

    await Promise.all([exec(), exec(), exec()])
    expect(submitFunction).toHaveBeenCalledTimes(2)
    expect(Submit.isLoading).toBe(false)
  })

  test('exec should perform actions in correct order', async () => {
    const callOrder = []
    const logCallOrder = (name, returnValue) => {
      return () => {
        callOrder.push(name)
        return returnValue
      }
    }
    mockQvain.Files.actionsToMetax.mockReturnValue({
      files: [{ identifier: 'some file' }],
      directories: [],
    })
    submitFunction = {
      draftFunction: jest.fn(logCallOrder('save draft', generalPostResponse.data)),
      publishFunction: jest.fn(logCallOrder('publish dataset', generalPostResponse.data)),
    }
    axios.get.mockImplementation(logCallOrder('get updated dataset', generalGetResponse.data))

    Submit.updateFiles = logCallOrder('update files')
    await exec()
    expect(callOrder).toEqual([
      'save draft',
      'update files',
      'publish dataset',
      'get updated dataset',
    ])
  })

  test('false from checkProvenanceActors should cancel post', async () => {
    await exec(() => mockQvain.Actors.checkProvenanceActors.mockReturnValue(false))
    expect(mockQvain.Actors.checkProvenanceActors).toHaveBeenCalledTimes(1)
    expect(submitFunction).not.toHaveBeenCalled()
  })

  test('false from cleanupBeforeBackend should cancel post', async () => {
    await exec(() => mockQvain.OtherIdentifiers.cleanupBeforeBackend.mockReturnValue(false))
    expect(mockQvain.OtherIdentifiers.cleanupBeforeBackend).toHaveBeenCalledTimes(1)
    expect(axios.post).not.toHaveBeenCalled()
  })

  test('should call handleSubmitToBackend', async () => {
    await exec()
    expect(handleSubmitToBackend).toHaveBeenCalledTimes(1)
  })

  test('should call qvainFormSchema.validate', async () => {
    await exec()
    expect(qvainFormSchema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call qvainFormDraftSchema.validate when given specific schema', async () => {
    await exec(undefined, qvainFormDraftSchema)
    expect(qvainFormDraftSchema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call setChanged', async () => {
    await exec()
    expect(mockQvain.setChanged).toHaveBeenCalledWith(false)
  })

  test('when no actions to update, calls editDataset with data', async () => {
    await exec()
    expect(mockQvain.editDataset).toHaveBeenCalledWith(generalPostResponse.data)
  })

  test('when fileActions to update, calls editDataset with data from backend', async () => {
    mockQvain.Files.actionsToMetax.mockReturnValue({
      files: [{ identifier: 'some file' }],
      directories: [],
    })
    axios.get.mockReturnValue(generalGetResponse)
    await exec()
    expect(mockQvain.editDataset).toHaveBeenCalledWith(generalGetResponse.data)
  })

  test(`when newCumulativeState, calls editDataset with data from backend`, async () => {
    mockQvain.newCumulativeState = 'new state'
    axios.get.mockReturnValue(Promise.resolve(generalGetResponse))
    await exec()
    await expect(mockQvain.editDataset).toHaveBeenCalledWith(generalGetResponse.data)
  })
})

describe('prevalidate', () => {
  let Submit, mockQvain
  beforeEach(() => {
    mockQvain = createMockQvain()
    Submit = new SubmitClass(mockQvain)
    handleSubmitToBackend.mockReturnValue(generateDefaultDatasetForPublish)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('when validation returns nothing', () => {
    beforeEach(async () => {
      await Submit.prevalidate()
    })

    test('should call validate functions', () => {
      expect(qvainFormSchema.validate).toHaveBeenCalled()
      expect(qvainFormDraftSchema.validate).toHaveBeenCalled()
    })

    test('should set isDraftButtonDisabled and isPublishButtonDisabled to false', () => {
      expect(Submit.isDraftButtonDisabled).toBe(false)
      expect(Submit.isPublishButtonDisabled).toBe(false)
    })

    test('should setValidationErrors as an empty array', () => {
      expect(Submit.draftValidationError).toEqual([])
      expect(Submit.publishValidationError).toEqual([])
    })
  })

  describe('when validation excepts', () => {
    const publishError = 'publish error'
    const draftError = 'draft error'
    beforeEach(async () => {
      qvainFormSchema.validate.mockImplementation(() => Promise.reject(publishError))
      qvainFormDraftSchema.validate.mockImplementation(() => Promise.reject(draftError))
      await Submit.prevalidate()
    })

    test('should setValidationErrors', () => {
      expect(Submit.publishValidationError).toEqual(publishError)
      expect(Submit.draftValidationError).toEqual(draftError)
    })

    test('should set isDraftButtonDisabled and isPublishButtonDisabled to true', () => {
      expect(Submit.isDraftButtonDisabled).toBe(true)
      expect(Submit.isPublishButtonDisabled).toBe(true)
    })
  })
})

describe('submitDraft', () => {
  let Submit, mockQvain
  beforeEach(() => {
    mockQvain = createMockQvain()
    axios.post.mockReturnValue(generalPostResponse)
    Submit = new SubmitClass(mockQvain)
    handleSubmitToBackend.mockReturnValue(generateDefaultDatasetForDraft())
  })

  test('should use qvainFormDraftSchema on exec call', async () => {
    qvainFormDraftSchema.validate.mockReturnValue(undefined)
    await Submit.submitDraft()
    expect(qvainFormDraftSchema.validate).toHaveBeenCalledTimes(1)
  })
})

describe('create new draft', () => {
  let Submit, mockQvain
  beforeEach(() => {
    mockQvain = createMockQvain()
    axios.post.mockReturnValue(generalPostResponse)
    Submit = new SubmitClass(mockQvain)
  })

  const expectNoError = async dataset => {
    handleSubmitToBackend.mockReturnValue(dataset)
    qvainFormDraftSchema.validate.mockReturnValue(
      realQvainFormDraftSchema.validate(dataset, { strict: true })
    )

    try {
      await Submit.submitDraft()
    } catch {
      expect().toBe(true)
    } finally {
      expect(Submit.error).toBe(undefined)
    }
  }

  const expectError = async (dataset, error) => {
    handleSubmitToBackend.mockReturnValue(dataset)
    qvainFormDraftSchema.validate.mockReturnValue(
      realQvainFormDraftSchema.validate(dataset, { strict: true })
    )
    await Submit.submitDraft()
    expect(Submit.error?.message).toEqual(error)
  }

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call axios.post with dataset and draft param', async () => {
    handleSubmitToBackend.mockReturnValue('dataset')
    qvainFormDraftSchema.validate.mockReturnValue(Promise.resolve(undefined))
    await Submit.submitDraft()
    expect(axios.post).toHaveBeenCalledWith(urls.qvain.datasets(), 'dataset', {
      params: { draft: true },
    })
  })

  test('cases 1-3: no file origin, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForDraft({ data_catalog: undefined })
    await expectNoError(dataset)
  })

  test('cases 4-6: no file origin, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForDraft({ data_catalog: undefined, use_doi: true })

    await expectNoError(dataset)
  })

  test('case 7: Ida, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForDraft()

    await expectNoError(dataset)
  })

  test('case 8: Ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForDraft({ cumulative_state: CUMULATIVE_STATE.YES })

    await expectNoError(dataset)
  })

  test('case 9: Ida, urn, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForDraft({ cumulative_state: CUMULATIVE_STATE.CLOSED })

    await expectNoError(dataset)
  })

  test('case 10: Ida, doi, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForDraft({ use_doi: true })

    await expectNoError(dataset)
  })

  test('case 11: Ida, doi, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForDraft({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.YES,
    })

    await expectNoError(dataset)
  })

  test('case 12: Ida, doi, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForDraft({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.CLOSED,
    })

    await expectNoError(dataset)
  })

  test('case 13: remote resources, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForDraft({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
    })

    await expectNoError(dataset)
  })

  test('case 14: remote resources, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForDraft({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
      cumulative_state: CUMULATIVE_STATE.YES,
    })

    await expectNoError(dataset)
  })

  test('case 15: remote resources, urn, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForDraft({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
      cumulative_state: CUMULATIVE_STATE.CLOSED,
    })

    await expectNoError(dataset)
  })

  // Ui doesn't allow these, doi can be activated only for ida
  test('case 16-18: remote resources, doi, cumulative state', async () => {
    const dataset = generateDefaultDatasetForDraft({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
      use_doi: true,
    })

    await expectError(dataset, errors.wrongFileOrigin)
  })
})

describe('publish new dataset', () => {
  let Submit, mockQvain
  beforeEach(() => {
    mockQvain = createMockQvain()
    axios.post.mockReturnValue({
      data: {
        identifier: 'some identifier',
      },
    })
    Submit = new SubmitClass(mockQvain)
  })

  const expectNoError = async (dataset, cb) => {
    handleSubmitToBackend.mockReturnValue(dataset)
    qvainFormSchema.validate.mockReturnValue(
      realQvainFormSchema.validate(dataset, { strict: true })
    )

    try {
      await Submit.submitPublish(cb)
    } finally {
      expect(Submit.error).toBe(undefined)
    }
  }

  const expectError = async (dataset, error) => {
    handleSubmitToBackend.mockReturnValue(dataset)
    qvainFormSchema.validate.mockReturnValue(
      realQvainFormSchema.validate(dataset, { strict: true })
    )
    await Submit.submitPublish()
    expect(Submit.error?.message).toEqual(error)
  }

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call given callback', async () => {
    const dataset = generateDefaultDatasetForPublish()
    const mockCallback = jest.fn()
    await expectNoError(dataset, mockCallback)
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  test('should call axios.post twice', async () => {
    handleSubmitToBackend.mockReturnValue('dataset')
    qvainFormSchema.validate.mockReturnValue(Promise.resolve(undefined))
    await Submit.submitPublish()
    expect(axios.post.mock.calls[0]).toEqual([
      urls.qvain.datasets(),
      'dataset',
      {
        params: { draft: true },
      },
    ])
    expect(axios.post.mock.calls[1]).toEqual([
      urls.rpc.publishDataset(),
      null,
      { params: { identifier: 'some identifier' } },
    ])
  })

  test('case 19-21: no file origin, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: undefined })

    await expectError(dataset, errors.missingFileOrigin)
  })

  test('case 22-24: no file origin, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: undefined, use_doi: true })

    await expectError(dataset, errors.missingFileOrigin)
  })

  test('case 25: ida, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish()

    await expectNoError(dataset)
  })

  test('case 26: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulative_state: CUMULATIVE_STATE.YES })

    await expectNoError(dataset)
  })

  test('case 27: ida, urn, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulative_state: CUMULATIVE_STATE.CLOSED })

    await expectNoError(dataset)
  })

  test('case 28: ida, doi, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish({ use_doi: true })

    await expectNoError(dataset)
  })

  test('case 29: ida, doi, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({
      cumulative_state: CUMULATIVE_STATE.YES,
      use_doi: true,
    })

    await expectNoError(dataset)
  })

  test('case 30: ida, doi, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({
      cumulative_state: CUMULATIVE_STATE.CLOSED,
      use_doi: true,
    })

    await expectNoError(dataset)
  })

  test('case 31: external resources, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: DATA_CATALOG_IDENTIFIER.ATT })

    await expectNoError(dataset)
  })

  test('case 32: external resources, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
      cumulative_state: CUMULATIVE_STATE.YES,
    })

    await expectNoError(dataset)
  })

  test('case 33: external resources, urn, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
      cumulative_state: CUMULATIVE_STATE.CLOSED,
    })

    await expectNoError(dataset)
  })

  test('cases 34-36: external resources, doi, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
      use_doi: true,
    })

    await expectError(dataset, errors.wrongFileOrigin)
  })
})

describe('edit existing draft dataset', () => {
  let Submit, mockQvain
  const preparedDataset = { original: { identifier: 'some identifier' } }
  beforeEach(() => {
    mockQvain = createMockQvain({ original: { state: 'draft' } })
    axios.patch.mockReturnValue({
      data: {
        identifier: 'some identifier',
      },
    })
    Submit = new SubmitClass(mockQvain)
  })

  const expectNoError = async dataset => {
    handleSubmitToBackend.mockReturnValue({ ...preparedDataset, ...dataset })
    qvainFormDraftSchema.validate.mockReturnValue(
      realQvainFormDraftSchema.validate(dataset, { strict: true })
    )

    try {
      await Submit.submitDraft()
    } finally {
      expect(Submit.error).toBe(undefined)
    }
  }

  const expectError = async (dataset, error) => {
    handleSubmitToBackend.mockReturnValue({ ...preparedDataset, ...dataset })
    qvainFormDraftSchema.validate.mockReturnValue(
      realQvainFormDraftSchema.validate(dataset, { strict: true })
    )
    await Submit.submitDraft()
    expect(Submit.error?.message).toEqual(error)
  }

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call axios.patch with dataset and existing identifier', async () => {
    handleSubmitToBackend.mockReturnValue(preparedDataset)
    qvainFormDraftSchema.validate.mockReturnValue(Promise.resolve(undefined))
    await Submit.submitDraft()
    expect(axios.patch).toHaveBeenCalledWith(urls.qvain.dataset('some identifier'), preparedDataset)
  })

  test('cases 37-39: no file origin, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForDraft({ data_catalog: undefined })

    await expectNoError(dataset)
  })

  test('cases 40-42: no file origin, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForDraft({ data_catalog: undefined, use_doi: true })

    await expectError(dataset)
  })

  test('case 43: ida, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForDraft()

    await expectNoError(dataset)
  })

  test('case 44: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForDraft({ cumulative_state: CUMULATIVE_STATE.YES })

    await expectNoError(dataset)
  })

  test('case 45: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForDraft({ cumulative_state: CUMULATIVE_STATE.CLOSED })

    await expectNoError(dataset)
  })

  test('case 46: ida, doi, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForDraft({ use_doi: true })

    await expectNoError(dataset)
  })

  test('case 47: ida, doi, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForDraft({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.YES,
    })

    await expectNoError(dataset)
  })

  test('case 48: ida, doi, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForDraft({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.CLOSED,
    })

    await expectNoError(dataset)
  })

  test('case 49-51: ext resources, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForDraft({ data_catalog: DATA_CATALOG_IDENTIFIER.ATT })

    await expectNoError(dataset)
  })

  test('case 52-54: ext resources, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForDraft({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
      use_doi: true,
    })

    await expectError(dataset, errors.wrongFileOrigin)
  })
})

describe('publish existing draft dataset', () => {
  let Submit, mockQvain
  const preparedDataset = { original: { identifier: 'some identifier' } }
  beforeEach(() => {
    mockQvain = createMockQvain({ original: { state: 'draft' } })
    axios.post.mockReturnValue({
      data: {
        identifier: 'some identifier',
      },
    })
    axios.patch.mockReturnValue({
      data: {
        identifier: 'some identifier',
      },
    })
    Submit = new SubmitClass(mockQvain)
  })

  const expectNoError = async dataset => {
    handleSubmitToBackend.mockReturnValue({ ...preparedDataset, ...dataset })
    qvainFormSchema.validate.mockReturnValue(
      realQvainFormSchema.validate(dataset, { strict: true })
    )

    try {
      await Submit.submitPublish()
    } finally {
      expect(Submit.error).toBe(undefined)
    }
  }

  const expectError = async (dataset, error) => {
    handleSubmitToBackend.mockReturnValue({ ...preparedDataset, ...dataset })
    qvainFormSchema.validate.mockReturnValue(
      realQvainFormSchema.validate(dataset, { strict: true })
    )
    await Submit.submitPublish()
    expect(Submit.error?.message).toEqual(error)
  }

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call axios.patch and post', async () => {
    handleSubmitToBackend.mockReturnValue(preparedDataset)
    qvainFormSchema.validate.mockReturnValue(Promise.resolve(undefined))
    await Submit.submitPublish()

    expect(axios.patch).toHaveBeenCalledWith(
      urls.qvain.dataset(preparedDataset.original.identifier),
      preparedDataset
    )
    expect(axios.post).toHaveBeenCalledWith(urls.rpc.publishDataset(), null, {
      params: { identifier: preparedDataset.original.identifier },
    })
  })

  test('cases 55-57: no file origin, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: undefined })

    await expectError(dataset, errors.missingFileOrigin)
  })

  test('cases 58-60: no file origin, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: undefined, use_doi: true })

    await expectError(dataset, errors.missingFileOrigin)
  })

  test('case 61: ida, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish()

    await expectNoError(dataset)
  })

  test('case 62: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulative_state: CUMULATIVE_STATE.YES })

    await expectNoError(dataset)
  })

  test('case 63: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulative_state: CUMULATIVE_STATE.CLOSED })

    await expectNoError(dataset)
  })

  test('case 64: ida, doi, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish({ use_doi: true })

    await expectNoError(dataset)
  })

  test('case 65: ida, doi, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.YES,
    })

    await expectNoError(dataset)
  })

  test('case 66: ida, doi, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.CLOSED,
    })

    await expectNoError(dataset)
  })

  test('case 67-69: ext resources, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: DATA_CATALOG_IDENTIFIER.ATT })

    await expectNoError(dataset)
  })

  test('case 70-72: ext resources, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
      use_doi: true,
    })

    await expectError(dataset, errors.wrongFileOrigin)
  })
})

describe('save published dataset as draft', () => {
  let Submit, mockQvain
  const preparedDataset = { original: { identifier: 'some identifier' } }

  beforeEach(() => {
    mockQvain = createMockQvain({ original: { state: 'published' } })
    axios.post.mockReturnValue({
      data: {
        identifier: 'some identifier',
      },
    })
    axios.get.mockReturnValue({ data: { identifier: 'fresh id' } })
    axios.patch.mockReturnValue({
      data: {
        identifier: 'some other identifier',
      },
    })
    Submit = new SubmitClass(mockQvain)
  })

  const expectNoError = async dataset => {
    handleSubmitToBackend.mockReturnValue({
      ...dataset,
      original: { ...dataset.original, ...preparedDataset.original },
    })
    qvainFormDraftSchema.validate.mockReturnValue(
      realQvainFormDraftSchema.validate(dataset, { strict: true })
    )

    try {
      await Submit.submitDraft()
    } finally {
      expect(Submit.error).toBe(undefined)
    }
  }

  const expectError = async (dataset, error) => {
    handleSubmitToBackend.mockReturnValue({
      ...dataset,
      original: { ...dataset.original, ...preparedDataset.original },
    })
    qvainFormDraftSchema.validate.mockReturnValue(
      realQvainFormDraftSchema.validate(dataset, { strict: true })
    )
    await Submit.submitDraft()
    expect(Submit.error?.message).toEqual(error)
  }

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call axios.post to make new draft, patch to save changes', async () => {
    handleSubmitToBackend.mockReturnValue(preparedDataset)
    qvainFormDraftSchema.validate.mockReturnValue(Promise.resolve(undefined))
    await Submit.submitDraft()
    expect(axios.post).toHaveBeenCalledWith(urls.rpc.createDraft(), null, {
      params: { identifier: 'some identifier' },
    })
    expect(axios.get).toHaveBeenCalledWith(urls.qvain.dataset('some identifier'))
    expect(axios.patch).toHaveBeenCalledWith(urls.qvain.dataset('fresh id'), {
      original: { identifier: 'fresh id' },
    })
  })

  test('cases 73-75: no file origin, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForDraft({ data_catalog: undefined })

    await expectNoError(dataset)
  })

  test('cases 76-78: no file origin, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForDraft({ data_catalog: undefined, use_doi: true })

    await expectNoError(dataset)
  })

  test('case 79: ida, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForDraft()

    await expectNoError(dataset)
  })

  test('case 80: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForDraft({ cumulative_state: CUMULATIVE_STATE.YES })

    await expectNoError(dataset)
  })

  test('case 81: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForDraft({ cumulative_state: CUMULATIVE_STATE.CLOSED })

    await expectNoError(dataset)
  })

  test('case 82: ida, doi, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForDraft({ use_doi: true })

    await expectNoError(dataset)
  })

  test('case 83: ida, doi, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForDraft({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.YES,
    })

    await expectNoError(dataset)
  })

  test('case 84: ida, doi, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForDraft({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.CLOSED,
    })

    await expectNoError(dataset)
  })

  test('case 85-87: ext resources, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForDraft({ data_catalog: DATA_CATALOG_IDENTIFIER.ATT })

    await expectNoError(dataset)
  })

  test('case 88-90: ext resources, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForDraft({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
      use_doi: true,
    })

    await expectError(dataset, errors.wrongFileOrigin)
  })
})

describe('republish dataset', () => {
  let Submit, mockQvain
  const preparedDataset = { original: { identifier: 'some identifier' } }
  beforeEach(() => {
    mockQvain = createMockQvain({ original: { state: 'published', identifier: 'some identifier' } })
    axios.patch.mockReturnValue({
      data: {
        identifier: 'some identifier',
      },
    })
    axios.post.mockReturnValue({
      data: {
        identifier: 'some identifier',
      },
    })
    axios.get.mockReturnValue({
      data: {
        identifier: 'some identifier',
      },
    })
    Submit = new SubmitClass(mockQvain)
  })

  const expectNoError = async dataset => {
    handleSubmitToBackend.mockReturnValue({
      ...dataset,
      original: { ...dataset.original, ...preparedDataset.original },
    })
    qvainFormSchema.validate.mockReturnValue(
      realQvainFormSchema.validate(dataset, { strict: true })
    )

    try {
      await Submit.submitPublish()
    } finally {
      expect(Submit.error).toBe(undefined)
    }
  }

  const expectError = async (dataset, error) => {
    handleSubmitToBackend.mockReturnValue({
      ...dataset,
      original: { ...dataset.original, ...preparedDataset.original },
    })
    qvainFormSchema.validate.mockReturnValue(
      realQvainFormSchema.validate(dataset, { strict: true })
    )
    await Submit.submitPublish()
    expect(Submit.error?.message).toEqual(error)
  }

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call axios.patch with dataset and existing identifier', async () => {
    handleSubmitToBackend.mockReturnValue(preparedDataset)
    qvainFormSchema.validate.mockReturnValue(Promise.resolve(undefined))
    await Submit.submitDraft()
    expect(axios.patch).toHaveBeenCalledWith(urls.qvain.dataset('some identifier'), preparedDataset)
  })

  test('cases 91-93: no file origin, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: undefined })

    await expectError(dataset, errors.missingFileOrigin)
  })

  test('cases 94-96: no file origin, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: undefined, use_doi: true })

    await expectError(dataset, errors.missingFileOrigin)
  })

  test('case 97: ida, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish()

    await expectNoError(dataset)
  })

  test('case 98: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulative_state: CUMULATIVE_STATE.YES })

    await expectNoError(dataset)
  })

  test('case 99: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulative_state: CUMULATIVE_STATE.CLOSED })

    await expectNoError(dataset)
  })

  test('case 100: ida, doi, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish({ use_doi: true })

    await expectNoError(dataset)
  })

  test('case 101: ida, doi, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.YES,
    })

    await expectNoError(dataset)
  })

  test('case 102: ida, doi, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.CLOSED,
    })

    await expectNoError(dataset)
  })

  test('case 103-105: ext resources, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: DATA_CATALOG_IDENTIFIER.ATT })

    await expectNoError(dataset)
  })

  test('case 106-108: ext resources, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
      use_doi: true,
    })

    await expectError(dataset, errors.wrongFileOrigin)
  })
})

// cases 109 - 126
// saving an unpublished dataset as a draft is code-wise the same thing than updating a draft
// no need to test.

// create an draft from published dataset and publish it
describe('publish unpublished dataset', () => {
  let Submit, mockQvain
  const preparedDataset = {
    original: {
      identifier: 'some identifier',
    },
  }
  beforeEach(() => {
    mockQvain = createMockQvain({
      original: {
        state: 'draft',
        draft_of: { identifier: 'some other identifier' },
      },
    })
    axios.post.mockReturnValue({
      data: {
        identifier: 'some identifier',
      },
    })
    axios.patch.mockReturnValue({
      data: {
        identifier: 'some identifier',
      },
    })
    axios.get.mockReturnValue({
      data: {
        identifier: 'some identifier',
      },
    })

    Submit = new SubmitClass(mockQvain)
  })

  const expectNoError = async dataset => {
    handleSubmitToBackend.mockReturnValue({
      ...dataset,
      original: { ...dataset.original, ...preparedDataset.original },
    })
    qvainFormSchema.validate.mockReturnValue(
      realQvainFormSchema.validate(dataset, { strict: true })
    )

    try {
      await Submit.submitPublish()
    } finally {
      expect(Submit.error).toBe(undefined)
    }
  }

  const expectError = async (dataset, error) => {
    handleSubmitToBackend.mockReturnValue({
      ...dataset,
      original: { ...dataset.original, ...preparedDataset.original },
    })
    qvainFormSchema.validate.mockReturnValue(
      realQvainFormSchema.validate(dataset, { strict: true })
    )
    await Submit.submitPublish()
    expect(Submit.error?.message).toEqual(error)
  }

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call axios.patch with dataset and existing identifier', async () => {
    handleSubmitToBackend.mockReturnValue(preparedDataset)
    qvainFormSchema.validate.mockReturnValue(Promise.resolve(undefined))
    await Submit.submitPublish()
    expect(axios.post).toHaveBeenCalledWith(urls.rpc.mergeDraft(), null, {
      params: { identifier: 'some identifier' },
    })
    expect(axios.patch).toHaveBeenCalledWith(urls.qvain.dataset('some identifier'), preparedDataset)
  })

  test('cases 127-129: no file origin, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: undefined })

    await expectError(dataset, errors.missingFileOrigin)
  })

  test('cases 130-132: no file origin, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: undefined, use_doi: true })

    await expectError(dataset, errors.missingFileOrigin)
  })

  test('case 133: ida, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish()

    await expectNoError(dataset)
  })

  test('case 134: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulative_state: CUMULATIVE_STATE.YES })

    await expectNoError(dataset)
  })

  test('case 135: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulative_state: CUMULATIVE_STATE.CLOSED })

    await expectNoError(dataset)
  })

  test('case 136: ida, doi, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish({ use_doi: true })

    await expectNoError(dataset)
  })

  test('case 137: ida, doi, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.YES,
    })

    await expectNoError(dataset)
  })

  test('case 138: ida, doi, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({
      use_doi: true,
      cumulative_state: CUMULATIVE_STATE.CLOSED,
    })

    await expectNoError(dataset)
  })

  test('case 139-141: ext resources, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ data_catalog: DATA_CATALOG_IDENTIFIER.ATT })

    await expectNoError(dataset)
  })

  test('case 142-144: ext resources, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({
      data_catalog: DATA_CATALOG_IDENTIFIER.ATT,
      use_doi: true,
    })

    await expectError(dataset, errors.wrongFileOrigin)
  })
})

describe('required fields', () => {
  const expectDraftErrors = (settings, expectedErrors) => {
    const dataset = generateDefaultDatasetForDraft(settings)
    let errors
    try {
      realQvainFormDraftSchema.validateSync(dataset, { strict: true })
    } catch (e) {
      errors = e.errors
    }
    expect(errors).toEqual(expectedErrors)
  }

  const expectPublishErrors = (settings, expectedErrors) => {
    const dataset = generateDefaultDatasetForPublish(settings)
    let errors
    try {
      realQvainFormSchema.validateSync(dataset, { strict: true })
    } catch (e) {
      errors = e.errors
    }
    expect(errors).toEqual(expectedErrors)
  }

  describe('draft', () => {
    it('should require title object', async () => {
      expectDraftErrors({ title: undefined }, ['qvain.validationMessages.title.required'])
    })

    it('should require title object to have a translation', async () => {
      expectDraftErrors({ title: {} }, ['qvain.validationMessages.title.required'])
    })
  })

  describe('published', () => {
    it('should require data catalog', async () => {
      expectPublishErrors({ data_catalog: undefined }, [
        'qvain.validationMessages.files.dataCatalog.required',
      ])
    })

    it('should require title object', async () => {
      expectPublishErrors({ title: undefined }, ['qvain.validationMessages.title.required'])
    })

    it('should require title object to have a translation', async () => {
      expectPublishErrors({ title: {} }, ['qvain.validationMessages.title.required'])
    })

    it('should require description object', async () => {
      expectPublishErrors({ description: undefined }, [
        'qvain.validationMessages.description.required',
      ])
    })

    it('should require description object to have a translation', async () => {
      expectPublishErrors({ description: {} }, ['qvain.validationMessages.description.required'])
    })

    it('should require keywords array', async () => {
      expectPublishErrors({ keyword: undefined }, ['qvain.validationMessages.keywords.required'])
    })

    it('should require keywords array to not be empty', async () => {
      expectPublishErrors({ keyword: [] }, ['qvain.validationMessages.keywords.required'])
    })

    it('should require creator array', async () => {
      expectPublishErrors({ creator: undefined }, [
        'qvain.validationMessages.actors.requiredActors.creator',
      ])
    })

    it('should require creator array to not be empty', async () => {
      expectPublishErrors({ creator: [] }, [
        'qvain.validationMessages.actors.requiredActors.creator',
      ])
    })

    it('should require publisher', async () => {
      expectPublishErrors({ publisher: undefined }, [
        'qvain.validationMessages.actors.requiredActors.publisher',
      ])
    })

    it('should require access_rights object', async () => {
      expectPublishErrors({ access_rights: undefined }, [
        'qvain.validationMessages.accessType.required',
      ])
    })

    it('should require access_rights.access_type object', async () => {
      expectPublishErrors({ access_rights: {} }, ['qvain.validationMessages.accessType.required'])
    })

    it('should require access_rights.access_type object to not be empty', async () => {
      expectPublishErrors({ access_rights: { access_type: {} } }, [
        'qvain.validationMessages.accessType.required',
      ])
    })
  })
})
