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
        toBackend: jest.fn(() => ({
          creator: 'creator',
          publisher: 'publisher',
          rights_holder: 'rights_holder',
          curator: 'curator',
          contributor: 'contributor',
        })),
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
        toBackend: jest.fn(() => 'field_of_science'),
      },
      DatasetLanguages: {
        toBackend: jest.fn(() => 'language'),
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
        toBackend: jest.fn(() => 'infrastructures'),
      },
      dataCatalog: 'dataCatalog',
      cumulativeState: 'cumulativeState',
      useDoi: 'useDoi',
      ExternalResources: {
        toBackend: jest.fn(() => 'externalResources'),
      },
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
      creator: 'creator',
      publisher: 'publisher',
      rights_holder: 'rights_holder',
      curator: 'curator',
      contributor: 'contributor',
      infrastructure: 'infrastructures',
      access_rights: {
        license: 'license',
        access_type: 'accessType',
        available: 'embargoDate',
        restriction_grounds: 'restrictionGrounds',
      },
      remote_resources: 'externalResources',
      dataCatalog: 'dataCatalog',
      cumulativeState: 'cumulativeState',
      useDoi: 'useDoi',
      projects: 'projects',
      spatial: 'spatial',
      temporal: 'temporal',
      relation: 'relation',
      provenance: 'provenance',
      field_of_science: 'field_of_science',
      language: 'language',
      issuedDate: 'issuedDate',
    }

    returnValue.should.deep.eql(expectedReturn)
  })
})
