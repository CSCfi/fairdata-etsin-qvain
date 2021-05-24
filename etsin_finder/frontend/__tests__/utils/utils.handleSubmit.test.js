import 'chai/register-expect'

import handleSubmit from '../../js/components/qvain/utils/handleSubmit'

describe('when calling handleSubmit with mockStores', () => {
  let returnValue
  const mockStores = {
    Qvain: {
      Title: {
        toBackend: jest.fn(() => 'title'),
      },
      Description: {
        toBackend: jest.fn(() => 'description'),
      },
      SubjectHeadings: {
        toBackend: jest.fn(() => 'theme'),
      },
      Actors: {
        toBackend: jest.fn(() => 'actors'),
      },
      Spatials: {
        toBackend: jest.fn(() => 'spatial'),
      },
      Temporals: {
        toBackend: jest.fn(() => 'temporal'),
      },
      RelatedResources: {
        toBackend: jest.fn(() => 'relation'),
      },
      Provenances: {
        toBackend: jest.fn(() => 'provenance'),
      },
      FieldOfSciences: {
        toBackend: jest.fn(() => 'fieldOfScience'),
      },
      DatasetLanguages: {
        toBackend: jest.fn(() => 'datasetLanguage'),
      },
      IssuedDate: {
        toBackend: jest.fn(() => 'issuedDate'),
      },
      AccessType: {
        toBackend: jest.fn(() => 'accessType'),
      },
      Projects: {
        toBackend: jest.fn(() => 'projects'),
      },
      Licenses: {
        toBackend: jest.fn(() => 'license'),
      },
      EmbargoExpDate: {
        toBackend: jest.fn(() => 'embargoDate'),
      },
      RestrictionGrounds: {
        toBackend: jest.fn(() => 'restrictionGrounds'),
      },
      Keywords: {
        toBackend: jest.fn(() => 'keywords'),
      },
      OtherIdentifiers: {
        storage: 'identifiers',
      },
      Infrastructures: {
        storage: 'infrastructures',
      },
      dataCatalog: 'dataCatalog',
      cumulativeState: 'cumulativeState',
      useDoi: 'useDoi',
      externalResources: ['externalResources'],
    },
  }

  beforeEach(() => {
    returnValue = handleSubmit(mockStores.Qvain)
  })

  test('should return expectedReturn', () => {
    const expectedReturn = {
      title: 'title',
      description: 'description',
      identifiers: 'identifiers',
      keywords: 'keywords',
      theme: 'theme',
      actors: 'actors',
      infrastructure: 'infrastructures',
      restrictionGrounds: 'restrictionGrounds',
      embargoDate: 'embargoDate',
      license: 'license',
      // Send no values if empty instead of empty values.
      remote_resources: ['externalResources'],
      dataCatalog: 'dataCatalog',
      cumulativeState: 'cumulativeState',
      useDoi: 'useDoi',
      projects: 'projects',
      spatial: 'spatial',
      temporal: 'temporal',
      relation: 'relation',
      provenance: 'provenance',
      fieldOfScience: 'fieldOfScience',
      datasetLanguage: 'datasetLanguage',
      issuedDate: 'issuedDate',
      accessType: 'accessType',
    }

    returnValue.should.deep.eql(expectedReturn)
  })
})
