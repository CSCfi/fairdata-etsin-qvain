import { expect } from 'chai'

import handleSubmit from '../../js/components/qvain/utils/handleSubmit'
import { ACCESS_TYPE_URL } from '../../js/utils/constants'

const fakeNow = new Date('2022-09-22T12:34:00.000Z')
jest.useFakeTimers('modern').setSystemTime(fakeNow)

describe('when calling handleSubmit with mockStores', () => {
  const getMockStores = ({ dataCatalog, accessType = ACCESS_TYPE_URL.OPEN }) => ({
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
        toBackend: jest.fn(() => ({ identifier: accessType })),
      },
      ProjectV2: {
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
      Env: {
        Flags: {
          flagEnabled: jest.fn(false),
        },
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
      access_type: { identifier: ACCESS_TYPE_URL.OPEN },
      available: 'embargoDate',
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
    modified: fakeNow.toISOString(),
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

  const expectedReturnRestricted = {
    ...expectedReturnIDA,
    access_rights: {
      ...expectedReturnIDA.access_rights,
      access_type: { identifier: ACCESS_TYPE_URL.RESTRICTED },
      restriction_grounds: 'restrictionGrounds',
    },
    dataCatalog: 'urn:nbn:fi:att:data-catalog-ida',
  }

  test('should return data with external resources', () => {
    const returnValue = handleSubmit(
      getMockStores({ dataCatalog: 'urn:nbn:fi:att:data-catalog-att' }).Qvain
    )
    returnValue.should.deep.eql(expectedReturnATT)
  })

  test('should return data without external resources', () => {
    const returnValue = handleSubmit(
      getMockStores({ dataCatalog: 'urn:nbn:fi:att:data-catalog-ida' }).Qvain
    )
    returnValue.should.deep.eql(expectedReturnIDA)
  })

  test('should return data with restriction grounds', () => {
    const returnValue = handleSubmit(
      getMockStores({
        dataCatalog: 'urn:nbn:fi:att:data-catalog-ida',
        accessType: ACCESS_TYPE_URL.RESTRICTED,
      }).Qvain
    )
    returnValue.should.deep.eql(expectedReturnRestricted)
  })
})
