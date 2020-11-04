/*
 **  Files v2 submit cases frontend tests
 **
 **  Files v2 has 144 theoretical test conditions. About half of these cases are inactive or not possible at all.
 **  The ultimate goal is to test out all the test cases that can be tested. Tests lean heavily on the documentation found in the link below.
 **  The cases are named after the theoretical number column. There's also bunch of typical tests that were made during the development of qvaim.submit
 **  class. You can find them from the start of the tests.
 **
 **  Tests ends up in possible error or or axios action. Tests don't test out the actual response, it trusts that backend is tested properly.
 **
 **  for more info: https://wiki.eduuni.fi/pages/viewpage.action?pageId=162084194
 */

import SubmitClass from '../js/stores/view/qvain.submit'
import axios from 'axios'
import handleSubmitToBackend from '../js/components/qvain/utils/handleSubmit'
import moment from 'moment'
import { CUMULATIVE_STATE, DATA_CATALOG_IDENTIFIER, ACCESS_TYPE_URL } from '../js/utils/constants'
import '../locale/translations'

// first half of the tests mocks qvainFormSchema but the rest of the tests uses actual module
import { qvainFormSchema } from '../js/components/qvain/utils/formValidation'
import { ValidationError } from 'yup'
const realQvainFormSchema = jest.requireActual('../js/components/qvain/utils/formValidation')
  .qvainFormSchema

jest.mock('axios')

jest.mock('../js/components/qvain/utils/handleSubmit', () => {
  return jest.fn()
})

jest.mock('../js/components/qvain/utils/formValidation', () => {
  return {
    qvainFormSchema: {
      validate: jest.fn(),
    },
  }
})

const errors = {
  missingFileOrigin: 'File origin is required.',
  wrongFileOrigin: 'Doi can be used only with Ida datasets.',
}

const generateDefaultDatasetForPublish = settings => ({
  title: { fi: 'otsikko', en: 'title' },
  description: { fi: 'kuvailu', en: 'description' },
  issuedDate: moment().format('YYYY-MM-DD'), // needs to be mocked if using snapshots
  keywords: ['key', 'words'],
  actors: [
    {
      type: 'organization',
      roles: ['publisher', 'creator'],
      organizations: [
        {
          name: {
            en: 'University of Helsinki',
            fi: 'Helsingin yliopisto',
            sv: 'Helsingfors universitet',
            und: 'Helsingin yliopisto',
          },
          identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/01901',
        },
      ],
    },
  ],
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
  accessType: { url: ACCESS_TYPE_URL.OPEN },
  cumulativeState: CUMULATIVE_STATE.NO,
  useDoi: false,
  dataCatalog: DATA_CATALOG_IDENTIFIER.IDA,
  ...settings,
})

const createMockQvain = () => {
  return {
    checkProvenanceActors: jest.fn(() => true),
    addUnsavedMultiValueFields: jest.fn(),
    cleanupOtherIdentifiers: jest.fn(() => true),
  }
}

describe('Submit.exec()', () => {
  let Submit, mockQvain, submitFunction

  const exec = async (init = () => {}) => {
    init()
    await Submit.exec(submitFunction)
  }

  beforeEach(() => {
    handleSubmitToBackend.mockReturnValue(generateDefaultDatasetForPublish())
    submitFunction = jest.fn()
    mockQvain = createMockQvain()
    Submit = new SubmitClass(mockQvain)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('exec, should call submit function', async () => {
    await exec()
    expect(submitFunction).toHaveBeenCalled()
    expect(Submit.isLoading).toBe(false)
  })

  test('false from checkProvenanceActors should cancel post', async () => {
    await exec(() => mockQvain.checkProvenanceActors.mockReturnValue(false))
    expect(mockQvain.checkProvenanceActors).toHaveBeenCalledTimes(1)
    expect(submitFunction).not.toHaveBeenCalled()
  })

  test('false from cleanupOtherIdentifiers should cancel post', async () => {
    await exec(() => mockQvain.cleanupOtherIdentifiers.mockReturnValue(false))
    expect(mockQvain.cleanupOtherIdentifiers).toHaveBeenCalledTimes(1)
    expect(axios.post).not.toHaveBeenCalled()
  })

  test('should call addUnsavedMultiValueFields', async () => {
    await exec()
    expect(mockQvain.addUnsavedMultiValueFields).toHaveBeenCalledTimes(1)
  })

  test('should set useDoiModalIsOpen to false', async () => {
    await exec(() => Submit.openUseDoiModal())
    expect(Submit.useDoiModalIsOpen).toBe(false)
  })

  test('should call handleSubmitToBackend', async () => {
    await exec()
    expect(handleSubmitToBackend).toHaveBeenCalledTimes(1)
  })

  test('should call qvainFormSchema.validate', async () => {
    await exec()
    expect(qvainFormSchema.validate).toHaveBeenCalledTimes(1)
  })
})

describe('submitDraft', () => {
  let Submit, mockQvain
  beforeEach(() => {
    mockQvain = createMockQvain()
    Submit = new SubmitClass(mockQvain)
  })

  const expectNoError = async dataset => {
    handleSubmitToBackend.mockReturnValue(dataset)
    qvainFormSchema.validate.mockReturnValue(realQvainFormSchema.validate(dataset))

    try {
      await Submit.submitDraft()
    } catch (e) {
      expect().toBe(true)
    } finally {
      expect(Submit.error).toBe(undefined)
    }
  }

  const expectError = async (dataset, error) => {
    handleSubmitToBackend.mockReturnValue(dataset)
    qvainFormSchema.validate.mockReturnValue(realQvainFormSchema.validate(dataset))

    await expect(Submit.submitDraft()).rejects.toThrow(error)
  }

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('cases 1-3: no file origin, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ dataCatalog: undefined })
    await expectError(dataset, errors.missingFileOrigin)
  })

  test('cases 4-6: no file origin, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ dataCatalog: undefined, useDoi: true })

    await expectError(dataset, errors.wrongFileOrigin)
  })

  test('case 7: Ida, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish()

    await expectNoError(dataset)
  })

  test('case 8: Ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulativeState: CUMULATIVE_STATE.YES })

    await expectNoError(dataset)
  })

  test('case 9: Ida, urn, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulativeState: CUMULATIVE_STATE.CLOSED })

    await expectNoError(dataset)
  })

  test('case 10: Ida, doi, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish({ useDoi: true })

    await expectNoError(dataset)
  })

  test('case 11: Ida, doi, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({
      useDoi: true,
      cumulativeState: CUMULATIVE_STATE.YES,
    })

    await expectNoError(dataset)
  })

  test('case 12: Ida, doi, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({
      useDoi: true,
      cumulativeState: CUMULATIVE_STATE.CLOSED,
    })

    await expectNoError(dataset)
  })

  test('case 13: remote resources, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish({
      dataCatalog: DATA_CATALOG_IDENTIFIER.ATT,
    })

    await expectNoError(dataset)
  })

  test('case 14: remote resources, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({
      dataCatalog: DATA_CATALOG_IDENTIFIER.ATT,
      cumulativeState: CUMULATIVE_STATE.YES,
    })

    await expectNoError(dataset)
  })

  test('case 15: remote resources, urn, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({
      dataCatalog: DATA_CATALOG_IDENTIFIER.ATT,
      cumulativeState: CUMULATIVE_STATE.CLOSED,
    })

    await expectNoError(dataset)
  })

  // Ui doesn't allow these, doi can be activated only for ida
  test('case 16-18: remote resources, doi, cumulative state', async () => {
    const dataset = generateDefaultDatasetForPublish({
      dataCatalog: DATA_CATALOG_IDENTIFIER.ATT,
      useDoi: true,
    })

    await expectError(dataset, errors.wrongFileOrigin)
  })
})

