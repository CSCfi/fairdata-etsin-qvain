import 'chai/register-expect'

import handleSubmit from '../../js/components/qvain/utils/handleSubmit'

describe('when calling handleSubmit with mockStores', () => {
  const getMockStores = dataCatalog => ({
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
        toBackend: jest.fn(() => 'otherIdentifiers'),
      },
      Infrastructures: {
        toBackend: jest.fn(() => 'infrastructures'),
      },
      dataCatalog,
      cumulativeState: 'cumulativeState',
      useDoi: 'useDoi',
      ExternalResources: {
        toBackend: jest.fn(() => 'externalResources'),
      },
    },
  })

  const expectedReturnCommon = {
    title: 'title',
    description: 'description',
    other_identifier: 'otherIdentifiers',
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
    // remote_resources: undefined,
    // dataCatalog: 'dataCatalog',
    cumulativeState: 'cumulativeState',
    useDoi: 'useDoi',
    is_output_of: 'projects',
    spatial: 'spatial',
    temporal: 'temporal',
    relation: 'relation',
    provenance: 'provenance',
    field_of_science: 'field_of_science',
    language: 'language',
    issued: 'issuedDate',
  }

  const expectedReturnATT = {
    ...expectedReturnCommon,
    remote_resources: 'externalResources',
    dataCatalog: 'urn:nbn:fi:att:data-catalog-att',
  }

  const expectedReturnIDA = {
    ...expectedReturnCommon,
    dataCatalog: 'urn:nbn:fi:att:data-catalog-ida',
  }

  test('should return data with external resources', () => {
    const returnValue = handleSubmit(getMockStores('urn:nbn:fi:att:data-catalog-att').Qvain)
    returnValue.should.deep.eql(expectedReturnATT)
  })

  test('should return data without external resources', () => {
    const returnValue = handleSubmit(getMockStores('urn:nbn:fi:att:data-catalog-ida').Qvain)
    returnValue.should.deep.eql(expectedReturnIDA)
  })
})