describe('publish new dataset', () => {
  let Submit, mockQvain
  beforeEach(() => {
    mockQvain = createMockQvain()
    Submit = new SubmitClass(mockQvain)
  })

  const expectNoError = async dataset => {
    handleSubmitToBackend.mockReturnValue(dataset)
    qvainFormSchema.validate.mockReturnValue(realQvainFormSchema.validate(dataset))

    try {
      await Submit.submitPublish()
    } finally {
      expect(Submit.error).toBe(undefined)
    }
  }

  const expectError = async (dataset, error) => {
    handleSubmitToBackend.mockReturnValue(dataset)
    qvainFormSchema.validate.mockReturnValue(realQvainFormSchema.validate(dataset))

    await expect(Submit.submitPublish()).rejects.toThrow()
  }

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('case 19-21: no file origin, urn, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ dataCatalog: undefined })

    await expectError(dataset, errors.missingFileOrigin)
  })

  test('case 22-24: no file origin, doi, cumulative state any', async () => {
    const dataset = generateDefaultDatasetForPublish({ dataCatalog: undefined, useDoi: true })

    await expectError(dataset, errors.missingFileOrigin)
  })

  test('case 25: ida, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish()

    await expectNoError(dataset)
  })

  test('case 26: ida, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulativeState: CUMULATIVE_STATE.YES })

    expectNoError(dataset)
  })

  test('case 27: ida, urn, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({ cumulativeState: CUMULATIVE_STATE.CLOSED })

    expectNoError(dataset)
  })

  test('case 28: ida, doi, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish({ useDoi: true })

    await expectNoError(dataset)
  })

  test('case 29: ida, doi, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({
      cumulativeState: CUMULATIVE_STATE.YES,
      useDoi: true,
    })

    expectNoError(dataset)
  })

  test('case 30: ida, doi, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({
      cumulativeState: CUMULATIVE_STATE.CLOSED,
      useDoi: true,
    })

    expectNoError(dataset)
  })

  test('case 31: external resources, urn, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish({ dataCatalog: DATA_CATALOG_IDENTIFIER.ATT })

    await expectNoError(dataset)
  })

  test('case 32: external resources, urn, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({
      dataCatalog: DATA_CATALOG_IDENTIFIER.ATT,
      cumulativeState: CUMULATIVE_STATE.YES,
    })

    expectNoError(dataset)
  })

  test('case 33: external resources, urn, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({
      dataCatalog: DATA_CATALOG_IDENTIFIER.ATT,
      cumulativeState: CUMULATIVE_STATE.CLOSED,
    })

    expectNoError(dataset)
  })

  test('case 34: external resources, doi, cumulative state no', async () => {
    const dataset = generateDefaultDatasetForPublish({
      dataCatalog: DATA_CATALOG_IDENTIFIER.ATT,
      useDoi: true,
    })

    await expectError(dataset, errors.wrongFileOrigin)
  })

  test('case 35: external resources, doi, cumulative state yes', async () => {
    const dataset = generateDefaultDatasetForPublish({
      dataCatalog: DATA_CATALOG_IDENTIFIER.ATT,
      cumulativeState: CUMULATIVE_STATE.YES,
      useDoi: true,
    })

    expectError(dataset, errors.wrongFileOrigin)
  })

  test('case 36: external resources, doi, cumulative state closed', async () => {
    const dataset = generateDefaultDatasetForPublish({
      dataCatalog: DATA_CATALOG_IDENTIFIER.ATT,
      cumulativeState: CUMULATIVE_STATE.CLOSED,
      useDoi: true,
    })

    expectError(dataset, errors.wrongFileOrigin)
  })
})
